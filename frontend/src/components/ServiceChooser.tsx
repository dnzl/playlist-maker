import { RadioCards, Flex, Text } from "@radix-ui/themes";
import { useCallback } from "react";
import { BasicComponentProps } from "../types";
import { SpotifyLoginButton } from "./SpotifyLoginButton";

export const ServiceChooser = ({
  onChange,
  selection,
}: BasicComponentProps<{ value: string; name: string }>) => {
  const handleOnChange = useCallback(
    (value: string) => {
      onChange({ value, name: value === "none" ? value : "Spotify" });
    },
    [onChange]
  );

  return (
    <>
    <Text>
      At the moment only Spotify is supported
    </Text>
      <RadioCards.Root
        defaultValue={selection?.value}
        onValueChange={handleOnChange}
        columns={{ initial: "1", sm: "3" }}
      >
        <RadioCards.Item value="none" disabled>
          <Flex direction="column" width="100%">
            <Text weight="bold">No service</Text>
            <Text>I only want to see the setlist</Text>
          </Flex>
        </RadioCards.Item>
        <RadioCards.Item value="Spotify">
          <Flex width="100%" gap="2" align="center">
            <Text weight="bold">Spotify</Text>
          </Flex>
        </RadioCards.Item>
        <RadioCards.Item value="youtube" disabled>
          <Flex direction="column" width="100%">
            <Text weight="bold">Youtube</Text>
            <Text>someday...</Text>
          </Flex>
        </RadioCards.Item>
      </RadioCards.Root>
      {selection?.value === "Spotify" && (
        <Flex gap="2" align="center" mt="4">
          <SpotifyLoginButton />
        </Flex>
      )}
    </>
  );
};
