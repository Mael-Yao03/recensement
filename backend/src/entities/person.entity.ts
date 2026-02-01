// Entité Person - Table principale avec les champs communs
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { MemberDetails } from './member.entity';
import { ChildDetails } from './child.entity';
import { Image } from './image.entity';

export type PersonType = 'member' | 'child';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Type de personne (membre adulte ou enfant)
  @Column({ type: 'varchar', length: 20 })
  type: PersonType;

  // Slug unique pour identifier la personne
  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  // Champs communs aux deux formulaires
  @Column({ type: 'varchar', length: 255 })
  nomPrenoms: string;

  @Column({ type: 'varchar', length: 20 })
  sexe: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationalite: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ethnie: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lieuResidence: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  baptiseSaintEsprit: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  niveauEtudes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => MemberDetails, (memberDetails) => memberDetails.person, {
    cascade: true,
    nullable: true,
  })
  memberDetails: MemberDetails;

  @OneToOne(() => ChildDetails, (childDetails) => childDetails.person, {
    cascade: true,
    nullable: true,
  })
  childDetails: ChildDetails;

  // Relation polymorphique avec les images
  @OneToMany(() => Image, (image) => image.person, {
    cascade: true,
  })
  images: Image[];
}
