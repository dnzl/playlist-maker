import { useEffect } from "react";
import { useRefreshTokenMutation, getStoredTokens, storeTokens } from "../app/spotifyService";

export const useTokenRefresh = () => {
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const { accessToken, refreshToken: storedRefreshToken, expiry } = getStoredTokens();

      if (!accessToken || !storedRefreshToken || !expiry) return;

      const expiryTime = parseInt(expiry);
      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;

      // Refresh token if it's about to expire in the next 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000) {
        try {
          const result = await refreshToken(storedRefreshToken).unwrap();
          storeTokens(result);
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    };

    // Check token every minute
    const interval = setInterval(checkAndRefreshToken, 60 * 1000);
    checkAndRefreshToken(); // Initial check

    return () => clearInterval(interval);
  }, [refreshToken]);
};
