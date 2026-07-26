export enum TourDifficulty {
  EASY = "easy",
  MODERATE = "moderate",
  DIFFICULT = "difficult",
}

export interface ITour {
  title: string;
  description: string;
  destination: string;

  duration: number;
  price: number;
  maxGroupSize: number;

  difficulty: TourDifficulty;

  images: string[];
  availableDates: Date[];

  includedServices: string[];
  excludedServices: string[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
