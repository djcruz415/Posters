
export interface PosterData {
  title: string;
  subtitle: string;
  ctaText: string;
  logoUrl: string;
  featuredImageUrl: string;
  secondaryImageUrl: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  EDITING_IMAGE = 'EDITING_IMAGE',
  ERROR = 'ERROR'
}
