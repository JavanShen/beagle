import axios, { AxiosRequestConfig } from "axios";
import { addToast } from "@heroui/react";
import useStore from "@/store";

const service = axios.create();

export const showErrorMsg = (errorMsg: string) => {
  addToast({
    title: "Error",
    description: errorMsg || "Unknown error",
    color: "danger",
  });
};

service.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  config.headers.Authorization = token ? `Bearer ${token}` : "";

  return config;
});

service.interceptors.response.use(
  (res) => {
    const data = res.data;

    if (data.code && data.code !== 200 && data.code !== 401) {
      showErrorMsg(data.message);
    }

    return data;
  },
  (err) => {
    if (err.code !== "ERR_CANCELED") {
      showErrorMsg(err.data?.message || err.message);
    }

    return Promise.reject(err);
  },
);

type Result<T> = {
  code: number;
  message: string;
  data: T;
};
export const request = async <
  T = unknown,
  C extends boolean = false,
  R = C extends true ? T : Result<T>,
>(
  config: AxiosRequestConfig,
) => {
  return await service.request<R, R>(config);
};

export default service;
