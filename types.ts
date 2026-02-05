
export enum DoshaType {
  VATA = 'Vata',
  PITTA = 'Pitta',
  KAPHA = 'Kapha'
}

export type AssessmentModuleId = 'prakruti' | 'dosha' | 'agni' | 'dhatu' | 'sara' | 'mala' | 'koshta';

export interface UserProfile {
  name: string;
  phone?: string;
  sex: 'Male' | 'Female' | 'Other';
  dob: string;
  age: number;
  place: string;
  occupation: string;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  type?: 'categorical' | 'vas' | 'multi-select';
  options: {
    label: string;
    value: string;
    description: string;
  }[];
}

export interface AssessmentModule {
  id: AssessmentModuleId;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export interface ModuleResult {
  moduleId: AssessmentModuleId;
  scores: Record<string, number>; // percentages for Vata, Pitta, Kapha
  classification: string;
  insight: string;
  reasoning: string;
  subScores?: Record<string, { percentage: number; classification: string } | number | string>;
  recommendations: {
    ahara: string[];
    vihara: string[];
  };
  references: string[];
  agniStatus?: string;
}

export interface AssessmentState {
  view: 'onboarding' | 'dashboard' | 'assessment' | 'module-result' | 'quota-error';
  profile: UserProfile | null;
  activeModule: AssessmentModuleId | null;
  activeResultId: AssessmentModuleId | null;
  answers: Record<string, string>;
  images: Record<string, string>;
  isAnalyzing: boolean;
  moduleResults: Record<string, ModuleResult>;
  unclearIds: string[]; 
}
