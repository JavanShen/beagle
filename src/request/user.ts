import { request } from "@/utils/request";

export const login = (username: string, password: string) =>
  request<{
    token: string;
  }>({
    method: "POST",
    url: "/api/auth/login",
    data: { username, password },
  });
