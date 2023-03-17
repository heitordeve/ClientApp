import axios from 'axios';
const { REACT_APP_KIM_APIS } = process.env;

const api = axios.create({
  baseURL: REACT_APP_KIM_APIS
});

export default api;

