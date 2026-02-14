import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './api';

// Types pour les images
export interface ImageData {
  id: string;
  imageType: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

// Types pour les détails du membre
export interface MemberDetailsData {
  id: string;
  personId: string;
  anneeNaissance?: string;
  telephone?: string;
  email?: string;
  situationMatrimoniale?: string;
  typeFoyer?: string;
  nomConjoint?: string;
  conjointChretien?: string;
  conjointTransfiguration?: string;
  assembleesConjoint?: string;
  nombreEnfants?: string;
  autresPersonnesCharge?: string;
  nombrePersonnesCharge?: string;
  detailsPersonnesCharge?: string;
  religionOrigine?: string;
  egliseOrigine?: string;
  autreReligion?: string;
  responsabilitesAnterieures?: string;
  detailsResponsabilites?: string;
  dateConversion?: string;
  baptemeEau?: string;
  anneeBaptemeEau?: string;
  lieuBaptemeEau?: string;
  anneeBaptemeSaintEsprit?: string;
  lieuBaptemeSaintEsprit?: string;
  autreEgliseEvangelique?: string;
  nomAutreEglise?: string;
  responsabilitesAutreEglise?: string;
  detailsResponsabilitesAutreEglise?: string;
  motifsDepart?: string;
  anneeTransfiguration?: string;
  raisonsChoixTransfiguration?: string;
  satisfactionTransfiguration?: string;
  raisonsSatisfaction?: string;
  membreGroupe?: string;
  groupesActuels?: string;
  autreGroupeActuel?: string;
  responsabilitesGroupe?: string;
  detailsResponsabilitesGroupe?: string;
  raisonNonMembre?: string;
  groupesSouhaites?: string;
  autreGroupeSouhaite?: string;
  frequenceCultesDimanche?: string;
  raisonsAbsenceDimanche?: string;
  participationCultesSoir?: string;
  raisonsAbsenceSoir?: string;
  participationActionsSociales?: string;
  detailsActionsSociales?: string;
  raisonsNonParticipation?: string;
  domaineFormation?: string;
  profession?: string;
  secteurActivite?: string;
  situationProfessionnelle?: string;
  lieuTravail?: string;
  precisionLieuTravail?: string;
  disponibiliteActivites?: string;
  autreDisponibilite?: string;
  heureDepartTravail?: string;
  heureRetourTravail?: string;
  activitesExtraPro?: string;
  detailsActivitesExtraPro?: string;
  competences?: string;
  autresCompetences?: string;
  revenuMensuel?: string;
  besoinAccompagnement?: string;
  domainesAppui?: string;
  autreDomaineAppui?: string;
  typeFormation?: string;
  espritFamille?: string;
  commentEspritFamille?: string;
  suggestionsFamille?: string;
  dernierBilan?: string;
  etatSanteGeneral?: string;
  maladiesChroniques?: string;
  corpsPastoralInforme?: string;
  souhaiteInformerCorpsPastoral?: string;
  soutienPsychosocial?: string;
  descriptionSoutienPsychosocial?: string;
  soutienMaterielFinancier?: string;
  suggestionsAssistanceSociale?: string;
}

// Type pour un membre complet (Person + MemberDetails)
export interface Member {
  id: string;
  type: 'member';
  slug: string;
  reference?: string;
  nomPrenoms: string;
  sexe: string;
  nationalite?: string;
  ethnie?: string;
  lieuResidence?: string;
  baptiseSaintEsprit?: string;
  niveauEtudes?: string;
  createdAt: string;
  updatedAt: string;
  memberDetails?: MemberDetailsData;
  images?: ImageData[];
}

// Type pour créer un membre (données du formulaire)
export interface CreateMemberPayload {
  // Champs Person
  nomPrenoms: string;
  sexe: string;
  nationalite?: string;
  ethnie?: string;
  lieuResidence?: string;
  baptiseSaintEsprit?: string;
  niveauEtudes?: string;
  
  // Photo en base64
  photo?: string;
  
  // Tous les autres champs MemberDetails
  [key: string]: string | undefined;
}

// Type pour les statistiques
export interface MemberStats {
  total: number;
  byGender: {
    homme: number;
    femme: number;
  };
  byMaritalStatus: Record<string, number>;
}

// Endpoints du service Member
const ENDPOINTS = {
  BASE: '/api/members',
  BY_ID: (id: string) => `/api/members/${id}`,
  BY_SLUG: (slug: string) => `/api/members/slug/${slug}`,
  STATS: '/api/members/stats',
  VERIFY: '/api/members/verify',
} as const;

// Service pour les membres
export const memberService = {
  /**
   * Créer un nouveau membre
   * @param data Données du formulaire
   */
  async create(data: CreateMemberPayload): Promise<ApiResponse<Member>> {
    return apiPost<Member, CreateMemberPayload>(ENDPOINTS.BASE, data);
  },

  /**
   * Récupérer tous les membres
   */
  async getAll(): Promise<ApiResponse<Member[]>> {
    return apiGet<Member[]>(ENDPOINTS.BASE);
  },

  /**
   * Récupérer un membre par son ID
   * @param id ID du membre
   */
  async getById(id: string): Promise<ApiResponse<Member>> {
    return apiGet<Member>(ENDPOINTS.BY_ID(id));
  },

  /**
   * Récupérer un membre par son slug
   * @param slug Slug du membre
   */
  async getBySlug(slug: string): Promise<ApiResponse<Member>> {
    return apiGet<Member>(ENDPOINTS.BY_SLUG(slug));
  },

  /**
   * Mettre à jour un membre
   * @param id ID du membre
   * @param data Données à mettre à jour
   */
  async update(id: string, data: Partial<CreateMemberPayload>): Promise<ApiResponse<Member>> {
    return apiPut<Member, Partial<CreateMemberPayload>>(ENDPOINTS.BY_ID(id), data);
  },

  /**
   * Supprimer un membre
   * @param id ID du membre
   */
  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiDelete<{ deleted: boolean }>(ENDPOINTS.BY_ID(id));
  },

  /**
   * Récupérer les statistiques des membres
   */
  async getStats(): Promise<ApiResponse<MemberStats>> {
    return apiGet<MemberStats>(ENDPOINTS.STATS);
  },

  /**
   * Vérifier l'identité d'un membre par référence et téléphone
   * @param reference Référence du membre (sur sa carte)
   * @param telephone Numéro de téléphone
   */
  async verify(reference: string, telephone: string): Promise<ApiResponse<Member>> {
    return apiPost<Member, { reference: string; telephone: string }>(ENDPOINTS.VERIFY, { reference, telephone });
  },
};

export default memberService;
