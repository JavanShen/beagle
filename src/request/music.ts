import { request } from "@/utils/request";
import { FileStat } from "webdav";
import { MusicMeta } from "../../types/music";

export type MusicListItem = FileStat & { sign: string };
export const getMusicList = (signal?: AbortSignal) =>
  request<MusicListItem[]>({
    method: "GET",
    url: "/api/music/getMusicList",
    signal,
  });

export const getMusicMeta = async (
  path: string,
  sign: string,
  signal?: AbortSignal,
) =>
  request<MusicMeta>({
    method: "POST",
    url: "/api/music/getMusicMeta",
    data: { path, sign },
    signal,
  });
