import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Artist = {
  disambiguation?: string; // genre
  mbid: string;
  name: string;
};

export interface SongResponse {
  name: string;
  totalPlays: number;
  showCount: number;
  averagePosition: number;
}

export interface SongsResponse {
  artist: Artist;
  songs: SongResponse[];
}

type ArtistSearchState = {
  searchValue: string;
  artistsFound: SongsResponse | null;
  selectedArtist: Artist | null;
};

const initialState: ArtistSearchState = {
  searchValue: "",
  artistsFound: null,
  selectedArtist: null,
};

export const artistSearchSlice = createSlice({
  name: "artistSearch",
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    setFoundArtists: (state, action: PayloadAction<SongsResponse>) => {
      state.artistsFound = action.payload;
    },
    // setFoundArtists: (state, action: PayloadAction<Artist[]>) => {
    //   state.artistsFound = action.payload;
    // },
    selectArtist: (state, action: PayloadAction<Artist>) => {
      state.selectedArtist = action.payload;
    },
  },
});

export const { setSearchValue, setFoundArtists, selectArtist } =
  artistSearchSlice.actions;

export default artistSearchSlice.reducer;
