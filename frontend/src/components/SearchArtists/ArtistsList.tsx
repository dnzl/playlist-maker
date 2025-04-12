import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Text, Flex, RadioCards, Avatar, Box } from "@radix-ui/themes";
import { getInitials } from "../../utils";
import { SpotifyArtist } from "../../app/spotifyService";
import { useCallback } from "react";

type ArtistsListProps = {
  artists: SpotifyArtist[];
  selected?: SpotifyArtist;
  onChange: (artist: SpotifyArtist) => void;
};
export const ArtistsList = ({
  artists,
  selected,
  onChange,
}: ArtistsListProps) => {
  const handleValueChange = useCallback(
    (artistId: SpotifyArtist["id"]) => {
      const found = artists.find((a) => a.id === artistId);
      if (found) onChange(found);
    },
    [artists, onChange]
  );
  return (
    <Flex direction="column" gap="4">
      <RadioCards.Root
        columns={{ initial: "1", sm: "1" }}
        onValueChange={handleValueChange}
      >
        {artists.map(
          (artist) =>
            artist && (
              <RadioCards.Item
                key={`artist-selector-${artist.id}`}
                value={artist.id}
                style={{ display: "block" }}
                checked={selected?.id === artist.id}
              >
                <Flex justify="between" align="center">
                  <Flex justify="start" gap="3" align="center">
                    <Avatar
                      size="3"
                      src={artist.images?.[0]?.url}
                      radius="full"
                      fallback={getInitials(artist.name)}
                    />
                    <Box>
                      <Text as="div" size="2" weight="bold">
                        {artist.name}
                      </Text>
                      <Text as="div" size="2" color="gray">
                        {artist.genres?.join(", ")}
                      </Text>
                    </Box>
                  </Flex>
                  <Box>
                    {selected?.id === artist.id && <CheckCircledIcon />}
                  </Box>
                </Flex>
              </RadioCards.Item>
            )
        )}
      </RadioCards.Root>
    </Flex>
  );
};
