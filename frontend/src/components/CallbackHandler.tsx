import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetTokensMutation, storeTokens } from "../app/spotifyService";

const CallbackHandler = () => {
  const navigate = useNavigate();
  const [getTokens] = useGetTokensMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      getTokens(code)
        .unwrap()
        .then((tokens) => {
          storeTokens(tokens);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error getting tokens:", error);
          navigate("/");
        });
    } else {
      console.error("Authorization code not found in URL");
      navigate("/");
    }
  }, [navigate, getTokens]);

  return <div>Logging in...</div>;
};

export default CallbackHandler;
