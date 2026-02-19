import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './api';
import { ImageData } from './memberService';

// Types pour les détails de l'enfant
export interface ChildDetailsData {
  id: string;
  personId: string;
  dateNaissance?: string;
  nomPere?: string;
  nomMere?: string;
  residenceParents?: string;
  contactParents?: string;
  nomTuteur?: string;
  residenceTuteur?: string;
  contactTuteur?: string;
  depuisQuandEglise?: string;
  parentsEglise?: string;
  accompagnateurEglise?: string;
}

// Type pour un enfant complet (Person + ChildDetails)
export interface Child {
  id: string;
  type: 'child';
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
  childDetails?: ChildDetailsData;
  images?: ImageData[];
}

// Type pour créer un enfant (données du formulaire)
export interface CreateChildPayload {
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
  
  // Champs ChildDetails
  dateNaissance?: string;
  nomPere?: string;
  nomMere?: string;
  residenceParents?: string;
  contactParents?: string;
  nomTuteur?: string;
  residenceTuteur?: string;
  contactTuteur?: string;
  depuisQuandEglise?: string;
  parentsEglise?: string;
  accompagnateurEglise?: string;
}

// Type pour les statistiques
export interface ChildStats {
  total: number;
  byGender: {
    masculin: number;
    feminin: number;
  };
  byEducationLevel: Record<string, number>;
}

// Endpoints du service Child
const ENDPOINTS = {
  BASE: '/api/children',
  BY_ID: (id: string) => `/api/children/${id}`,
  BY_SLUG: (slug: string) => `/api/children/slug/${slug}`,
  STATS: '/api/children/stats',
  VERIFY: '/api/children/verify',
} as const;

// Service pour les enfants
export const childService = {
  /**
   * Créer un nouvel enfant
   * @param data Données du formulaire
   */
  async create(data: CreateChildPayload): Promise<ApiResponse<Child>> {
    return apiPost<Child, CreateChildPayload>(ENDPOINTS.BASE, data);
  },

  /**
   * Récupérer tous les enfants
   */
  async getAll(): Promise<ApiResponse<Child[]>> {
    return apiGet<Child[]>(ENDPOINTS.BASE);
  },

  /**
   * Récupérer un enfant par son ID
   * @param id ID de l'enfant
   */
  async getById(id: string): Promise<ApiResponse<Child>> {
    return apiGet<Child>(ENDPOINTS.BY_ID(id));
  },

  /**
   * Récupérer un enfant par son slug
   * @param slug Slug de l'enfant
   */
  async getBySlug(slug: string): Promise<ApiResponse<Child>> {
    return apiGet<Child>(ENDPOINTS.BY_SLUG(slug));
  },

  /**
   * Mettre à jour un enfant
   * @param id ID de l'enfant
   * @param data Données à mettre à jour
   */
  async update(id: string, data: Partial<CreateChildPayload>): Promise<ApiResponse<Child>> {
    return apiPut<Child, Partial<CreateChildPayload>>(ENDPOINTS.BY_ID(id), data);
  },

  /**
   * Supprimer un enfant
   * @param id ID de l'enfant
   */
  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiDelete<{ deleted: boolean }>(ENDPOINTS.BY_ID(id));
  },

  /**
   * Récupérer les statistiques des enfants
   */
  async getStats(): Promise<ApiResponse<ChildStats>> {
    return apiGet<ChildStats>(ENDPOINTS.STATS);
  },

  /**
   * Vérifier l'identité d'un enfant par référence et contact parental
   */
  async verify(reference: string, contactParents: string): Promise<ApiResponse<Child>> {
    return apiPost<Child, { reference: string; contactParents: string }>(ENDPOINTS.VERIFY, { reference, contactParents });
  },
};

export default childService;
