// Entité Image - Table polymorphique pour les images
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Person } from './person.entity';

export type ImageType = 'photo_identite' | 'document' | 'autre';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Type d'image
  @Column({ type: 'varchar', length: 50, default: 'photo_identite' })
  imageType: ImageType;

  // Nom du fichier
  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  // URL de l'image (Cloudinary)
  @Column({ type: 'varchar', length: 500 })
  filePath: string;

  // ID public Cloudinary (pour suppression)
  @Column({ type: 'varchar', length: 255, nullable: true })
  publicId: string;

  // Type MIME
  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string;

  // Taille du fichier en octets
  @Column({ type: 'integer', nullable: true })
  fileSize: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relation avec Person (polymorphique via le type de Person)
  @Column({ type: 'uuid' })
  personId: string;

  @ManyToOne(() => Person, (person) => person.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'personId' })
  person: Person;
}
