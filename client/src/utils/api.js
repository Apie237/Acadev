import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://acadev.vercel.app/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;