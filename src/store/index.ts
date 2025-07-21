import { create } from "zustand";
import { persist } from "zustand/middleware";
import { omit } from "lodash-es";
import { MusicListItem } from "@/request/music";

const excludeKeys = ["musicList", "history", "musicMetaMap"];

export type Metadata = {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  coverUrl?: string;
  rawUrl?: string;
  hasMeta?: boolean;
};

type BeagleState = {
  reset: () => void;

  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;

  source: string;
  origin: string;
  musicPath: string;
  setSource: (source: string) => void;

  musicMetaMap: Map<string, Metadata | null>;
  playQueue: number[];
  history: number[];
  setPlayQueue: (playQueue: number[]) => void;
  setHistory: (history: number[]) => void;
  addMusicMeta: (id: string, meta: Metadata | null) => void;

  currentGroup: string;
  groups: Record<string, MusicListItem[]>;
  addGroup: (groupName: string, files: MusicListItem[]) => void;
  removeGroup: (groupName: string) => void;
  addFileToGroup: (groupName: string, file: MusicListItem) => void;
  removeFileFromGroup: (groupName: string, fileId: string) => void;
  setCurrentGroup: (groupName: string) => void;

  currentMusicIndex: number;
  currentMusicId: string;
  currentFileName: string;
  currentMusicEtag: string | null;
  setCurrentMusic: (
    id: string,
    index: number,
    fileName: string,
    etag: string | null,
  ) => void;

  isShuffle: boolean;
  isLoop: boolean;
  isRepeat: boolean;
  volume: number | null;
  setVolume: (volume: number | null) => void;
  setIsRepeat: (isRepeat: boolean) => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setIsLoop: (isLoop: boolean) => void;
};

type PureState = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [P in keyof BeagleState as BeagleState[P] extends (...args: any[]) => void
    ? never
    : P]: BeagleState[P];
};

const initialState: PureState = {
  // 账号信息
  token: "",

  // 音乐源
  source: "",
  origin: "",
  musicPath: "",

  // 音乐&元数据&播放队列
  musicMetaMap: new Map(),
  playQueue: [],
  history: [],

  // 歌单管理
  currentGroup: "All Music",
  groups: { "All Music": [] },

  // 当前播放歌曲
  currentMusicIndex: -1,
  currentMusicId: "",
  currentFileName: "",
  currentMusicEtag: null,

  // 播放信息
  isShuffle: false,
  isLoop: false,
  isRepeat: false,
  volume: 100,
};

const useStore = create<BeagleState>()(
  persist(
    (set) => ({
      ...initialState,

      reset: () => set(initialState),

      setToken: (token) => set({ token }),
      clearToken: () => set({ token: "" }),

      // 音乐源
      setSource: (source) => {
        const url = new URL(source);
        set({
          source,
          origin: url.origin,
          musicPath: decodeURIComponent(url.pathname),
        });
      },

      // 音乐&元数据&播放队列
      setHistory: (history) => set({ history }),
      setPlayQueue: (playQueue) => {
        set({ playQueue });
      },
      addMusicMeta: (id, meta) =>
        set((state) => ({
          musicMetaMap: new Map(state.musicMetaMap).set(id, meta),
        })),

      // 歌单管理
      addGroup: (groupName, files) => {
        set((state) => ({
          groups: { ...state.groups, [groupName]: files },
        }));
      },
      removeGroup: (groupName) => {
        set((state) => ({ groups: { ...omit(state.groups, groupName) } }));
      },
      removeFileFromGroup: (groupName, fileId) => {
        set((state) => {
          const files = state.groups[groupName] || [];
          return {
            groups: {
              ...state.groups,
              [groupName]: files.filter((item) => item.sign !== fileId),
            },
          };
        });
      },
      addFileToGroup: (groupName, file) => {
        set((state) => {
          const files = state.groups[groupName] || [];
          return {
            groups: { ...state.groups, [groupName]: [...files, file] },
          };
        });
      },
      setCurrentGroup: (groupName) => set({ currentGroup: groupName }),

      // 当前播放歌曲
      setCurrentMusic: (id, index, fileName, etag) => {
        set((state) => ({
          currentMusicId: id,
          currentMusicIndex: index,
          currentFileName: fileName,
          currentMusicEtag: etag,
          history: [...state.history, index],
        }));
      },

      // 播放信息
      setVolume: (volume) => set({ volume }),
      setIsRepeat: (isRepeat) => set({ isRepeat }),
      setIsShuffle: (isShuffle) => set({ isShuffle }),
      setIsLoop: (isLoop) => set({ isLoop }),
    }),
    {
      name: "beagle-store",
      version: 2,
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !excludeKeys.includes(key)),
        ),
    },
  ),
);

export default useStore;
