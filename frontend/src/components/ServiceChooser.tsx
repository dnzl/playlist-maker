import { RadioCards, Flex, Text, Avatar, Link } from "@radix-ui/themes";
import { useCallback, useEffect } from "react";
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

  const isLoggedIn = !!localStorage.getItem("spotify_access_token");

  return (
    <>
      <RadioCards.Root
        defaultValue={selection?.value}
        onValueChange={handleOnChange}
        columns={{ initial: "1", sm: "3" }}
      >
        <RadioCards.Item value="none">
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
      {/* TODO move to own component */}
      {selection?.value === "Spotify" &&
        (isLoggedIn ? (
          <Flex gap="2" align="center">
            {/* TODO implement */}
            <Link href="/callback">Logout from Spotify</Link>
          </Flex>
        ) : (
          <div>
            <SpotifyLoginButton />
          </div>
        ))}
    </>
  );
};
