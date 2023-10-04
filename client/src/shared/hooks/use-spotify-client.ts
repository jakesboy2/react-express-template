import { useSpotifyTokens } from './use-spotify-tokens';
import { getSpotifyAxios } from '../../axios';
import { SpotifyCurrentlyPlayingSong } from '../types';

export function useSpotifyClient() {
  const [token, refreshToken] = useSpotifyTokens();
  const spotifyAxios = getSpotifyAxios();

  const fetchCurrentlyPlayingSong = async () => {
    if (!token) return null;
    const response = await spotifyAxios?.get('https://api.spotify.com/v1/me/player/currently-playing');
    return response?.data as SpotifyCurrentlyPlayingSong;
  };

  const pausePlayback = async () => {
    if (!token) return null;

    const response = await spotifyAxios?.put('https://api.spotify.com/v1/me/player/pause');
    return response?.data;
  };

  const resumePlayback = async () => {
    if (!token) return null;
    const response = await spotifyAxios?.put('https://api.spotify.com/v1/me/player/play');
    return response?.data;
  };

  const skipTrack = async () => {
    if (!token) return null;
    const response = await spotifyAxios?.post('https://api.spotify.com/v1/me/player/next');
    return response?.data;
  };

  const previousTrack = async () => {
    if (!token) return null;

    const response = await spotifyAxios?.post('https://api.spotify.com/v1/me/player/previous');
    return response?.data;
  };

  const logout = () => {
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('spotifyRefreshToken');
  };

  return {
    token,
    refreshToken,
    fetchCurrentlyPlayingSong,
    pausePlayback,
    resumePlayback,
    skipTrack,
    previousTrack,
    logout,
  };
}
