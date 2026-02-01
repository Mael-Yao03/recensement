// Entité ChildDetails - Champs spécifiques aux enfants
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Person } from './person.entity';

@Entity('child_details')
export class ChildDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Clé étrangère vers Person
  @Column({ type: 'uuid' })
  personId: string;

  @OneToOne(() => Person, (person) => person.childDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'personId' })
  person: Person;

  // === Informations générales spécifiques aux enfants ===
  @Column({ type: 'varchar', length: 50, nullable: true })
  dateNaissance: string;

  // === Affiliation - Père ===
  @Column({ type: 'varchar', length: 255, nullable: true })
  nomPere: string;

  // === Affiliation - Mère ===
  @Column({ type: 'varchar', length: 255, nullable: true })
  nomMere: string;

  // === Affiliation - Parents ===
  @Column({ type: 'varchar', length: 255, nullable: true })
  residenceParents: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactParents: string;

  // === Affiliation - Tuteur ===
  @Column({ type: 'varchar', length: 255, nullable: true })
  nomTuteur: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  residenceTuteur: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactTuteur: string;

  // === Vie spirituelle spécifique aux enfants ===
  @Column({ type: 'varchar', length: 100, nullable: true })
  depuisQuandEglise: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  parentsEglise: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accompagnateurEglise: string;
}
