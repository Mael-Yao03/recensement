import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types pour le formulaire enfant
export interface ChildFormData {
  // Étape 1 - Identification de l'enfant
  nomPrenoms: string;
  sexe: string;
  dateNaissance: string;
  nationalite: string;
  ethnie: string;
  lieuResidence: string;
  baptiseSaintEsprit: string;
  niveauEtudes: string;
  photo: string;
  
  // Étape 2 - Informations sur les parents
  nomPere: string;
  nomMere: string;
  residenceParents: string;
  contactParents: string;
  
  // Étape 3 - Tuteur et église
  nomTuteur: string;
  residenceTuteur: string;
  contactTuteur: string;
  depuisQuandEglise: string;
  parentsEglise: string;
  accompagnateurEglise: string;
}

// État initial du formulaire
const initialFormData: ChildFormData = {
  // Étape 1
  nomPrenoms: '',
  sexe: '',
  dateNaissance: '',
  nationalite: '',
  ethnie: '',
  lieuResidence: '',
  baptiseSaintEsprit: '',
  niveauEtudes: '',
  photo: '',
  
  // Étape 2
  nomPere: '',
  nomMere: '',
  residenceParents: '',
  contactParents: '',
  
  // Étape 3
  nomTuteur: '',
  residenceTuteur: '',
  contactTuteur: '',
  depuisQuandEglise: '',
  parentsEglise: '',
  accompagnateurEglise: '',
};

// Interface du store
interface ChildFormStore {
  // État
  formData: ChildFormData;
  currentStep: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  createdChildId: string | null;
  submittedData: ChildFormData | null;
  submittedPhoto: string | null;
  
  // Actions
  setFormData: (data: Partial<ChildFormData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsSubmitted: (isSubmitted: boolean) => void;
  setError: (error: string | null) => void;
  setCreatedChildId: (id: string | null) => void;
  markAsSubmitted: (id: string, photoUrl: string | null) => void;
  resetForm: () => void;
  clearSubmission: () => void;
  getFormDataForSubmission: () => Record<string, string | undefined>;
}

// Création du store
export const useChildFormStore = create<ChildFormStore>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        formData: initialFormData,
        currentStep: 0,
        isSubmitting: false,
        isSubmitted: false,
        error: null,
        createdChildId: null,
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
            (state) => ({ currentStep: Math.min(state.currentStep + 1, 2) }),
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
        
        setCreatedChildId: (id) =>
          set({ createdChildId: id }, false, 'setCreatedChildId'),
        
        markAsSubmitted: (id, photoUrl) =>
          set(
            (state) => ({
              submittedData: { ...state.formData },
              submittedPhoto: photoUrl,
              createdChildId: id,
              isSubmitting: false,
              isSubmitted: true,
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
              createdChildId: null,
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
              createdChildId: null,
            },
            false,
            'clearSubmission'
          ),
        
        // Convertir les données du formulaire pour l'envoi à l'API
        getFormDataForSubmission: () => {
          const { formData } = get();
          const result: Record<string, string | undefined> = {};
          
          Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === 'string' && value.trim() !== '') {
              result[key] = value;
            }
          });
          
          return result;
        },
      }),
      {
        name: 'child-form-storage',
        // Ne pas persister certains états
        partialize: (state) => ({
          formData: state.formData,
          currentStep: state.currentStep,
          isSubmitted: state.isSubmitted,
          submittedData: state.submittedData,
          submittedPhoto: state.submittedPhoto,
          createdChildId: state.createdChildId,
        }),
      }
    ),
    { name: 'ChildFormStore' }
  )
);

export default useChildFormStore;
