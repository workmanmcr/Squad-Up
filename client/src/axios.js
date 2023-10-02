import axios from "axios";
import { API_KEY } from './Api_key';

export const serverRequest = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});

export const rawgRequest = axios.create({
  baseURL: "https://api.rawg.io/api/",
  params: {
    key: API_KEY,
  },
});

export const makeRequest = serverRequest;

export const apiURL = {
  gamesURL: "game", 
};

export default axios; // Add this line for default export
