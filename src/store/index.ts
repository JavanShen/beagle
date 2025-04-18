import { create } from "zustand";
import { persist } from "zustand/middleware";
import { omit } from "lodash-es";

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

export type FileInfo = {
  name: string;
  sign: string;
};

type BeagleState = {
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
  groups: Record<string, FileInfo[]>;
  addGroup: (groupName: string, files: FileInfo[]) => void;
  removeGroup: (groupName: string) => void;
  addFileToGroup: (groupName: string, file: FileInfo) => void;
  removeFileFromGroup: (groupName: string, fileId: string) => void;
  setCurrentGroup: (groupName: string) => void;

  currentMusicIndex: number;
  currentMusicId: string;
  currentFileName: string;
  setCurrentMusic: (id: string, index: number, fileName: string) => void;

  isShuffle: boolean;
  isLoop: boolean;
  isRepeat: boolean;
  volume: number | null;
  setVolume: (volume: number | null) => void;
  setIsRepeat: (isRepeat: boolean) => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setIsLoop: (isLoop: boolean) => void;
};

const useStore = create<BeagleState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: "" }),

      // 音乐源
      source: "",
      origin: "",
      musicPath: "",
      setSource: (source) => {
        const url = new URL(source);
        set({
          source,
          origin: url.origin,
          musicPath: decodeURIComponent(url.pathname),
        });
      },

      // 音乐&元数据&播放队列
      musicMetaMap: new Map(),
      playQueue: [],
      history: [],
      setHistory: (history) => set({ history }),
      setPlayQueue: (playQueue) => {
        set({ playQueue });
      },
      addMusicMeta: (id, meta) =>
        set((state) => ({
          musicMetaMap: new Map(state.musicMetaMap).set(id, meta),
        })),

      // 歌单管理
      currentGroup: "All Music",
      groups: { "All Music": [] },
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
          console.log(fileId);
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
      currentMusicIndex: -1,
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

      // 播放信息
      isShuffle: false,
      isLoop: false,
      isRepeat: false,
      volume: 100,
      setVolume: (volume) => set({ volume }),
      setIsRepeat: (isRepeat) => set({ isRepeat }),
      setIsShuffle: (isShuffle) => set({ isShuffle }),
      setIsLoop: (isLoop) => set({ isLoop }),
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
