import axios from "axios";
import { Entity } from "../../gen/siren";
import apiEndpoint from "./apiEndpoint";

export default function getComitResource(resourcePath: string) {
  const uri = apiEndpoint()
    .path(resourcePath)
    .toString();
  return axios.get(uri).then(response => response.data as Entity);
}
