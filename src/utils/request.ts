import axios, { AxiosRequestConfig } from "axios";
import { addToast } from "@heroui/react";
import useStore from "@/store";

const service = axios.create();

service.interceptors.request.use((config) => {
  const controller = new AbortController();
  config.signal = controller.signal;

  config.baseURL = config.baseURL || useStore.getState().origin;

  if (!config.baseURL && window.location.pathname !== "/login") {
    controller.abort();
    window.location.replace("/login");
  }

  const token = useStore.getState().token;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

service.interceptors.response.use(
  (res) => {
    const data = res.data;

    if (data.code && data.code !== 200) {
      addToast({
        title: "Error",
        description: data.message || "Unknown error",
        color: "danger",
      });
    }

    return data;
  },
  (err) => {
    addToast({
      title: "Error",
      description: err.data?.message || err.message || "Unknown error",
      color: "danger",
    });

    if (err.response.status === 401) {
      window.location.replace("/login");
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
