import MyRequest from "./request";
import { configSource } from "@/config";

const request = new MyRequest({
  baseURL: configSource.appEnv === "development" ? configSource.baseUrl : configSource.baseServerUrl,
  timeout: configSource.timeout
  // withCredentials: true
});
export default request;
