import { FileStat } from "webdav";
import { Playlist } from "./playlist";

export type MusicInfo = Omit<FileStat, "type" | "props"> & {
  sign: string;
  playlists: Pick<Playlist, "id" | "title">[];
  metadata: MusicMeta | null;
};

export type MusicMeta = {
  title?: string;
  artist?: string;
  album?: string;
  coverUrl?: string;
  path: string;
  duration?: number;
};
