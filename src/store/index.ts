import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FileList } from "@/request/fs";

const excludeKeys = ["musicList", "musicMetaMap", "history"];

type Metadata = {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  cover?: string;
  rawUrl?: string;
  hasMeta?: boolean;
};

type BeagleState = {
  token: string;
  setToken: (token: string) => void;

  source: string;
  origin: string;
  musicPath: string;
  setSource: (source: string) => void;

  musicMetaMap: Map<string, Metadata | null>;
  musicList: FileList["content"];
  playlist: number[];
  history: number[];
  setMusicList: (musicList: FileList["content"]) => void;
  setPlaylist: (playlist: number[]) => void;
  setHistory: (history: number[]) => void;
  addMusicMeta: (id: string, meta: Metadata | null) => void;

  currentMusicIndex: number;
  currentMusicId: string;
  currentFileName: string;
  setCurrentMusic: (id: string, index: number, fileName: string) => void;

  playMode: "list" | "random" | "single";
  setPlayMode: (mode: "list" | "random" | "single") => void;
};

const useStore = create<BeagleState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),

      // 音乐源
      source: "",
      origin: "",
      musicPath: "",
      setSource: (source) => {
        const url = new URL(source);
        set({ source, origin: url.origin, musicPath: url.pathname });
      },

      // 音乐&元数据&播放列表
      musicMetaMap: new Map(),
      musicList: [],
      playlist: [],
      history: [],
      setHistory: (history) => set({ history }),
      setMusicList: (musicList) => {
        set({ musicList });
      },
      setPlaylist: (playlist) => {
        set({ playlist });
      },
      addMusicMeta: (id, meta) =>
        set((state) => ({
          musicMetaMap: new Map(state.musicMetaMap).set(id, meta),
        })),

      // 当前播放歌曲
      currentMusicIndex: 0,
      currentMusicId: "",
      currentFileName: "",
      setCurrentMusic: (id, index, fileName) => {
        set((state) => ({
          currentMusicId: id,
          currentMusicIndex: index,
          currentFileName: fileName,
          history: [...state.history, index],
        }));
      },

      // 播放模式
      playMode: "list",
      setPlayMode: (mode) => set({ playMode: mode }),
    }),
    {
      name: "beagle-store",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !excludeKeys.includes(key)),
        ),
    },
  ),
);

export default useStore;
