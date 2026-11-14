export type Show = {
  id: number;
  name: string;
  summary?: string | null;
  image?: {
    medium?: string | null;
    original?: string | null;
  } | null;
  rating?: {
    average?: number | null;
  };
};

export type ShowSearchResult = {
  score: number;
  show: Show;
};
