import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types pour le formulaire membre
export interface MemberFormData {
  // Étape 1 - Identification
  nomPrenoms: string;
  sexe: string;
  anneeNaissance: string;
  nationalite: string;
  ethnie: string;
  lieuResidence: string;
  telephone: string;
  email: string;
  photo: string;
  
  // Étape 2 - Situation familiale
  situationMatrimoniale: string;
  typeFoyer: string;
  nomConjoint: string;
  conjointChretien: string;
  conjointTransfiguration: string;
  assembleesConjoint: string;
  nombreEnfants: string;
  autresPersonnesCharge: string;
  nombrePersonnesCharge: string;
  detailsPersonnesCharge: string;
  
  // Étape 3 - Parcours spirituel
  religionOrigine: string;
  egliseOrigine: string;
  autreReligion: string;
  responsabilitesAnterieures: string;
  detailsResponsabilites: string;
  dateConversion: string;
  baptemeEau: string;
  anneeBaptemeEau: string;
  lieuBaptemeEau: string;
  baptiseSaintEsprit: string;
  anneeBaptemeSaintEsprit: string;
  lieuBaptemeSaintEsprit: string;
  autreEgliseEvangelique: string;
  nomAutreEglise: string;
  responsabilitesAutreEglise: string;
  detailsResponsabilitesAutreEglise: string;
  motifsDepart: string;
  
  // Étape 4 - Vie d'église
  anneeTransfiguration: string;
  raisonsChoixTransfiguration: string;
  satisfactionTransfiguration: string;
  raisonsSatisfaction: string;
  membreGroupe: string;
  groupesActuels: string[];
  autreGroupeActuel: string;
  responsabilitesGroupe: string;
  detailsResponsabilitesGroupe: string;
  raisonNonMembre: string;
  groupesSouhaites: string[];
  autreGroupeSouhaite: string;
  frequenceCultesDimanche: string;
  raisonsAbsenceDimanche: string;
  participationCultesSoir: string;
  raisonsAbsenceSoir: string;
  participationActionsSociales: string;
  detailsActionsSociales: string;
  raisonsNonParticipation: string;
  
  // Étape 5 - Vie professionnelle
  niveauEtudes: string;
  domaineFormation: string;
  profession: string;
  secteurActivite: string;
  situationProfessionnelle: string;
  lieuTravail: string;
  precisionLieuTravail: string;
  disponibiliteActivites: string[];
  autreDisponibilite: string;
  heureDepartTravail: string;
  heureRetourTravail: string;
  activitesExtraPro: string;
  detailsActivitesExtraPro: string;
  competences: string[];
  autresCompetences: string;
  revenuMensuel: string;
  
  // Étape 6 - Besoins et suggestions
  besoinAccompagnement: string;
  domainesAppui: string[];
  autreDomaineAppui: string;
  typeFormation: string[];
  espritFamille: string;
  commentEspritFamille: string;
  suggestionsFamille: string;
  
  // Étape 7 - Santé
  dernierBilan: string;
  etatSanteGeneral: string;
  maladiesChroniques: string;
  corpsPastoralInforme: string;
  souhaiteInformerCorpsPastoral: string;
  soutienPsychosocial: string;
  descriptionSoutienPsychosocial: string;
  soutienMaterielFinancier: string;
  suggestionsAssistanceSociale: string;
}

// État initial du formulaire
const initialFormData: MemberFormData = {
  // Étape 1
  nomPrenoms: '',
  sexe: '',
  anneeNaissance: '',
  nationalite: '',
  ethnie: '',
  lieuResidence: '',
  telephone: '',
  email: '',
  photo: '',
  
  // Étape 2
  situationMatrimoniale: '',
  typeFoyer: '',
  nomConjoint: '',
  conjointChretien: '',
  conjointTransfiguration: '',
  assembleesConjoint: '',
  nombreEnfants: '',
  autresPersonnesCharge: '',
  nombrePersonnesCharge: '',
  detailsPersonnesCharge: '',
  
  // Étape 3
  religionOrigine: '',
  egliseOrigine: '',
  autreReligion: '',
  responsabilitesAnterieures: '',
  detailsResponsabilites: '',
  dateConversion: '',
  baptemeEau: '',
  anneeBaptemeEau: '',
  lieuBaptemeEau: '',
  baptiseSaintEsprit: '',
  anneeBaptemeSaintEsprit: '',
  lieuBaptemeSaintEsprit: '',
  autreEgliseEvangelique: '',
  nomAutreEglise: '',
  responsabilitesAutreEglise: '',
  detailsResponsabilitesAutreEglise: '',
  motifsDepart: '',
  
  // Étape 4
  anneeTransfiguration: '',
  raisonsChoixTransfiguration: '',
  satisfactionTransfiguration: '',
  raisonsSatisfaction: '',
  membreGroupe: '',
  groupesActuels: [],
  autreGroupeActuel: '',
  responsabilitesGroupe: '',
  detailsResponsabilitesGroupe: '',
  raisonNonMembre: '',
  groupesSouhaites: [],
  autreGroupeSouhaite: '',
  frequenceCultesDimanche: '',
  raisonsAbsenceDimanche: '',
  participationCultesSoir: '',
  raisonsAbsenceSoir: '',
  participationActionsSociales: '',
  detailsActionsSociales: '',
  raisonsNonParticipation: '',
  
  // Étape 5
  niveauEtudes: '',
  domaineFormation: '',
  profession: '',
  secteurActivite: '',
  situationProfessionnelle: '',
  lieuTravail: '',
  precisionLieuTravail: '',
  disponibiliteActivites: [],
  autreDisponibilite: '',
  heureDepartTravail: '',
  heureRetourTravail: '',
  activitesExtraPro: '',
  detailsActivitesExtraPro: '',
  competences: [],
  autresCompetences: '',
  revenuMensuel: '',
  
  // Étape 6
  besoinAccompagnement: '',
  domainesAppui: [],
  autreDomaineAppui: '',
  typeFormation: [],
  espritFamille: '',
  commentEspritFamille: '',
  suggestionsFamille: '',
  
  // Étape 7
  dernierBilan: '',
  etatSanteGeneral: '',
  maladiesChroniques: '',
  corpsPastoralInforme: '',
  souhaiteInformerCorpsPastoral: '',
  soutienPsychosocial: '',
  descriptionSoutienPsychosocial: '',
  soutienMaterielFinancier: '',
  suggestionsAssistanceSociale: '',
};

