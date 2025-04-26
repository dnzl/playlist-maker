import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type SpotifyArtist = {
  external_urls: Record<string, string>;
  followers: {
    href?: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: { height: number; url: string; width: number }[];
  name: string;
  popularity: number;
  type: string; // 'artist'
  uri: string; // "spotify:artist:5UzFfn3lNMWSm4PHCzBDi8"
};

type SpotifyArtistReponse = {
  artists: {
    items: SpotifyArtist[];
  };
};
type SpotifyTrackArtist = {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};
export type SpotifyTrack = {
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
    album_type: string;
  };
  artists: SpotifyTrackArtist[];
  duration_ms: number;
  id: string;
  name: string;
  uri: string;
  popularity: number;
};
type SpotifyTrackParams = { artist: string; track: string };
export type SpotifyTrackReponse = {
  tracks: {
    items: SpotifyTrack[];
  };
};

type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};

export type SpotifyPlaylist = {
  collaborative: boolean;
  description: string;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: {
    external_urls: { spotify: string };
    followers: { href: string; total: number };
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string;
  };
  public: boolean;
  snapshot_id: string;
  tracks: { href: string; total: number };
  type: string;
  uri: string;
};

export type SpotifyGetPlaylistsReponse = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: SpotifyPlaylist[];
};

type SpotifyPaginationParams = {
  limit: number;
  offset: number;
};

export type SpotifyUser = {
  id: string;
  display_name: string;
  images: SpotifyImage[];
};

// User ID state management
let currentUserId: string | null = null;

export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
};

export const getCurrentUserId = () => currentUserId;

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

// Define a service using a base URL and expected endpoints
export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.spotify.com/v1/",
    prepareHeaders: headers => {
      const token = localStorage.getItem("spotify_access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    searchArtist: builder.query<SpotifyArtistReponse, string>({
      query: searchString => `search?q=${encodeURI(searchString)}&type=artist`,
    }),
    searchTrack: builder.query<SpotifyTrackReponse, SpotifyTrackParams>({
      query: ({ artist, track }) =>
        `search?q=${encodeURI(`artist:${artist} track:${track}`)}&type=track`,
    }),
    getPlaylists: builder.query<SpotifyGetPlaylistsReponse, null>({
      query: () => `me/playlists`,
    }),
    createPlaylist: builder.mutation({
      query: ({ userId, name, description }) => ({
        url: `users/${userId}/playlists`,
        method: "POST",
        body: { name, description, public: false },
      }),
    }),
    addTracksToPlaylist: builder.mutation({
      query: ({ playlistId, tracksURIs }) => ({
        url: `playlists/${playlistId}/tracks`,
        body: {
          uris: tracksURIs,
        },
        method: "POST",
      }),
    }),
    getCurrentUser: builder.query<SpotifyUser, void>({
      query: () => "me",
    }),
    getTokens: builder.mutation<TokenResponse, string>({
      query: code => ({
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }).toString(),
      }),
    }),
    refreshToken: builder.mutation<TokenResponse, string>({
      query: refreshToken => ({
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(),
      }),
    }),
  }),
});

export const {
  useSearchArtistQuery,
  useSearchTrackQuery,
  useCreatePlaylistMutation,
  useAddTracksToPlaylistMutation,
  useGetPlaylistsQuery,
  useGetCurrentUserQuery,
  useGetTokensMutation,
  useRefreshTokenMutation,
} = spotifyApi;

export const storeTokens = (tokens: TokenResponse) => {
  localStorage.setItem("spotify_access_token", tokens.access_token);
  localStorage.setItem("spotify_refresh_token", tokens.refresh_token);
  localStorage.setItem("spotify_token_expiry", String(Date.now() + tokens.expires_in * 1000));
};

export const getStoredTokens = () => {
  const accessToken = localStorage.getItem("spotify_access_token");
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  const expiry = localStorage.getItem("spotify_token_expiry");
  return { accessToken, refreshToken, expiry };
};

export const clearTokens = () => {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_token_expiry");
};
