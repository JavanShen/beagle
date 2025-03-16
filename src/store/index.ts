import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FileList } from "@/request/fs";
import { IAudioMetadata } from "music-metadata";

const excludeKeys = ["musicList", "musicMetaMap"];

type Metadata = Partial<IAudioMetadata> & {
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
  setMusicList: (musicList: FileList["content"]) => void;
  addMusicMeta: (id: string, meta: Metadata | null) => void;

  currentMusicId: string;
  setCurrentMusicId: (id: string) => void;
};

const useStore = create<BeagleState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),

      source: "",
      origin: "",
      musicPath: "",
      setSource: (source) => {
        const url = new URL(source);
        set({ source, origin: url.origin, musicPath: url.pathname });
      },

      musicMetaMap: new Map(),
      musicList: [],
      setMusicList: (musicList) => {
        console.log("setMusicList");
        set({ musicList });
      },
      addMusicMeta: (id, meta) =>
        set((state) => ({
          musicMetaMap: new Map(state.musicMetaMap).set(id, meta),
        })),

      currentMusicId: "",
      setCurrentMusicId: (id) => set({ currentMusicId: id }),
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
