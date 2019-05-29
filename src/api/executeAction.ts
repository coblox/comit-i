import axios, { AxiosRequestConfig } from "axios";
import URI from "urijs";
import { Action } from "../../gen/siren";
import apiEndpoint from "./apiEndpoint";

export default function executeAction(action: Action, data: any) {
  const request = actionToRequest(action, data);
  request.baseURL = apiEndpoint().toString();

  return axios.request(request);
}

function actionToRequest(action: Action, data: any): AxiosRequestConfig {
  const method = action.method || "GET";
  if (method === "GET") {
    return {
      method,
      url: new URI(action.href).query(URI.buildQuery(data)).toString()
    };
  } else {
    return {
      method,
      url: action.href,
      data
    };
  }
}
