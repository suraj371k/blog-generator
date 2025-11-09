import axios from 'axios'

const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || 'http://localhost:5000';

const backendUrl = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

export default backendUrl;
