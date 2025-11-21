import { request } from "@/utils/request";
import { MusicInfo } from "../../types/music";
import { MusicMeta } from "../../types/music";

export type MusicListItem = MusicInfo;
export const getMusicList = (playlistId?: string, signal?: AbortSignal) =>
  request<MusicListItem[]>({
    method: "GET",
    url: "/api/music/getMusicList",
    params: { playlistId },
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

export const updatePlaylists = async (sign: string, playlistIds: string[]) =>
  request({
    method: "POST",
    url: "/api/music/updatePlaylists",
    data: { sign, playlistIds },
  });
