import { FileStat } from "webdav";

export type MusicInfo = Omit<FileStat, "type" | "props"> & {
  sign: string;
};

export type MusicMeta = {
  title?: string;
  artist?: string;
  album?: string;
  coverUrl?: string;
  path: string;
  duration?: number;
};
