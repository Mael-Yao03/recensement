import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Person } from '../entities/person.entity';
import { MemberDetails } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
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

// Champs qui doivent être convertis de JSON string en tableau
const ARRAY_FIELDS = [
  'groupesActuels',
  'groupesSouhaites',
  'disponibiliteActivites',
  'competences',
  'domainesAppui',
  'typeFormation',
];

// Fonction utilitaire pour parser les champs JSON
function parseArrayField(value: any): string[] | null {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      // Si ce n'est pas du JSON valide, retourner comme élément unique
      return value ? [value] : null;
    }
  }
  return null;
}

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    @InjectRepository(MemberDetails)
    private memberDetailsRepository: Repository<MemberDetails>,
    private fileService: FileService,
    private dataSource: DataSource,
  ) {}

  /**
   * Génère une référence unique basée sur les initiales du nom
   * Format: ABC-123456 (initiales + 6 chiffres aléatoires)
   */
  private async generateReference(nomPrenoms: string): Promise<string> {
    // Extraire les initiales du nom et prénoms
    const initials = nomPrenoms
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3) // Maximum 3 initiales
      .padEnd(2, 'X'); // Minimum 2 caractères

    // Générer un numéro unique
    let reference: string;
    let exists = true;
    
    while (exists) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6 chiffres
      reference = `${initials}-${randomNumber}`;
      
      // Vérifier si la référence existe déjà
      const existing = await this.personRepository.findOne({
        where: { reference },
      });
      exists = !!existing;
    }
    
    return reference!;
  }

  async create(createMemberDto: CreateMemberDto): Promise<Person> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const slug = this.fileService.generateSlug();
      
      // Générer la référence unique
      const reference = await this.generateReference(createMemberDto.nomPrenoms || 'MEMBRE');

      // Séparer les champs Person et MemberDetails
      const personData: Partial<Person> = {
        type: 'member',
        slug,
        reference,
      };
      const memberDetailsData: Partial<MemberDetails> = {};

      // Répartir les champs
      for (const [key, value] of Object.entries(createMemberDto)) {
        if (key === 'photo' || key === 'memberDetails') continue;
        
        // Convertir les champs tableau si nécessaire
        const processedValue = ARRAY_FIELDS.includes(key)
          ? parseArrayField(value)
          : value;
        
        if (PERSON_FIELDS.includes(key)) {
          (personData as any)[key] = processedValue;
        } else {
          (memberDetailsData as any)[key] = processedValue;
        }
      }

      // Créer la personne
      const person = queryRunner.manager.create(Person, personData);
      const savedPerson = await queryRunner.manager.save(person);

      // Créer les détails du membre
      const memberDetails = queryRunner.manager.create(MemberDetails, {
        ...memberDetailsData,
        personId: savedPerson.id,
      });
      await queryRunner.manager.save(memberDetails);

      // Sauvegarder la photo si présente
      if (createMemberDto.photo) {
        await this.fileService.saveBase64Image(
          createMemberDto.photo,
          savedPerson.id,
          'photo_identite',
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
      where: { type: 'member' },
      relations: ['memberDetails', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Person | null> {
    return this.personRepository.findOne({
      where: { id, type: 'member' },
      relations: ['memberDetails', 'images'],
    });
  }

  async findBySlug(slug: string): Promise<Person | null> {
    return this.personRepository.findOne({
      where: { slug, type: 'member' },
      relations: ['memberDetails', 'images'],
    });
  }

  async update(
    id: string,
    updateMemberDto: Partial<CreateMemberDto>,
  ): Promise<Person | null> {
    const person = await this.findOne(id);
    if (!person) {
      return null;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Séparer les champs Person et MemberDetails
      const personData: Partial<Person> = {};
      const memberDetailsData: Partial<MemberDetails> = {};

      for (const [key, value] of Object.entries(updateMemberDto)) {
        if (key === 'photo' || key === 'memberDetails') continue;
        
        // Convertir les champs tableau si nécessaire
        const processedValue = ARRAY_FIELDS.includes(key)
          ? parseArrayField(value)
          : value;
        
        if (PERSON_FIELDS.includes(key)) {
          (personData as any)[key] = processedValue;
        } else {
          (memberDetailsData as any)[key] = processedValue;
        }
      }

      // Mettre à jour la personne
      if (Object.keys(personData).length > 0) {
        await queryRunner.manager.update(Person, id, personData);
      }

      // Mettre à jour les détails du membre
      if (Object.keys(memberDetailsData).length > 0 && person.memberDetails) {
        await queryRunner.manager.update(
          MemberDetails,
          person.memberDetails.id,
          memberDetailsData,
        );
      }

      // Mettre à jour la photo si fournie
      if (updateMemberDto.photo) {
        // Supprimer l'ancienne photo
        await this.fileService.deleteImagesByPersonId(id);
        // Sauvegarder la nouvelle
        await this.fileService.saveBase64Image(
          updateMemberDto.photo,
          id,
          'photo_identite',
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

    // Supprimer la personne (cascade supprime memberDetails)
    await this.personRepository.remove(person);
    return true;
  }

  async count(): Promise<number> {
    return this.personRepository.count({ where: { type: 'member' } });
  }

  async getStats(): Promise<{
    total: number;
    byGender: { homme: number; femme: number };
    byMaritalStatus: Record<string, number>;
  }> {
    const members = await this.findAll();

    const byGender = {
      homme: members.filter((m) => m.sexe === 'homme').length,
      femme: members.filter((m) => m.sexe === 'femme').length,
    };

    const byMaritalStatus: Record<string, number> = {};
    members.forEach((m) => {
      const status = m.memberDetails?.situationMatrimoniale || 'non_specifie';
      byMaritalStatus[status] = (byMaritalStatus[status] || 0) + 1;
    });

    return {
      total: members.length,
      byGender,
      byMaritalStatus,
    };
  }
}
