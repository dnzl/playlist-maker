import { Container, Heading, Section } from "@radix-ui/themes";
import { SearchArtist } from "./components/SearchArtists/SearchArtist";
import { useEffect, useState } from "react";
import { ServiceChooser } from "./components/ServiceChooser";
import { Step } from "./Step";
import { PlaylistSelection, SelectionType, TrackSelection } from "./types";
import { useStepper } from "./hooks/useStepper";
import { SongSelector } from "./components/TrackSelector/SongSelector";
import { useSetlistCreator } from "./hooks/useSetlistCreator";
import { PlaylistChooser } from "./components/PlaylistChooser/PlaylistChooser";
import { Summary } from "./components/Summary";
import { getCurrentUserId, setCurrentUserId, SpotifyArtist, useGetCurrentUserQuery } from "./app/spotifyService";

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

  const [selectedService, setSelectedService] = useState<SelectionType>();
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist>();
  const [selectedTracks, setSelectedTracks] = useState<TrackSelection>();
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistSelection>({
    type: "new",
    name: "",
  });

  const { songSelection, playlistSelection, artistSelection, createPlaylist } = useSetlistCreator({
    selectedTracks,
    selectedPlaylist,
    selectedArtist,
  });
  const { currentStep, goToNextStep, goToStep } = useStepper({
    onFinish: createPlaylist,
  });

  useEffect(() => {
    if (isLoggedIn) {
      const userId = getCurrentUserId();
      if (!userId) {
        setCurrentUserId(currentUser.id);
      }
    }
    // TODO fix, for some reason it doesn't update the selection in the child component
    setSelectedService({ value: "Spotify", name: "Spotify" });
  }, [currentUser, isLoggedIn]);

  return (
    <Section>
      <Container mb="8">
        <Heading as="h1">Setlist Playlist Maker</Heading>
      </Container>
      <Step
        step={1}
        title="Choose a Service"
        selection={selectedService}
        collapsed={currentStep !== 1}
        goToNextStep={goToNextStep}
        changeSelection={() => goToStep(1)}
      >
        <ServiceChooser selection={selectedService} onChange={setSelectedService} />
      </Step>
      <Step
        step={2}
        title="Search an Artist"
        selection={artistSelection}
        collapsed={currentStep !== 2}
        goToNextStep={goToNextStep}
        changeSelection={() => goToStep(2)}
      >
        <SearchArtist selection={selectedArtist} onChange={setSelectedArtist} />
      </Step>
      <Step
        step={3}
        title="Select Songs"
        collapsed={currentStep !== 3}
        goToNextStep={goToNextStep}
        changeSelection={() => goToStep(3)}
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
        step={4}
        title="Choose a Playlist"
        collapsed={currentStep !== 4}
        goToNextStep={goToNextStep}
        changeSelection={() => goToStep(4)}
        selection={playlistSelection}
      >
        <PlaylistChooser selection={selectedPlaylist} onChange={setSelectedPlaylist} />
      </Step>
      <Step
        step={5}
        title="Confirm and Create your Playlist!"
        collapsed={currentStep !== 5}
        goToNextStep={createPlaylist}
        nextButtonTitle="Create Playlist"
        isLastStep
      >
        {selectedTracks && (
          <Summary
            selectedPlaylist={selectedPlaylist}
            goToStep={goToStep}
            selectedTracks={selectedTracks}
          />
        )}
      </Step>
    </Section>
  );
};
