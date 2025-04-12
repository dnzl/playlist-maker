// Type definitions for the application

export interface SetlistResponse {
  setlist: Array<{
    sets: {
      set: Array<{
        song: Array<{
          name: string;
        }>;
      }>;
    };
  }>;
}

export interface SetlistArtist {
  mbid: string;
  name: string;
  url: string;
}

export interface SongStatistics {
  name: string;
  totalPlays: number;
  showCount: number;
} 