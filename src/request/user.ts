import { request } from "@/utils/request";

export const login = async (username: string, password: string) => {
  const res = await request<{
    token: string;
  }>({
    method: "POST",
    url: "/api/auth/login",
    data: { username, password },
  });

  console.log("res", res);
  return res;
};
