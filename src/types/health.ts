export type TreatmentModality = 'modern' | 'ayurvedic' | 'siddha' | 'integrated';

export interface WearableDevice {
  id: string;
  name: string;
  brand: string;
  type: 'smartwatch' | 'fitness_band' | 'medical_device' | 'phone';
  connected: boolean;
  batteryLevel?: number;
  sensors: string[];
  lastSync?: Date;
  aiCapability: number; // percentage of NEXUS features available
}

export interface VitalMetrics {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  spO2: number;
  temperature: number;
  steps: number;
  sleepHours: number;
  stressLevel: number;
  glucoseLevel?: number;
  respiratoryRate?: number;
  hrv?: number; // Heart Rate Variability in ms
}

export interface AyurvedicMetrics {
  prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha';
  vikriti: string;
  agni: number; // 1-10
  ojas: 'Low' | 'Moderate' | 'Good' | 'Excellent';
}

export interface SiddhaMetrics {
  nadi: string;
  energyBalance: 'Balanced' | 'Imbalanced';
  varmamStatus: 'Clear' | 'Attention Needed';
}

export interface HealthPrediction {
  condition: string;
  riskPercentage: number;
  timeframe: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  treatmentModality: TreatmentModality;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'modern' | 'ayurvedic' | 'siddha' | 'integrated' | 'government';
  distance: number;
  address: string;
  rating: number;
  reviewCount: number;
  availableBeds: {
    icu: { available: number; total: number };
    general: { available: number; total: number };
  };
  waitTime: number; // minutes
  insuranceCovered: boolean;
  specialties: string[];
  equipment: string[];
  doctors: Doctor[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  modality: TreatmentModality;
  hospital: string;
  rating: number;
  experience: number;
  availableSlots: string[];
  consultationFee: number;
  languages: string[];
}

export interface HealthCircle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: 'diabetes' | 'cardiac' | 'weight' | 'mental' | 'pregnancy' | 'wellness';
  isJoined: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  preferredModality: TreatmentModality;
  healthScore: number;
  subscription: 'basic' | 'standard' | 'premium' | 'pro';
  connectedDevices: WearableDevice[];
  emergencyContacts: EmergencyContact[];
}
