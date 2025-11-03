import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MusicListItem } from "@/request/music";
import { Playlist } from "../../types/playlist";
import { MusicInfo, MusicMeta } from "../../types/music";

const excludeKeys = ["musicList", "history", "musicMetaMap"];

type BeagleState = {
  reset: () => void;

  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;

  source: string;
  origin: string;
  musicPath: string;
  setSource: (source: string) => void;

  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;

  musicMetaMap: Map<string, MusicMeta | null>;
  musicList: MusicListItem[];
  playQueue: number[];
  history: number[];
  setPlayQueue: (playQueue: number[]) => void;
  setHistory: (history: number[]) => void;
  setMusicList: (musicList: MusicListItem[]) => void;
  addMusicMeta: (sign: string, meta: MusicMeta | null) => void;
  setMusicMetaMap: (musicMetaMap: Map<string, MusicMeta | null>) => void;

  currentMusicIndex: number;
  currentMusic: MusicInfo | null;
  setCurrentMusic: (musicInfo: MusicInfo, index: number) => void;

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

  // 歌单
  playlists: [],

  // 音乐&播放队列
  musicList: [],
  playQueue: [],
  history: [],
  musicMetaMap: new Map(),

  // 当前播放歌曲
  currentMusicIndex: -1,
  currentMusic: null,

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

      setPlaylists: (playlists) => set({ playlists }),

      // 音乐源
      setSource: (source) => {
        const url = new URL(source);
        set({
          source,
          origin: url.origin,
          musicPath: decodeURIComponent(url.pathname),
        });
      },

      // 音乐&播放队列
      setHistory: (history) => set({ history }),
      setPlayQueue: (playQueue) => {
        set({ playQueue });
      },
      setMusicList: (musicList) => set({ musicList }),
      addMusicMeta: (sign, meta) =>
        set((state) => ({
          musicMetaMap: new Map(state.musicMetaMap).set(sign, meta),
        })),
      setMusicMetaMap: (musicMetaMap) => set({ musicMetaMap }),

      // 当前播放歌曲
      setCurrentMusic: (musicInfo, index) => {
        set((state) => ({
          currentMusicIndex: index,
          currentMusic: musicInfo,
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
      version: 3,
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !excludeKeys.includes(key)),
        ),
    },
  ),
);

export default useStore;
