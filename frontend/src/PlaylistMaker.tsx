import { Button, Callout, Container, Heading, Section } from "@radix-ui/themes";
import { SearchArtist } from "./components/SearchArtists/SearchArtist";
import { useCallback, useEffect, useState } from "react";
import { ServiceChooser } from "./components/ServiceChooser";
import { Step } from "./Step";
import { PlaylistSelection, SelectionType, TrackSelection } from "./types";
import { useStepper } from "./hooks/useStepper";
import { SongSelector } from "./components/TrackSelector/SongSelector";
import { useSetlistCreator } from "./hooks/useSetlistCreator";
import { PlaylistChooser } from "./components/PlaylistChooser/PlaylistChooser";
import { Summary } from "./components/Summary";
import { getCurrentUserId, setCurrentUserId, SpotifyArtist, useGetCurrentUserQuery } from "./app/spotifyService";
import { CheckCircledIcon } from "@radix-ui/react-icons";

enum STEPS {
  CHOOSE_SERVICE = 1,
  SEARCH_ARTIST = 2,
  SELECT_SONGS = 3,
  CHOOSE_PLAYLIST = 4,
  CREATE_PLAYLIST = 5,
  SUCCESS = 6,
}

export const PlaylistMakerApp = () => {
  const token = localStorage.getItem("spotify_access_token") || null;
  const {
    data: currentUser,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });
  if (token && !isLoading && !isFetching && (isSuccess || isError) && !currentUser?.id) {
    localStorage.removeItem("spotify_access_token");
  }
  const isLoggedIn = !!token && !!currentUser?.id;

  const [selectedService, setSelectedService] = useState<SelectionType>({
    value: "Spotify",
    name: "Spotify",
  });
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist>();
  const [selectedTracks, setSelectedTracks] = useState<TrackSelection>();
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistSelection>({
    type: "new",
    name: "",
  });

  const onCreatePlaylistSuccess = useCallback(() => {
    goToStep(STEPS.SUCCESS);
    setSelectedArtist(undefined);
    setSelectedTracks(undefined);
 
  },[selectedPlaylist]);

  const { songSelection, playlistSelection, artistSelection, createPlaylist, isCreatingPlaylist } = useSetlistCreator({
    selectedTracks,
    selectedPlaylist,
    selectedArtist,
    onCreatePlaylistSuccess
  });
  const { currentStep, goToNextStep, goToStep } = useStepper({
    onFinish: createPlaylist,
  });

  const selectArtist = useCallback((artist: SpotifyArtist) => {
    if(selectedArtist?.id !== artist.id) setSelectedTracks(undefined);
    setSelectedArtist(artist);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const userId = getCurrentUserId();
      if (!userId) {
        setCurrentUserId(currentUser.id);
      }
    }
  }, [currentUser, isLoggedIn]);

  return (
    <Section>
      <Container mb="8">
        <Heading as="h1">Setlist Playlist Maker</Heading>
      </Container>
      <Step
        step={STEPS.CHOOSE_SERVICE}
        title="Choose a Service"
        selection={ isLoggedIn ? selectedService : undefined}
        collapsed={currentStep !== STEPS.CHOOSE_SERVICE}
        goToNextStep={goToNextStep}
        changeSelection={() => goToStep(STEPS.CHOOSE_SERVICE)}
      >
        <ServiceChooser selection={selectedService} onChange={setSelectedService} />
      </Step>
      <Step
        step={STEPS.SEARCH_ARTIST}
        title="Search an Artist"
        selection={artistSelection}
        collapsed={currentStep !== STEPS.SEARCH_ARTIST}
        goToNextStep={goToNextStep}
        changeSelection={() => goToStep(STEPS.SEARCH_ARTIST)}
      >
        <SearchArtist selection={selectedArtist} onChange={selectArtist} />
      </Step>
      <Step
        step={STEPS.SELECT_SONGS}
        title="Select Songs"
        collapsed={currentStep !== STEPS.SELECT_SONGS}
        goToNextStep={goToNextStep}
        changeSelection={() => goToStep(STEPS.SELECT_SONGS)}
        selection={songSelection}
      >
        {selectedArtist ? (
          <SongSelector
            artist={selectedArtist}
            selection={selectedTracks}
            onChange={setSelectedTracks}
          />
        ) : (
          <>Error: select an artist first</>
        )}
      </Step>
      <Step
        step={STEPS.CHOOSE_PLAYLIST}
        title="Choose a Playlist"
          collapsed={currentStep !== STEPS.CHOOSE_PLAYLIST}
        goToNextStep={goToNextStep}
        changeSelection={() => goToStep(STEPS.CHOOSE_PLAYLIST)}
        selection={playlistSelection}
      >
        <PlaylistChooser selection={selectedPlaylist} onChange={setSelectedPlaylist} />
      </Step>
      <Step
        step={STEPS.CREATE_PLAYLIST}
        title="Confirm and Create your Playlist!"
        collapsed={currentStep !== STEPS.CREATE_PLAYLIST}
        goToNextStep={createPlaylist}
        nextButtonTitle={selectedPlaylist.type === "new" ? "Create Playlist" : `Add Tracks to ${selectedPlaylist.selection?.name || "selected Playlist"}`}
        isLastStep
      >
        {isCreatingPlaylist && <div>Creating playlist...</div>}
        {selectedTracks && (
          <Summary
            selectedPlaylist={selectedPlaylist}
            goToStep={goToStep}
            selectedTracks={selectedTracks}
          />
        )}
      </Step>
      <Step
        step={STEPS.SUCCESS}
        title="Success!!"
        collapsed={currentStep !== STEPS.SUCCESS}
        goToNextStep={() => {goToStep(STEPS.SEARCH_ARTIST)}}
        nextButtonTitle="Add another artist"
        isLastStep
      >
       <Callout.Root color="green" mb="4">
          <Callout.Icon>
            <CheckCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            Playlist "{selectedPlaylist.type === 'new' ? selectedPlaylist.name : selectedPlaylist.selection?.name}" created successfully!
          </Callout.Text>
        </Callout.Root>
      </Step>
    </Section>
  );
};
