export interface Source {
  title: string;
  uri: string;
}

export interface GeneratedContent {
  marketing: string;
  specs: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  sources: Source[];
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
}