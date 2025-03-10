import { request } from "@/utils/request";

export const getFileList = async () => {
  const res = await request({
    method: "POST",
    url: "/api/fs/list",
  });
  return res;
};
