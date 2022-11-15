import axios from "axios";
import { baseUrl } from "../containts";

const httpClient = (hostName: string) => {
  return axios.create({
    baseURL: hostName,
    responseType: 'json'
  });
}

const HTTP_CLIENT = httpClient(baseUrl);
export { HTTP_CLIENT , httpClient}