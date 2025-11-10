import axios from "axios";

// const backendUrl = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true
// });

const backendUrl = axios.create({
  baseURL: "https://blog-generator-0ak5.onrender.com",
  withCredentials: true,
});

export default backendUrl;
