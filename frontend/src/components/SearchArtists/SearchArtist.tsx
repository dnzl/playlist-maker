import { Box, Flex, TextField, Button } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { BasicComponentProps } from "../../types";
import { ArtistsList } from "./ArtistsList";
import { SpotifyArtist, useSearchArtistQuery } from "../../app/spotifyService";
import { ErrorMessage } from "../common/ErrorMessage";

export const SearchArtist = ({
  onChange,
  selection,
}: BasicComponentProps<SpotifyArtist>) => {
  const [searchValue, setSearchValue] = useState("");

  const onSearchArtist = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchValue(e.currentTarget.searchArtistValue.value);
  }, []);

  const { data, isLoading, isError } = useSearchArtistQuery(searchValue, {
    skip: !searchValue || searchValue.trim().length === 0
  });

  const artists: SpotifyArtist[] = useMemo(
    () => data?.artists.items ?? [],
    [data]
  );

  return (
    <Box>
      <Box mb="4">
        <form onSubmit={onSearchArtist}>
          <Flex gap="2" align="center">
            <TextField.Root
              name="searchArtistValue"
              placeholder="Search artist by name"
              style={{ width: 400 }}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
            <Button type="submit">Search</Button>
          </Flex>
        </form>
      </Box>
      {isError && <ErrorMessage message="Error loading artists" />}
      {isLoading && <div>Loading...</div>}
      {artists && (
        <ArtistsList
          artists={artists}
          selected={selection}
          onChange={onChange}
        />
      )}
    </Box>
  );
};
