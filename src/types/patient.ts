export interface PatientVitals {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  temperature: number;
}

export interface PatientLabs {
  lactate: number;
  wbc: number;
  creatinine: number;
  gfr: number;
  alt: number;
  ast: number;
  procalcitonin: number;
  crp: number;
  ph?: number;
  pco2?: number;
  po2?: number;
}

export interface Allergy {
  drug: string;
  reactionType: 'anaphylaxis' | 'rash' | 'gi_upset' | 'other' | 'unknown';
  severity: 'mild' | 'moderate' | 'severe';
}

export interface Comorbidities {
  copd: boolean;
  diabetes: boolean;
  immunosuppression: boolean;
  heartFailure: boolean;
  ckd: boolean;
  esrd: boolean;
  priorMRSA: boolean;
  priorPseudomonas: boolean;
}

export interface RiskFactors {
  hospitalizationLast90Days: boolean;
  ivAntibioticsLast90Days: boolean;
  longTermCareFacility: boolean;
  mechanicalVentilation: boolean;
}

export interface PatientData {
  age: number;
  weight: number;
  vitals: PatientVitals;
  labs: PatientLabs;
  sofa: number;
  qsofa: number;
  qtcProlonged: boolean;
  qtcValue?: number;
  allergies: Allergy[];
  allergiesVerified: boolean;
  comorbidities: Comorbidities;
  riskFactors: RiskFactors;
  imagingFindings?: string;
}

export interface AntibioticRecommendation {
  name: string;
  dose: string;
  frequency: string;
  route: string;
  duration: string;
  renalAdjustment?: string;
  hepaticAdjustment?: string;
}

export interface TherapyRecommendation {
  primaryRegimen: AntibioticRecommendation[];
  alternativeRegimen?: AntibioticRecommendation[];
  rationale: string[];
  warnings: string[];
  mdroRiskScore: 'low' | 'moderate' | 'high';
  predictedPathogens: string[];
  deescalationNotes: string;
  guidelineCompliance: string;
}
