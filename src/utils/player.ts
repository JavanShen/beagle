import useStore from "@/store";
import { generateRandomArray, generateOrderedArray } from "./array";

const zeroFill = (num: number) => {
  if (num < 10 && num >= 0) return `0${num}`;
  return num.toString();
};
export const secondsToMinutes = (seconds: number) => {
  const formatTime = (num: number) => {
    return zeroFill(Math.floor(num));
  };
  return `${formatTime(seconds / 60)}:${formatTime(seconds % 60)}`;
};

export const updatePlaylist = (trigger: "next" | "prev" | "select") => {
  const { musicList, playMode, currentMusicIndex, setPlaylist, playlist } =
    useStore.getState();

  if (musicList.length > 0) {
    console.log("update playlist");

    if (playMode === "single") {
      setPlaylist([]);
    } else if (playMode === "list") {
      setPlaylist(
        generateOrderedArray(
          Math.min(10, musicList.length),
          currentMusicIndex + 1,
        ),
      );
    } else if (playMode === "random") {
      setPlaylist(
        trigger === "next"
          ? [
              ...playlist.filter((item) => item !== currentMusicIndex),
              ...generateRandomArray(
                Math.min(10, musicList.length) - playlist.length,
                musicList.length - 1,
                playlist.slice(1),
              ),
            ]
          : generateRandomArray(
              Math.min(10, musicList.length),
              musicList.length - 1,
              [currentMusicIndex],
            ),
      );
    }
  }
};

export type PlayerInitData = {
  volume?: number | null;
};

export default class Player extends Audio {
  constructor(source?: string, initData: PlayerInitData = {}) {
    super(source);
    super.preload = "auto";
    this.setVolume(initData.volume || 100);
  }

  loadedData(fn: () => void) {
    super.addEventListener("loadeddata", fn);
  }

  timeUpdate(fn: () => void) {
    super.addEventListener("timeupdate", fn);
  }

  canPlay(fn: () => void) {
    super.addEventListener("canplaythrough", fn);
  }

  bePlayed(fn: () => void) {
    super.addEventListener("play", fn);
  }

  bePaused(fn: () => void) {
    super.addEventListener("pause", fn);
  }

  onEnded(fn: () => void) {
    super.addEventListener("ended", fn);
  }

  mute() {
    super.muted = true;
  }

  unmute() {
    super.muted = false;
  }

  setVolume(val: number) {
    const volume = Math.min(Math.max(0, val), 100) / 100;
    super.volume = volume;
  }

  playAudio(source: string) {
    super.pause();
    super.src = source;
    super.load();
  }

  destroy() {
    super.pause();
    super.src = "";
    super.remove();
  }

  get durationText() {
    return secondsToMinutes(this.duration);
  }

  get currentTimeText() {
    return secondsToMinutes(this.currentTime);
  }
}
