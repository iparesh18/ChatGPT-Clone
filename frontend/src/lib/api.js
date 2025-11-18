import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // change to Render URL in prod
  withCredentials: true, // send cookies (token)
});
