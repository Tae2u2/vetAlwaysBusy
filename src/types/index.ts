export interface PatientInfo {
  name: string;
  patientId: string;
  species: string;
  breed: string;
  gender: string;
  age: string;
  weight: string;
  surgeryDate: string;
  referralHospital: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  imageSlots: ImageSlot[];
}

export interface ImageSlot {
  slotNumber: number;
  file?: File;
  previewUrl?: string;
  caption?: string;
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  slotNumber: number;
}

export interface ReportData {
  patientInfo: PatientInfo;
  chiefComplaint: string;
  bloodTests: string;
  vcmFindings: string;
  xrayFindings: string;
  ultrasoundFindings: string;
  ctFindings: string;
  surgicalProcedure: string;
  postopManagement: string;
  sections: ReportSection[];
  images: UploadedImage[];
}

export interface ParsedDocument {
  text: string;
  type: 'pdf' | 'docx';
}

export interface AuthState {
  isAuthenticated: boolean;
  apiKey: string;
}
