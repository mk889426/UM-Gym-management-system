import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.CLIENT_ORIGIN,
  withCredentials: true,
});

export default api;