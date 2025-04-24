import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRightIcon, Cross1Icon } from "@radix-ui/react-icons";
import {
  Text,
  Flex,
  Box,
  ChevronDownIcon,
  Heading,
  Strong,
  IconButton,
  Button,
} from "@radix-ui/themes";
import { TrackSelector } from "./TrackSelector";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SelectedTrack } from "../../types";
import { SpotifyArtist, useSearchTrackQuery } from "../../app/spotifyService";
import { SongResponse } from "../../app/artists";

type SongItemProps = {
  song: SongResponse;
  artist: SpotifyArtist;
  selected?: SelectedTrack;
  onSelect: (selected: SelectedTrack) => void;
};

export const SongItem = ({ song, onSelect, selected, artist }: SongItemProps) => {
  const [open, setOpen] = useState(false);
  const songName = song.name;
  const {
    data: spotifyTracks,
    isSuccess,
    isLoading,
  } = useSearchTrackQuery({
    artist: artist.name,
    track: songName,
  });

  const tracks = useMemo(
    () =>
      (spotifyTracks?.tracks?.items &&
        [...spotifyTracks.tracks.items]
          .filter(track => {
            const result =
              track.album.album_type !== "compilation" &&
              track.artists.find(a => a.name.toLowerCase() === artist.name.toLowerCase());
            // console.log("track filter", { track, result });
            return result;
          })
          .sort((trackA, trackB) => (trackA.popularity > trackB.popularity ? -1 : 1))) ??
      [],
    [artist, spotifyTracks]
  );

  useEffect(() => {
    if (selected) return;
    const mostPopularTrack = tracks?.[0];
    if (!mostPopularTrack) return;
    onSelect({
      trackId: mostPopularTrack.id,
      track: mostPopularTrack,
    });
  }, [tracks, selected, onSelect]);


  
  const handleUnselect = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
   
    onSelect({ trackId: "none", track: undefined });
    
  }, [onSelect]);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Flex justify="between" align="center" gap="4">
          <Flex align="center" gap="4" flexGrow="1">
            <Box width="20">
              <IconButton variant="ghost" size="1">
                {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Box>
            <Flex direction="column" flexGrow="1">
              <Heading size="4">{song.name}</Heading>
              <Text as="div" size="2" color="gray">
                Played {song.totalPlays} times in {song.showCount} shows.
              </Text>
            </Flex>
            {selected && (
            <Flex gap="4">
              <Flex direction="column">

                  <Text size="2">
                    Selected:{" "}
                    <Strong>{selected?.trackId === "none" ? "None" : selected.track?.name}</Strong>
                    {selected.track?.album?.name && (
                      <>
                        <br />
                        from album: <Strong>{selected.track.album.name}</Strong>
                      </>
                    )}
                  </Text>
                
              </Flex>
              <Box>
                <Button
                  disabled={selected?.trackId === "none"}
                  variant="outline"
                  onClick={handleUnselect}
                >
                  <Cross1Icon /> Unselect
                </Button>
              </Box>
            </Flex>
            )}
          </Flex>
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Box m="4">
          <TrackSelector tracks={tracks} selected={selected} onChange={onSelect} />
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
