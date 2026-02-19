import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Person } from '../entities/person.entity';
import { ChildDetails } from '../entities/child.entity';
import { CreateChildDto } from '../dto/create-child.dto';
import { FileService } from './file.service';

// Champs qui appartiennent à Person (table persons)
const PERSON_FIELDS = [
  'nomPrenoms',
  'sexe',
  'nationalite',
  'ethnie',
  'lieuResidence',
  'baptiseSaintEsprit',
  'niveauEtudes',
];

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    @InjectRepository(ChildDetails)
    private childDetailsRepository: Repository<ChildDetails>,
    private fileService: FileService,
    private dataSource: DataSource,
  ) {}

  /**
   * Génère une référence unique basée sur les initiales du nom
   * Format: ABC-123456 (initiales + 6 chiffres aléatoires)
   */
  private async generateReference(nomPrenoms: string): Promise<string> {
    const initials = nomPrenoms
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3)
      .padEnd(2, 'X');

    let reference: string;
    let exists = true;

    while (exists) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      reference = `${initials}-${randomNumber}`;

      const existing = await this.personRepository.findOne({
        where: { reference },
      });
      exists = !!existing;
    }

    return reference!;
  }

  async create(createChildDto: CreateChildDto): Promise<Person> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const slug = this.fileService.generateSlug();

      // Générer la référence unique
      const reference = await this.generateReference(
        createChildDto.nomPrenoms || 'ENFANT',
      );

      // Séparer les champs Person et ChildDetails
      const personData: Partial<Person> = {
        type: 'child',
        slug,
        reference,
      };
      const childDetailsData: Partial<ChildDetails> = {};

      // Répartir les champs
      for (const [key, value] of Object.entries(createChildDto)) {
        if (key === 'photo' || key === 'childDetails') continue;
        if (PERSON_FIELDS.includes(key)) {
          (personData as any)[key] = value;
        } else {
          (childDetailsData as any)[key] = value;
        }
      }

      // Créer la personne
      const person = queryRunner.manager.create(Person, personData);
      const savedPerson = await queryRunner.manager.save(person);

      // Créer les détails de l'enfant
      const childDetails = queryRunner.manager.create(ChildDetails, {
        ...childDetailsData,
        personId: savedPerson.id,
      });
      await queryRunner.manager.save(childDetails);

      // Sauvegarder la photo si présente (dans la même transaction)
      if (createChildDto.photo) {
        await this.fileService.saveBase64Image(
          createChildDto.photo,
          savedPerson.id,
          'photo_identite',
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      // Retourner la personne avec ses relations
      return this.findOne(savedPerson.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Person[]> {
    return this.personRepository.find({
      where: { type: 'child' },
      relations: ['childDetails', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Person | null> {
    return this.personRepository.findOne({
      where: { id, type: 'child' },
      relations: ['childDetails', 'images'],
    });
  }

  async findBySlug(slug: string): Promise<Person | null> {
    return this.personRepository.findOne({
      where: { slug, type: 'child' },
      relations: ['childDetails', 'images'],
    });
  }

  async update(
    id: string,
    updateChildDto: Partial<CreateChildDto>,
  ): Promise<Person | null> {
    const person = await this.findOne(id);
    if (!person) {
      return null;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Séparer les champs Person et ChildDetails
      const personData: Partial<Person> = {};
      const childDetailsData: Partial<ChildDetails> = {};

      for (const [key, value] of Object.entries(updateChildDto)) {
        if (key === 'photo' || key === 'childDetails') continue;
        if (PERSON_FIELDS.includes(key)) {
          (personData as any)[key] = value;
        } else {
          (childDetailsData as any)[key] = value;
        }
      }

      // Mettre à jour la personne
      if (Object.keys(personData).length > 0) {
        await queryRunner.manager.update(Person, id, personData);
      }

      // Mettre à jour les détails de l'enfant
      if (Object.keys(childDetailsData).length > 0 && person.childDetails) {
        await queryRunner.manager.update(
          ChildDetails,
          person.childDetails.id,
          childDetailsData,
        );
      }

      // Mettre à jour la photo si fournie
      if (updateChildDto.photo) {
        // Supprimer l'ancienne photo
        await this.fileService.deleteImagesByPersonId(id);
        // Sauvegarder la nouvelle
        await this.fileService.saveBase64Image(
          updateChildDto.photo,
          id,
          'photo_identite',
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<boolean> {
    const person = await this.findOne(id);
    if (!person) {
      return false;
    }

    // Supprimer les images associées
    await this.fileService.deleteImagesByPersonId(id);

    // Supprimer la personne (cascade supprime childDetails)
    await this.personRepository.remove(person);
    return true;
  }

  async count(): Promise<number> {
    return this.personRepository.count({ where: { type: 'child' } });
  }

  async findByReferenceAndContact(
    reference: string,
    contactParents: string,
  ): Promise<Person | null> {
    const person = await this.personRepository.findOne({
      where: { reference, type: 'child' },
      relations: ['childDetails', 'images'],
    });

    if (!person) return null;

    // Vérifier le contact des parents dans childDetails
    const parentContact = person.childDetails?.contactParents?.trim();
    if (!parentContact || parentContact !== contactParents) {
      return null;
    }

    return person;
  }

  async getStats(): Promise<{
    total: number;
    byGender: { masculin: number; feminin: number };
    byEducationLevel: Record<string, number>;
  }> {
    const children = await this.findAll();

    const byGender = {
      masculin: children.filter((c) => c.sexe === 'masculin').length,
      feminin: children.filter((c) => c.sexe === 'feminin').length,
    };

    const byEducationLevel: Record<string, number> = {};
    children.forEach((c) => {
      const level = c.niveauEtudes || 'non_specifie';
      byEducationLevel[level] = (byEducationLevel[level] || 0) + 1;
    });

    return {
      total: children.length,
      byGender,
      byEducationLevel,
    };
  }
}
