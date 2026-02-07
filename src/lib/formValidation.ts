// Validation rules for registration forms

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ==== MEMBER FORM VALIDATION ====

// Step 1: Informations générales - Required fields
export const memberStep1RequiredFields = [
  { field: 'nomPrenoms', label: 'Nom et prénoms' },
  { field: 'sexe', label: 'Sexe' },
  { field: 'anneeNaissance', label: 'Année de naissance' },
  { field: 'nationalite', label: 'Nationalité' },
  { field: 'lieuResidence', label: 'Lieu de résidence' },
  { field: 'telephone', label: 'Téléphone / WhatsApp' },
];

// Step 2: Situation familiale - Required fields (conditional)
export const memberStep2RequiredFields = [
  { field: 'situationMatrimoniale', label: 'Situation matrimoniale' },
];

// Step 3: Parcours spirituel - Required fields
export const memberStep3RequiredFields = [
  { field: 'baptemeEau', label: 'Baptême d\'eau' },
  { field: 'baptemeSaintEsprit', label: 'Baptême du Saint-Esprit' },
];

// Step 4: Vie ecclésiale - Required fields
export const memberStep4RequiredFields = [
  { field: 'anneeTransfiguration', label: 'Année d\'arrivée à Transfiguration' },
  { field: 'satisfactionTransfiguration', label: 'Niveau de satisfaction' },
  { field: 'membreGroupe', label: 'Membre d\'un groupe' },
  { field: 'frequenceCultesDimanche', label: 'Fréquence aux cultes du dimanche' },
];

// Step 5: Vie professionnelle - Required fields
export const memberStep5RequiredFields = [
  { field: 'niveauEtudes', label: 'Niveau d\'études' },
  { field: 'situationProfessionnelle', label: 'Situation professionnelle' },
];

// Step 6: Besoins spirituels - No required fields
export const memberStep6RequiredFields: { field: string; label: string }[] = [];

// Step 7: Santé - No required fields
export const memberStep7RequiredFields: { field: string; label: string }[] = [];

// All member required fields by step
export const memberRequiredFieldsByStep = [
  memberStep1RequiredFields,
  memberStep2RequiredFields,
  memberStep3RequiredFields,
  memberStep4RequiredFields,
  memberStep5RequiredFields,
  memberStep6RequiredFields,
  memberStep7RequiredFields,
];

// ==== CHILD FORM VALIDATION ====

// Step 1: Informations générales
export const childStep1RequiredFields = [
  { field: 'nomPrenoms', label: 'Nom et prénoms' },
  { field: 'sexe', label: 'Sexe' },
  { field: 'dateNaissance', label: 'Date de naissance' },
  { field: 'nationalite', label: 'Nationalité' },
  { field: 'lieuResidence', label: 'Lieu de résidence' },
];

// Step 2: Affiliation
export const childStep2RequiredFields = [
  { field: 'residenceParents', label: 'Résidence des parents' },
  { field: 'contactParents', label: 'Contact des parents' },
];

// Step 3: Vie sociale et spirituelle
export const childStep3RequiredFields = [
  { field: 'depuisQuandEglise', label: 'Depuis quand à l\'église' },
  { field: 'parentsEglise', label: 'Parents à l\'église' },
  { field: 'niveauEtudes', label: 'Niveau d\'études' },
];

// All child required fields by step (only 3 steps for children)
export const childRequiredFieldsByStep = [
  childStep1RequiredFields,
  childStep2RequiredFields,
  childStep3RequiredFields,
];

// ==== VALIDATION FUNCTIONS ====

export function validateStep(
  formData: Record<string, string | string[] | undefined>,
  requiredFields: { field: string; label: string }[]
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const { field, label } of requiredFields) {
    const value = formData[field];
    
    if (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
      errors.push({
        field,
        message: `Le champ "${label}" est obligatoire`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateMemberStep(
  step: number,
  formData: Record<string, string | string[] | undefined>
): ValidationResult {
  if (step < 0 || step >= memberRequiredFieldsByStep.length) {
    return { isValid: true, errors: [] };
  }
  return validateStep(formData, memberRequiredFieldsByStep[step]);
}

export function validateChildStep(
  step: number,
  formData: Record<string, string | string[] | undefined>
): ValidationResult {
  if (step < 0 || step >= childRequiredFieldsByStep.length) {
    return { isValid: true, errors: [] };
  }
  return validateStep(formData, childRequiredFieldsByStep[step]);
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Côte d'Ivoire format)
export function isValidPhone(phone: string): boolean {
  // Accept various formats: +225XXXXXXXXXX, 225XXXXXXXXXX, 0XXXXXXXXX, XXXXXXXXXX
  const phoneRegex = /^(\+?225)?[0-9]{10}$/;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  return phoneRegex.test(cleanPhone);
}

// Year validation
export function isValidYear(year: string, minYear = 1900, maxYear = new Date().getFullYear()): boolean {
  const yearNum = parseInt(year, 10);
  return !isNaN(yearNum) && yearNum >= minYear && yearNum <= maxYear;
}
