import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO pour les détails spécifiques aux enfants
export class ChildDetailsDto {
  // Informations générales
  @IsOptional()
  @IsString()
  dateNaissance?: string;

  // Affiliation - Père
  @IsOptional()
  @IsString()
  nomPere?: string;

  // Affiliation - Mère
  @IsOptional()
  @IsString()
  nomMere?: string;

  // Affiliation - Parents
  @IsOptional()
  @IsString()
  residenceParents?: string;

  @IsOptional()
  @IsString()
  contactParents?: string;

  // Affiliation - Tuteur
  @IsOptional()
  @IsString()
  nomTuteur?: string;

  @IsOptional()
  @IsString()
  residenceTuteur?: string;

  @IsOptional()
  @IsString()
  contactTuteur?: string;

  // Vie spirituelle
  @IsOptional()
  @IsString()
  depuisQuandEglise?: string;

  @IsOptional()
  @IsString()
  parentsEglise?: string;

  @IsOptional()
  @IsString()
  accompagnateurEglise?: string;
}

// DTO principal pour créer un enfant
export class CreateChildDto {
  // Champs communs (Person)
  @IsString()
  nomPrenoms: string;

  @IsString()
  sexe: string;

  @IsOptional()
  @IsString()
  nationalite?: string;

  @IsOptional()
  @IsString()
  ethnie?: string;

  @IsOptional()
  @IsString()
  lieuResidence?: string;

  @IsOptional()
  @IsString()
  baptiseSaintEsprit?: string;

  @IsOptional()
  @IsString()
  niveauEtudes?: string;

  @IsOptional()
  @IsString()
  photo?: string; // Base64

  // Détails spécifiques aux enfants (imbriqués ou à plat)
  @IsOptional()
  @ValidateNested()
  @Type(() => ChildDetailsDto)
  childDetails?: ChildDetailsDto;

  // Alternative: champs à plat (pour compatibilité avec le frontend)
  @IsOptional()
  @IsString()
  dateNaissance?: string;

  @IsOptional()
  @IsString()
  nomPere?: string;

  @IsOptional()
  @IsString()
  nomMere?: string;

  @IsOptional()
  @IsString()
  residenceParents?: string;

  @IsOptional()
  @IsString()
  contactParents?: string;

  @IsOptional()
  @IsString()
  nomTuteur?: string;

  @IsOptional()
  @IsString()
  residenceTuteur?: string;

  @IsOptional()
  @IsString()
  contactTuteur?: string;

  @IsOptional()
  @IsString()
  depuisQuandEglise?: string;

  @IsOptional()
  @IsString()
  parentsEglise?: string;

  @IsOptional()
  @IsString()
  accompagnateurEglise?: string;
}
