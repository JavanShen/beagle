import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router";

const service = axios.create({
  baseURL: localStorage.getItem("host") || undefined,
});

service.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

service.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response.status === 401) {
      // Handle unauthorized error
      localStorage.removeItem("token");
      const navigate = useNavigate();
      navigate("/login");
    }

    return Promise.reject(err);
  },
);

type Result<T> = {
  code: number;
  message: string;
  data: T;
};
export async function request<
  T = unknown,
  C extends boolean = false,
  R = C extends true ? T : Result<T>,
>(
  config: AxiosRequestConfig,
): Promise<[null, R] | [Result<null> | Record<string, never>]> {
  try {
    return [null, (await service.request<R, AxiosResponse<R>>(config)).data];
  } catch (e) {
    return [(e as AxiosError<Result<null>>).response?.data || {}];
  }
}

export default service;