// Interface du store
interface MemberFormStore {
  // État
  formData: MemberFormData;
  currentStep: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  createdMemberId: string | null;
  createdMemberReference: string | null;
  submittedData: MemberFormData | null;
  submittedPhoto: string | null;
  
  // Actions
  setFormData: (data: Partial<MemberFormData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsSubmitted: (isSubmitted: boolean) => void;
  setError: (error: string | null) => void;
  setCreatedMemberId: (id: string | null) => void;
  setCreatedMemberReference: (reference: string | null) => void;
  markAsSubmitted: (id: string, reference: string | null, photoUrl: string | null) => void;
  resetForm: () => void;
  clearSubmission: () => void;
  getFormDataForSubmission: () => Record<string, string | undefined>;
}

// Création du store
export const useMemberFormStore = create<MemberFormStore>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        formData: initialFormData,
        currentStep: 0,
        isSubmitting: false,
        isSubmitted: false,
        error: null,
        createdMemberId: null,
        createdMemberReference: null,
        submittedData: null,
        submittedPhoto: null,
        
        // Actions
        setFormData: (data) =>
          set(
            (state) => ({
              formData: { ...state.formData, ...data },
            }),
            false,
            'setFormData'
          ),
        
        setCurrentStep: (step) =>
          set({ currentStep: step }, false, 'setCurrentStep'),
        
        nextStep: () =>
          set(
            (state) => ({ currentStep: Math.min(state.currentStep + 1, 6) }),
            false,
            'nextStep'
          ),
        
        prevStep: () =>
          set(
            (state) => ({ currentStep: Math.max(state.currentStep - 1, 0) }),
            false,
            'prevStep'
          ),
        
        setIsSubmitting: (isSubmitting) =>
          set({ isSubmitting }, false, 'setIsSubmitting'),
        
        setIsSubmitted: (isSubmitted) =>
          set({ isSubmitted }, false, 'setIsSubmitted'),
        
        setError: (error) =>
          set({ error }, false, 'setError'),
        
        setCreatedMemberId: (id) =>
          set({ createdMemberId: id }, false, 'setCreatedMemberId'),
        
        setCreatedMemberReference: (reference) =>
          set({ createdMemberReference: reference }, false, 'setCreatedMemberReference'),
        
        markAsSubmitted: (id, reference, photoUrl) =>
          set(
            (state) => ({
              submittedData: { ...state.formData },
              submittedPhoto: photoUrl,
              createdMemberId: id,
              createdMemberReference: reference,
              isSubmitting: false,
              isSubmitted: true,
              // Reset le formulaire immédiatement
              formData: initialFormData,
              currentStep: 0,
            }),
            false,
            'markAsSubmitted'
          ),
        
        resetForm: () =>
          set(
            {
              formData: initialFormData,
              currentStep: 0,
              isSubmitting: false,
              isSubmitted: false,
              error: null,
              createdMemberId: null,
              createdMemberReference: null,
              submittedData: null,
              submittedPhoto: null,
            },
            false,
            'resetForm'
          ),
        
        clearSubmission: () =>
          set(
            {
              isSubmitted: false,
              submittedData: null,
              submittedPhoto: null,
              createdMemberId: null,
              createdMemberReference: null,
            },
            false,
            'clearSubmission'
          ),
        
        // Convertir les données du formulaire pour l'envoi à l'API
        getFormDataForSubmission: () => {
          const { formData } = get();
          const result: Record<string, string | undefined> = {};
          
          Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              // Convertir les tableaux en chaînes JSON
              result[key] = value.length > 0 ? JSON.stringify(value) : undefined;
            } else if (typeof value === 'string' && value.trim() !== '') {
              result[key] = value;
            }
          });
          
          return result;
        },
      }),
      {
        name: 'member-form-storage',
        // Ne pas persister certains états
        partialize: (state) => ({
          formData: state.formData,
          currentStep: state.currentStep,
          isSubmitted: state.isSubmitted,
          submittedData: state.submittedData,
          submittedPhoto: state.submittedPhoto,
          createdMemberId: state.createdMemberId,
          createdMemberReference: state.createdMemberReference,
        }),
      }
    ),
    { name: 'MemberFormStore' }
  )
);

export default useMemberFormStore;
