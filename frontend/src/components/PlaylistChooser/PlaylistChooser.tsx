import { Box, Flex, Text, RadioCards, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PlaylistSelection } from "../../types";
import { PlaylistsList } from "./PlaylistList";
import { SpotifyPlaylist, useGetPlaylistsQuery } from "../../app/spotifyService";
import { ErrorMessage } from "../common/ErrorMessage";

type PlaylistChooserProps = {
  selection: PlaylistSelection;
  onChange: (selection: PlaylistSelection) => void;
};

export const PlaylistChooser = ({
  onChange,
  selection,
}: PlaylistChooserProps) => {
  const { data, isLoading, isError } = useGetPlaylistsQuery(null, {
    skip: selection.type !== "existing",
  });

  const playlists = useMemo(() => data?.items ?? [], [data]);
  const defaultSelectedPlaylist = useMemo(() => {
    if (selection.type === "new") return undefined;
    return playlists.find((p) => p.id === selection?.selection?.id);
  }, [playlists, selection]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<
    SpotifyPlaylist | undefined
  >(defaultSelectedPlaylist);
  const [name, setName] = useState("");
  const [type, setType] = useState(selection.type);

  const handleTypeChange = useCallback((type: PlaylistSelection["type"]) => {
    setType(type);
  }, []);

  useEffect(() => {
    const newValue =
      type === "new" ? { type, name } : { type, selection: selectedPlaylist };

    onChange(newValue);
  }, [name, onChange, selectedPlaylist, type]);

  return (
    <Box>
      <Box mb="4">
        <RadioCards.Root
          defaultValue={selection.type}
          onValueChange={handleTypeChange}
          columns={{ initial: "1", sm: "2" }}
        >
          <RadioCards.Item value="new">
            <Text>Create a new playlist</Text>
          </RadioCards.Item>
          <RadioCards.Item value="existing">
            <Text>Select an existing playlist</Text>
          </RadioCards.Item>
        </RadioCards.Root>
      </Box>
      {selection.type === "new" ? (
        <Flex gap="2" align="center">
          <Text as="label" htmlFor="new-playlist-name">
            Playlist name:
          </Text>
          <TextField.Root
            id="new-playlist-name"
            name="new-playlist-name"
            placeholder="Enter a name for the playlist"
            onChange={(e) => setName(e.target.value)}
            value={name}
            style={{ width: 400 }}
          />
        </Flex>
      ) : (
        isError ? (
          <ErrorMessage message="Error loading playlists" />
        ) : isLoading ? (
          <Text>Loading playlists...</Text>
        ) : playlists.length > 0 ? (
          <PlaylistsList
            playlists={playlists}
            selected={selectedPlaylist}
            onChange={setSelectedPlaylist}
          />
        ) : (
          <Text>No playlists found</Text>
        )
      )}
    </Box>
  );
};
