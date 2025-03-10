import { request } from "@/utils/request";
import useStore from "@/store";

export const getFileList = async () => {
  const res = await request({
    method: "POST",
    url: "/api/fs/list",
    data: {
      path: useStore.getState().musicPath,
    },
  });
  return res;
};
