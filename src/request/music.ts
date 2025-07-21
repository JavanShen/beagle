import { request } from "@/utils/request";
import { FileStat } from "webdav";

export type MusicListItem = FileStat & { sign: string };
export const getMusicList = (signal?: AbortSignal) =>
  request<MusicListItem[]>({
    method: "GET",
    url: "/api/music/getMusicList",
    signal,
  });

type MusicMeta = {
  id: number;
  title?: string;
  artist?: string;
  album?: string;
  coverUrl?: string;
  path: string;
  duration?: number;
};
export const getMusicMeta = async (path: string, signal?: AbortSignal) =>
  request<MusicMeta>({
    method: "POST",
    url: "/api/music/getMusicMeta",
    data: { path },
    signal,
  });
