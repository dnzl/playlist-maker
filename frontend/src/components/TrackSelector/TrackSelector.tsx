import { CircleBackslashIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Text, Flex, RadioCards, Avatar, Box } from "@radix-ui/themes";
import { getInitials } from "../../utils";
import { useCallback } from "react";
import { SelectedTrack } from "../../types";
import { SpotifyTrackReponse } from "../../app/spotifyService";

type TrackSelectorProps = {
  tracks: SpotifyTrackReponse["tracks"]["items"];
  selected?: SelectedTrack;
  onChange: (selection: SelectedTrack) => void;
};
export const TrackSelector = ({
  tracks,
  selected,
  onChange,
}: TrackSelectorProps) => {
  const onValueChange = useCallback(
    (id: string) => {
      if (id === "none") {
        onChange({ trackId: "none" });
        return;
      }
      const selectedTrack = tracks.find((t) => t.id === id);

      onChange({
        trackId: id,
        track: selectedTrack,
      });
    },
    [onChange, tracks]
  );

  return (
    <Flex direction="column" gap="4">
      <RadioCards.Root
        columns={{ initial: "1", sm: "1" }}
        onValueChange={onValueChange}
      >
        <RadioCards.Item
          key={`track-checker-none`}
          value="none"
          style={{ display: "block" }}
        >
          <Flex justify="between" align="center">
            <Flex justify="start" gap="3" align="center">
              <Avatar
                size="3"
                radius="full"
                fallback={<CircleBackslashIcon />}
              />
              <Box>
                <Text as="div" size="2" weight="bold">
                  Do not include in playlist
                </Text>
              </Box>
            </Flex>
            <Box>{selected?.trackId === "none" && <CheckCircledIcon />}</Box>
          </Flex>
        </RadioCards.Item>
        {tracks.map(
          (track) =>
            track && (
              <RadioCards.Item
                key={`track-checker-${track.id}`}
                value={track.id}
                style={{ display: "block" }}
                checked={selected?.trackId === track.id}
              >
                <Flex justify="between" align="center">
                  <Flex justify="start" gap="3" align="center">
                    <Avatar
                      size="3"
                      src={track.album?.images?.[0]?.url}
                      radius="full"
                      fallback={getInitials(track.album?.name)}
                    />
                    <Box>
                      <Text as="div" size="2" weight="bold">
                        {track.name}
                      </Text>
                      <Text as="div" size="2" color="gray">
                        Album: {track.album?.name}
                      </Text>
                    </Box>
                  </Flex>
                  <Box>
                    {selected?.trackId === track.id && <CheckCircledIcon />}
                  </Box>
                </Flex>
              </RadioCards.Item>
            )
        )}
      </RadioCards.Root>
    </Flex>
  );
};
