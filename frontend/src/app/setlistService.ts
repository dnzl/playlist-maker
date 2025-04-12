// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SongsResponse } from "./artists";

// Define a service using a base URL and expected endpoints
export const setlistApi = createApi({
  reducerPath: "setlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints: builder => ({
    getSongsByArtist: builder.query<SongsResponse, string>({
      query: name => `search-artist-setlist?q=${name}`,
    }),
  }),
});

export const { useGetSongsByArtistQuery } = setlistApi;
