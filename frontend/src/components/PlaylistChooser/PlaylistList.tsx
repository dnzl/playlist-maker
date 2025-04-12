import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Text, Flex, RadioCards, Avatar, Box } from "@radix-ui/themes";
import { getInitials } from "../../utils";
import {
  SpotifyGetPlaylistsReponse,
  SpotifyPlaylist,
} from "../../app/spotifyService";
import { useCallback } from "react";

type PlaylistsListProps = {
  playlists: SpotifyGetPlaylistsReponse["items"];
  selected?: SpotifyPlaylist;
  onChange: (playlist: SpotifyPlaylist) => void;
};
export const PlaylistsList = ({
  playlists,
  selected,
  onChange,
}: PlaylistsListProps) => {
  const handleChange = useCallback(
    (playlistId: string) => {
      const selected = playlists.find((p) => p.id === playlistId);
      if (!selected) return;
      onChange(selected);
    },
    [onChange, playlists]
  );

  return (
    <Flex direction="column" gap="4">
      <RadioCards.Root
        columns={{ initial: "1", sm: "1" }}
        onValueChange={handleChange}
      >
        {playlists.map((playlist) => {
          if (!playlist) return null;
          const description = [
            playlist.collaborative && "Collaborative",
            playlist.public && "Public",
            `Total Tracks: ${playlist.tracks.total}`,
            `Owner: ${playlist.owner.display_name}`,
          ]
            .filter((v) => v)
            .join(" • ");
          return (
            <RadioCards.Item
              key={`playlist-selector-${playlist.id}`}
              value={playlist.id}
              style={{ display: "block" }}
              checked={selected?.id === playlist.id}
            >
              <Flex justify="between" align="center">
                <Flex justify="start" gap="3" align="center">
                  <Avatar
                    size="3"
                    src={playlist.images?.[0]?.url}
                    radius="full"
                    fallback={getInitials(playlist.name)}
                  />
                  <Box>
                    <Text as="div" size="2" weight="bold">
                      {playlist.name}
                    </Text>
                    <Text as="div" size="2" color="gray">
                      {description}
                    </Text>
                  </Box>
                </Flex>
                <Box>
                  {selected?.id === playlist.id && <CheckCircledIcon />}
                </Box>
              </Flex>
            </RadioCards.Item>
          );
        })}
      </RadioCards.Root>
    </Flex>
  );
};
