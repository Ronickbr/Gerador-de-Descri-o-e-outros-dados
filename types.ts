
export interface Source {
  title: string;
  uri: string;
}

export interface GeneratedContent {
  marketing: string;
  specs: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  sources: Source[];
  images: string[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ProductFormData {
  productName: string;
  manufacturer: string;
  category?: string;
  subcategory?: string;
}

// Bulk Processing Types
export interface BulkUploadItem {
  id: string;
  productName: string;
  manufacturer: string;
  category: string;
  subcategory: string;
  photo1: string;
  photo2: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  result?: GeneratedContent;
  error?: string;
  originalData?: any; // Stores the raw row from Excel to preserve other columns
}
