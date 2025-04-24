import { Box, Button, Card, Flex } from "@radix-ui/themes";
import { SelectedTrack, TrackSelection } from "../../types";
import { SongItem } from "./SongItem";
import { useCallback, useMemo } from "react";
import { useGetSongsByArtistQuery } from "../../app/setlistService";
import { SpotifyArtist } from "../../app/spotifyService";
// import SpotifyTrackList from "./SpotifyTrackList";

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
  // TODO throw error if no artist name
  const searchValue = artist.name;

  const {
    data: setlistResponse,
    isSuccess,
    isLoading,
  } = useGetSongsByArtistQuery(searchValue, {
    skip: !searchValue || searchValue.trim().length === 0,
    refetchOnMountOrArgChange: true,
  });

  const songs = setlistResponse?.songs ?? [];

  const handleSelectTrack = useCallback(
    (songName: string) => (selectedTrack: SelectedTrack) => {
      onChange({ ...selection, [songName]: selectedTrack });
    },
    [onChange, selection]
  );


  return (
    <Box>
      <Flex mb="2" justify="end">
        <Button variant="soft" disabled>
          Select live versions
        </Button>
      </Flex>
      {isLoading && <div>Loading...</div>}
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
