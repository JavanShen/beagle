import { request } from "@/utils/request";

export type Source = {
  id: string;
  source: string;
  username?: string;
  password?: string;
  type: "dav" | "smb" | "ftp";
};

export const addSource = async (data: Omit<Source, "id">) =>
  request<{ token: string }>({
    method: "POST",
    url: "/api/sources/addSource",
    data,
  });

export const removeSource = async (source: string, signal?: AbortSignal) =>
  request({
    method: "POST",
    url: "/api/sources/removeSource",
    data: { source },
    signal,
  });

export const getSources = async () =>
  request<Source[]>({
    method: "GET",
    url: "/api/sources/getSourceList",
  });
