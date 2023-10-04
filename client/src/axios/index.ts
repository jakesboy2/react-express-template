import axios from 'axios';

const getPublicAxios = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getPrivateAxios = () => {
  const accessToken = localStorage.getItem('accessToken');
  const baseURL = process.env.REACT_APP_BASE_URL;

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem('refreshToken');

      if (error.response.status === 401 && refreshToken) {
        const publicAxios = getPublicAxios();
        const response = await publicAxios.post('auth/refresh', {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        if (response.status !== 200) {
          return Promise.reject(error);
        }

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

        // * Retry the request -
        // * Any headers not included in the axiosInstance will not be passed on.
        return axiosInstance({
          url: originalRequest.url,
          method: originalRequest.method,
          data: originalRequest.data,
        });
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

const getSpotifyAxios = () => {
  const accessToken = localStorage.getItem('spotifyToken');
  const baseURL = process.env.REACT_APP_BASE_URL;

  if (!accessToken) {
    return;
  }

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem('spotifyRefreshToken');

      if (error.response.status === 401 && refreshToken) {
        const publicAxios = getPublicAxios();
        const response = await publicAxios.post('spotify/refresh', { refreshToken }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          return Promise.reject(error);
        }

        localStorage.setItem('spotifyToken', response.data.accessToken);

        axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

        // * Retry the request -
        // * Any headers not included in the axiosInstance will not be passed on.
        return axiosInstance({
          url: originalRequest.url,
          method: originalRequest.method,
          data: originalRequest.data,
        });
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export {
  getPrivateAxios,
  getPublicAxios,
  getSpotifyAxios,
};
