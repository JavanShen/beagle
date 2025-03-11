import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FileList } from "@/request/fs";

const excludeKeys = ["musicList"];

type BeagleState = {
  token: string;
  setToken: (token: string) => void;

  origin: string;
  musicPath: string;
  setSource: (source: string) => void;

  musicList: FileList["content"];
  setMusicList: (musicList: FileList["content"]) => void;
};

const useStore = create<BeagleState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),

      origin: "",
      musicPath: "",
      setSource: (source) => {
        const url = new URL(source);
        set({ origin: url.origin, musicPath: url.pathname });
      },

      musicList: [],
      setMusicList: (musicList) => set({ musicList }),
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
