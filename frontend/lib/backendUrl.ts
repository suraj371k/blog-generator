import axios from 'axios'

const backendUrl = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});

export default backendUrl;
