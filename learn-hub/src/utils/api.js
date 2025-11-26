import axios from "axios";

const api = axios.create({
  baseURL: "https://acadev.vercel.app/api", 
});

export default api;