export interface Movie {
  id: number;
  title: string;
  year: number;
  genres?: string[]; // Optional for missing data
  ratings?: {
    imdb?: number; // Optional for missing IMDb ratings
    rottenTomatoes?: number; // Optional for missing Rotten Tomatoes ratings
    metascore?: number; // Optional for missing Metascore ratings
  };
  summary?: string; // Optional for movies without a summary
  director?: string; // Added field for director integration
  runtime?: number; // Optional field for runtime in minutes
  language?: string; // Optional field for movie language
}
