import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FileList } from "@/request/fs";
import localforage from "localforage";

const excludeKeys = ["musicList", "history", "coverMap"];

type Metadata = {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  coverData?: Uint8Array<ArrayBufferLike>;
  coverType?: string;
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
  coverMap: Map<string, string | undefined>;
  musicList: FileList["content"];
  playlist: number[];
  history: number[];
  setMusicList: (musicList: FileList["content"]) => void;
  setPlaylist: (playlist: number[]) => void;
  setHistory: (history: number[]) => void;
  addMusicMeta: (id: string, meta: Metadata | null) => void;
  addCover: (id: string, cover?: string) => void;

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
      coverMap: new Map(),
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
      addCover: (id, cover) =>
        set((state) => ({
          coverMap: new Map(state.coverMap).set(id, cover),
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
      storage: {
        setItem: async (key, value) => {
          await localforage.setItem(key, value);
        },
        getItem: async (key) => {
          console.log("get item now");
          return await localforage.getItem(key);
        },
        removeItem: async (key) => {
          await localforage.removeItem(key);
        },
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key, val]) =>
              !excludeKeys.includes(key) &&
              Object.prototype.toString.call(val) !== "[object Function]",
          ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any,
    },
  ),
);

export default useStore;
