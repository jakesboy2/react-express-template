import React, { useState } from 'react';

export function useSpotifyTokens() {
  const [token, setToken] = useState<string>(localStorage.getItem('spotifyToken') || '');
  const [refreshToken, setRefreshToken] = useState<string>(localStorage.getItem('spotifyRefreshToken') || '');

  const updateToken = (newToken: string) => {
    localStorage.setItem('spotifyToken', newToken);
    setToken(newToken);
  };

  const updateRefreshToken = (newRefreshToken: string) => {
    localStorage.setItem('spotifyRefreshToken', newRefreshToken);
    setRefreshToken(newRefreshToken);
  };

  React.useEffect(() => {
    if (!window.location.hash) return;
    const urlParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const tokenParam = urlParams.get('accessToken');
    const refreshTokenParam = urlParams.get('refreshToken');
    window.location.hash = '';
    const [cleanUrl] = window.location.href.split('#');
    window.history.replaceState({}, document.title, cleanUrl);

    if (tokenParam) {
      updateToken(tokenParam);
    }

    if (refreshTokenParam) {
      updateRefreshToken(refreshTokenParam);
    }
  }, []);

  return [token, refreshToken];
}
