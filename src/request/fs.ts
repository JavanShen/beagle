import { getWebdavClient } from "@/utils/request";

export const getFileList = (path: string, signal?: AbortSignal) =>
  getWebdavClient().getDirectoryContents(path, { signal });

export const getFileStream = async (path: string, signal?: AbortSignal) => {
  const res = await getWebdavClient().customRequest(path, {
    method: "GET",
    signal,
  });

  return res.body as unknown as ReadableStream<ArrayBuffer>;
};
