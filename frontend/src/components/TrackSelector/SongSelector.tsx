import { Box, Button, Card, Flex } from "@radix-ui/themes";
import { SelectedTrack, TrackSelection } from "../../types";
import { SongItem } from "./SongItem";
import { useCallback } from "react";
import { useGetSongsByArtistQuery } from "../../app/setlistService";
import { SpotifyArtist } from "../../app/spotifyService";
import { ErrorMessage } from "../common/ErrorMessage";

type ErrorData = {
  data: {
    error: string;
  };
};

type SongSelectorProps = {
  artist: SpotifyArtist;
  selection?: TrackSelection;
  onChange: (selection: TrackSelection) => void;
};

export const SongSelector = ({
  selection,
  onChange,
  artist,
}: SongSelectorProps) => {
  const searchValue = artist.name;

  const {
    data: setlistResponse,
    isError,
    isLoading,
    error,
  } = useGetSongsByArtistQuery(searchValue, {
    skip: !searchValue || searchValue.trim().length === 0
  });

  const songs = setlistResponse?.songs ?? [];

  const handleSelectTrack = useCallback(
    (songName: string) => (selectedTrack: SelectedTrack) => {
      onChange({ ...selection, [songName]: selectedTrack });
    },
    [onChange, selection]
  );

const getErrorMessage = (error: ErrorData) => {
  return `Error obtaining Setlist: ${error.data.error}`;
};

  return (
    <Box>
      <Flex mb="2" justify="end">
        <Button variant="soft" disabled>
          Select live versions
        </Button>
      </Flex>
      {isLoading && <div>Loading...</div>}
      {isError && <ErrorMessage message={getErrorMessage(error as ErrorData)} />}
      {songs.map((song, i) => (
        <Card key={`song-list-${i}`} mb="6">
          <SongItem
            artist={artist}
            selected={selection?.[song.name]}
            onSelect={handleSelectTrack(song.name)}
            song={song}
          />
        </Card>
      ))}
    </Box>
  );
};
