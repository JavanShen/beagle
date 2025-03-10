import { create } from "zustand";
import { persist } from "zustand/middleware";

type BeagleState = {
  token: string;
  setToken: (token: string) => void;
  origin: string;
  musicPath: string;
  setSource: (source: string) => void;
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
    }),
    {
      name: "beagle-store",
    },
  ),
);

export default useStore;
