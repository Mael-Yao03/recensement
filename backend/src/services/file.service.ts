import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Image, ImageType } from '../entities/image.entity';

@Injectable()
export class FileService {
  private readonly picturesDir = path.join(__dirname, '..', '..', 'pictures');

  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {
    // Créer le dossier pictures s'il n'existe pas
    if (!fs.existsSync(this.picturesDir)) {
      fs.mkdirSync(this.picturesDir, { recursive: true });
    }
  }

  /**
   * Génère un slug unique
   */
  generateSlug(): string {
    return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  }

  /**
   * Sauvegarde une image depuis une chaîne base64 et crée l'entrée en BD
   * @param base64Data Données de l'image en base64
   * @param personId ID de la personne associée
   * @param imageType Type d'image
   * @returns L'entité Image créée ou null
   */
  async saveBase64Image(
    base64Data: string,
    personId: string,
    imageType: ImageType = 'photo_identite',
  ): Promise<Image | null> {
    if (!base64Data || !base64Data.startsWith('data:image')) {
      return null;
    }

    try {
      // Extraire le type MIME et les données
      const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        return null;
      }

      const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const imageData = matches[2];
      const slug = this.generateSlug();
      const fileName = `${slug}.${extension}`;
      const filePath = path.join(this.picturesDir, fileName);

      // Convertir base64 en buffer et sauvegarder
      const buffer = Buffer.from(imageData, 'base64');
      fs.writeFileSync(filePath, buffer);

      // Créer l'entrée en base de données
      const image = this.imageRepository.create({
        imageType,
        fileName,
        filePath: `pictures/${fileName}`,
        mimeType: `image/${extension}`,
        fileSize: buffer.length,
        personId,
      });

      return this.imageRepository.save(image);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'image:", error);
      return null;
    }
  }

  /**
   * Récupère toutes les images d'une personne
   */
  async getImagesByPersonId(personId: string): Promise<Image[]> {
    return this.imageRepository.find({
      where: { personId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupère la photo d'identité d'une personne
   */
  async getPhotoIdentite(personId: string): Promise<Image | null> {
    return this.imageRepository.findOne({
      where: { personId, imageType: 'photo_identite' },
    });
  }

  /**
   * Supprime une image par son ID
   */
  async deleteImage(imageId: string): Promise<boolean> {
    const image = await this.imageRepository.findOne({ where: { id: imageId } });
    if (!image) {
      return false;
    }

    try {
      const absolutePath = path.join(__dirname, '..', '..', image.filePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
      await this.imageRepository.remove(image);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      return false;
    }
  }

  /**
   * Supprime toutes les images d'une personne
   */
  async deleteImagesByPersonId(personId: string): Promise<void> {
    const images = await this.getImagesByPersonId(personId);
    for (const image of images) {
      await this.deleteImage(image.id);
    }
  }

  /**
   * Obtient le chemin absolu d'une image
   */
  getAbsolutePath(relativePath: string): string {
    return path.join(__dirname, '..', '..', relativePath);
  }
}
