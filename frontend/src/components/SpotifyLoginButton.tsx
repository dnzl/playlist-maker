import { Button, Link } from "@radix-ui/themes";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "user-read-private",
  "user-read-email",
];

const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES.join(" "))}`;

export const SpotifyLoginButton = () => {  
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("spotify_access_token");
  const handleLogout = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  }, [navigate]);
  
  return isLoggedIn ? (
    <Button variant="soft" onClick={handleLogout}>
      Logout from Spotify
    </Button>
  ) : (
    <Link href={authUrl}>Login to spotify</Link>
  )
};
