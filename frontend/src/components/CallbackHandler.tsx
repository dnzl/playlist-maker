import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove the '#' and parse the query string
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      navigate("/"); // Redirect to the main page
    } else {
      console.error("Access token not found in URL hash");
    }
  }, [navigate]);

  return <div>Logging in...</div>;
};

export default CallbackHandler;
