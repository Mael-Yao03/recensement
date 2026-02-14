import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Image, ImageType } from '../entities/image.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private configService: ConfigService,
  ) {
    // Configurer Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Génère un slug unique
   */
  generateSlug(): string {
    return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  }

  /**
   * Upload une image sur Cloudinary depuis une chaîne base64
   */
  private async uploadToCloudinary(
    base64Data: string,
  ): Promise<UploadApiResponse> {
    const folder = this.configService.get<string>('CLOUDINARY_FOLDER') || 'transfiguration';
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        },
      );
    });
  }

  /**
   * Supprime une image de Cloudinary par son public_id
   */
  private async deleteFromCloudinary(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Erreur lors de la suppression Cloudinary:', error);
    }
  }

  /**
   * Sauvegarde une image sur Cloudinary et crée l'entrée en BD
   * @param base64Data Données de l'image en base64 (data:image/...;base64,...)
   * @param personId ID de la personne associée
   * @param imageType Type d'image
   * @returns L'entité Image créée ou null
   */
  async saveBase64Image(
    base64Data: string,
    personId: string,
    imageType: ImageType = 'photo_identite',
    queryRunner?: QueryRunner,
  ): Promise<Image | null> {
    if (!base64Data || !base64Data.startsWith('data:image')) {
      return null;
    }

    try {
      const isProd = this.configService.get<string>('NODE_ENV') === 'production';

      // En dev, on ne fait pas d'upload Cloudinary, on utilise un avatar
      if (!isProd) {
        const avatarUrl = `https://api.dicebear.com/9.x/toon-head/svg?seed=${personId}`;
        const imageData = {
          imageType,
          fileName: this.generateSlug(),
          filePath: avatarUrl,
          publicId: null as any,
          mimeType: 'image/svg+xml',
          fileSize: 0,
          personId,
        };

        if (queryRunner) {
          const image = queryRunner.manager.create(Image, imageData);
          return queryRunner.manager.save(image);
        }

        const image = this.imageRepository.create(imageData);
        return this.imageRepository.save(image);
      }

      // En production, upload sur Cloudinary
      const result = await this.uploadToCloudinary(base64Data);

      // Créer l'entrée en base de données
      const imageData = {
        imageType,
        fileName: result.original_filename || this.generateSlug(),
        filePath: result.secure_url,
        publicId: result.public_id,
        mimeType: `image/${result.format}`,
        fileSize: result.bytes,
        personId,
      };

      // Utiliser le queryRunner si fourni (même transaction)
      if (queryRunner) {
        const image = queryRunner.manager.create(Image, imageData);
        return queryRunner.manager.save(image);
      }

      const image = this.imageRepository.create(imageData);
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
   * Supprime une image par son ID (Cloudinary + BD)
   */
  async deleteImage(imageId: string): Promise<boolean> {
    const image = await this.imageRepository.findOne({ where: { id: imageId } });
    if (!image) {
      return false;
    }

    try {
      // Supprimer de Cloudinary si publicId existe
      if (image.publicId) {
        await this.deleteFromCloudinary(image.publicId);
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
}
