import { IsString, IsOptional, IsEmail } from 'class-validator';

// DTO principal pour créer un membre - tous les champs à plat pour compatibilité frontend
// Les champs tableau sont acceptés en tant que chaînes JSON
export class CreateMemberDto {
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

  // Informations générales
  @IsOptional()
  @IsString()
  anneeNaissance?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Situation familiale
  @IsOptional()
  @IsString()
  situationMatrimoniale?: string;

  @IsOptional()
  @IsString()
  typeFoyer?: string;

  @IsOptional()
  @IsString()
  nomConjoint?: string;

  @IsOptional()
  @IsString()
  conjointChretien?: string;

  @IsOptional()
  @IsString()
  conjointTransfiguration?: string;

  @IsOptional()
  @IsString()
  assembleesConjoint?: string;

  @IsOptional()
  @IsString()
  nombreEnfants?: string;

  @IsOptional()
  @IsString()
  autresPersonnesCharge?: string;

  @IsOptional()
  @IsString()
  nombrePersonnesCharge?: string;

  @IsOptional()
  @IsString()
  detailsPersonnesCharge?: string;

  // Parcours spirituel
  @IsOptional()
  @IsString()
  religionOrigine?: string;

  @IsOptional()
  @IsString()
  egliseOrigine?: string;

  @IsOptional()
  @IsString()
  autreReligion?: string;

  @IsOptional()
  @IsString()
  responsabilitesAnterieures?: string;

  @IsOptional()
  @IsString()
  detailsResponsabilites?: string;

  @IsOptional()
  @IsString()
  dateConversion?: string;

  @IsOptional()
  @IsString()
  baptemeEau?: string;

  @IsOptional()
  @IsString()
  anneeBaptemeEau?: string;

  @IsOptional()
  @IsString()
  lieuBaptemeEau?: string;

  @IsOptional()
  @IsString()
  anneeBaptemeSaintEsprit?: string;

  @IsOptional()
  @IsString()
  lieuBaptemeSaintEsprit?: string;

  @IsOptional()
  @IsString()
  autreEgliseEvangelique?: string;

  @IsOptional()
  @IsString()
  nomAutreEglise?: string;

  @IsOptional()
  @IsString()
  responsabilitesAutreEglise?: string;

  @IsOptional()
  @IsString()
  detailsResponsabilitesAutreEglise?: string;

  @IsOptional()
  @IsString()
  motifsDepart?: string;

  @IsOptional()
  @IsString()
  anneeTransfiguration?: string;

  @IsOptional()
  @IsString()
  raisonsChoixTransfiguration?: string;

  @IsOptional()
  @IsString()
  satisfactionTransfiguration?: string;

  @IsOptional()
  @IsString()
  raisonsSatisfaction?: string;

  // Vie dans l'église
  @IsOptional()
  @IsString()
  membreGroupe?: string;

  @IsOptional()
  groupesActuels?: string | string[]; // Accepte chaîne JSON ou tableau

  @IsOptional()
  @IsString()
  autreGroupeActuel?: string;

  @IsOptional()
  @IsString()
  responsabilitesGroupe?: string;

  @IsOptional()
  @IsString()
  detailsResponsabilitesGroupe?: string;

  @IsOptional()
  @IsString()
  raisonNonMembre?: string;

  @IsOptional()
  groupesSouhaites?: string | string[]; // Accepte chaîne JSON ou tableau

  @IsOptional()
  @IsString()
  autreGroupeSouhaite?: string;

  @IsOptional()
  @IsString()
  frequenceCultesDimanche?: string;

  @IsOptional()
  @IsString()
  raisonsAbsenceDimanche?: string;

  @IsOptional()
  @IsString()
  participationCultesSoir?: string;

  @IsOptional()
  @IsString()
  raisonsAbsenceSoir?: string;

  @IsOptional()
  @IsString()
  participationActionsSociales?: string;

  @IsOptional()
  @IsString()
  detailsActionsSociales?: string;

  @IsOptional()
  @IsString()
  raisonsNonParticipation?: string;

  // Vie professionnelle
  @IsOptional()
  @IsString()
  domaineFormation?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  secteurActivite?: string;

  @IsOptional()
  @IsString()
  situationProfessionnelle?: string;

  @IsOptional()
  @IsString()
  lieuTravail?: string;

  @IsOptional()
  @IsString()
  precisionLieuTravail?: string;

  @IsOptional()
  disponibiliteActivites?: string | string[]; // Accepte chaîne JSON ou tableau

  @IsOptional()
  @IsString()
  autreDisponibilite?: string;

  @IsOptional()
  @IsString()
  heureDepartTravail?: string;

  @IsOptional()
  @IsString()
  heureRetourTravail?: string;

  @IsOptional()
  @IsString()
  activitesExtraPro?: string;

  @IsOptional()
  @IsString()
  detailsActivitesExtraPro?: string;

  @IsOptional()
  competences?: string | string[]; // Accepte chaîne JSON ou tableau

  @IsOptional()
  @IsString()
  autresCompetences?: string;

  @IsOptional()
  @IsString()
  revenuMensuel?: string;

  // Besoins spirituels
  @IsOptional()
  @IsString()
  besoinAccompagnement?: string;

  @IsOptional()
  domainesAppui?: string | string[]; // Accepte chaîne JSON ou tableau

  @IsOptional()
  @IsString()
  autreDomaineAppui?: string;

  @IsOptional()
  typeFormation?: string | string[]; // Accepte chaîne JSON ou tableau

  @IsOptional()
  @IsString()
  espritFamille?: string;

  @IsOptional()
  @IsString()
  commentEspritFamille?: string;

  @IsOptional()
  @IsString()
  suggestionsFamille?: string;

  // Santé
  @IsOptional()
  @IsString()
  dernierBilan?: string;

  @IsOptional()
  @IsString()
  etatSanteGeneral?: string;

  @IsOptional()
  @IsString()
  maladiesChroniques?: string;

  @IsOptional()
  @IsString()
  corpsPastoralInforme?: string;

  @IsOptional()
  @IsString()
  souhaiteInformerCorpsPastoral?: string;

  @IsOptional()
  @IsString()
  soutienPsychosocial?: string;

  @IsOptional()
  @IsString()
  descriptionSoutienPsychosocial?: string;

  @IsOptional()
  @IsString()
  soutienMaterielFinancier?: string;

  @IsOptional()
  @IsString()
  suggestionsAssistanceSociale?: string;
}
