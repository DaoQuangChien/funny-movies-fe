import { notification } from "antd";
import axios from "axios";
import { getUserData } from "../store";

const request = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_PATH,
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const userData = getUserData();

  if (userData) {
    config.headers["access-token"] = userData.accessToken;
  }
  return config;
});
request.interceptors.response.use(
  (response) => response.data,
  (err) => {
    if (!axios.isCancel(err)) {
      notification.error({
        message: "Request Error",
        description: err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong!",
        className: "general-notification",
      });
    }
    return Promise.reject(err);
  }
);

export default request;
