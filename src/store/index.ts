import { create } from "zustand";
import { persist } from "zustand/middleware";

type BeagleState = {
  token: string;
  setToken: (token: string) => void;
  source: string;
  setSource: (source: string) => void;
};

const useStore = create<BeagleState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
      source: "",
      setSource: (source) => set({ source }),
    }),
    {
      name: "beagle-store",
    },
  ),
);

export default useStore;
