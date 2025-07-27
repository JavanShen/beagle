import { request } from "@/utils/request";
import { Playlist } from "../../types/playlist";

export const getPlaylists = () =>
  request<Playlist[]>({
    method: "GET",
    url: "/api/playlist/list",
  });

export const createPlaylist = (data: Omit<Playlist, "id">) =>
  request<Playlist>({
    method: "POST",
    url: "/api/playlist/create",
    data,
  });

export const deletePlaylist = (id: string) =>
  request<void>({
    method: "DELETE",
    url: "/api/playlist/delete",
    params: { id },
  });
