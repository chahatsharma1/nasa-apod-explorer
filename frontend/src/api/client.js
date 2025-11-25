import axios from 'axios';

const api = axios.create({
  baseURL: "/api/apod"
});

export default api;
