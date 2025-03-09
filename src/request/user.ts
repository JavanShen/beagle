import { request } from "@/utils/request";

export const login = async (username: string, password: string) => {
  const res = await request({
    method: "POST",
    url: "/api/auth/login",
    data: { username, password },
  });
  return res;
};
