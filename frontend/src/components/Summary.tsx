import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  Text,
  Flex,
  Callout,
  Strong,
  DataList,
  Button,
} from "@radix-ui/themes";
import { PlaylistSelection, TrackSelection } from "../types";

type SummaryProps = {
  selectedPlaylist: PlaylistSelection;
  goToStep: (step: number) => void;
  selectedTracks: TrackSelection;
};

export const Summary = ({
  selectedPlaylist,
  goToStep,
  selectedTracks,
}: SummaryProps) => {
  return (
    <Flex direction="column" gap="6">
      <Callout.Root color="yellow">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>
          You're about to{" "}
          <Strong>
            {selectedPlaylist.type === "new"
              ? "create a new playlist"
              : "edit an existing playlist"}
          </Strong>
        </Callout.Text>
      </Callout.Root>

      <DataList.Root orientation={{ initial: "vertical", sm: "horizontal" }}>
        {selectedPlaylist.type === "new" ? (
          <DataList.Item>
            <DataList.Label minWidth="88px">New playlist name</DataList.Label>
            <DataList.Value>
              <Flex gap="2">
                <Text>{selectedPlaylist.name}</Text>
                <Button variant="ghost" onClick={() => goToStep(4)}>
                  Change
                </Button>
              </Flex>
            </DataList.Value>
          </DataList.Item>
        ) : (
          <DataList.Item>
            <DataList.Label minWidth="88px">Selected playlist</DataList.Label>
            <DataList.Value>
              <Flex gap="2">
                <Text>{selectedPlaylist.selection?.name}</Text>
                <Button variant="ghost" onClick={() => goToStep(4)}>
                  Change
                </Button>
              </Flex>
            </DataList.Value>
          </DataList.Item>
        )}
        <DataList.Item>
          <DataList.Label minWidth="88px">Tracks to be added</DataList.Label>
          <DataList.Value>
            <Flex gap="2">
              <Text>
                {selectedTracks && Object.keys(selectedTracks)?.length}
              </Text>
              <Button variant="ghost" onClick={() => goToStep(3)}>
                Review
              </Button>
            </Flex>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Flex>
  );
};
