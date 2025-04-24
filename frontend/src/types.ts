import { SpotifyPlaylist, SpotifyTrack } from "./app/spotifyService";

export type SelectionType = { value: string; name: string };
export type BasicComponentProps<T> = {
  onChange: (selection: T) => void;
  selection?: T;
};
export type TrackSelection = {
  [songName: string]: SelectedTrack;
};
export type SelectedTrack = {
  trackId: string;
  track?: SpotifyTrack;
};

export type PlaylistSelection =
  | { type: "new"; name: string }
  | { type: "existing"; selection?: AllConditionalExceptFor<SpotifyPlaylist, "id" | "name"> };

type AllConditionalExceptFor<T, K extends keyof T> = Pick<T, K> &
  Partial<Pick<T, Exclude<keyof T, K>>>;
