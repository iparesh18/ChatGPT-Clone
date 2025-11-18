import axios from "axios";

export const api = axios.create({
  baseURL: "https://chatgpt-clone-eh05.onrender.com", // change to Render URL in prod
  withCredentials: true, // send cookies (token)
});
