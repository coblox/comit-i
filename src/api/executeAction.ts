import axios, { AxiosRequestConfig } from "axios";
import apiEndpoint from "./apiEndpoint";

export default function executeAction(request: AxiosRequestConfig) {
  request.baseURL = apiEndpoint().toString();

  return axios.request(request);
}
