import axios, { AxiosRequestConfig } from "axios";
import { addToast } from "@heroui/react";
import useStore from "@/store";
import router from "@/routes";

const service = axios.create();

export const jumpLogin = () => {
  router.navigate("/login", { replace: true });
};

export const showErrorMsg = (errorMsg: string) => {
  addToast({
    title: "Error",
    description: errorMsg || "Unknown error",
    color: "danger",
  });
};

service.interceptors.request.use((config) => {
  config.baseURL = config.baseURL || useStore.getState().origin;

  if (!config.baseURL && window.location.pathname !== "/login") {
    jumpLogin();
    showErrorMsg("no source url");
  }

  const token = useStore.getState().token;
  config.headers.Authorization = token || "";

  return config;
});

service.interceptors.response.use(
  (res) => {
    const data = res.data;

    if (data.code && data.code !== 200) {
      if (data.code === 401) {
        jumpLogin();
      }
      showErrorMsg(data.message);
    }

    return data;
  },
  (err) => {
    if (err.code !== "ERR_CANCELED") {
      showErrorMsg(err.data?.message || err.message);
    }

    if (err.response?.status === 401) {
      jumpLogin();
      showErrorMsg("Unauthorized");
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
