import useStore from "@/store";
import { generateRandomArray, generateOrderedArray } from "./array";
import { parseMusicMeta } from "./meta";
import { getPlaylist } from "@/hooks/usePlaylist";

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

export const updatePlayQuque = (trigger?: "next" | "prev" | "select") => {
  const { isShuffle, isLoop, currentMusicIndex, setPlayQueue, playQueue } =
    useStore.getState();
  const musicList = getPlaylist();

  if (musicList.length > 0) {
    let newPlayQueue: number[] = [];
    if (isShuffle) {
      newPlayQueue =
        trigger === "next"
          ? [
              ...playQueue.filter((item) => item !== currentMusicIndex),
              ...generateRandomArray(
                Math.min(10, musicList.length) - playQueue.length,
                musicList.length - 1,
                playQueue.slice(1),
              ),
            ]
          : generateRandomArray(
              Math.min(10, musicList.length),
              musicList.length - 1,
              [currentMusicIndex],
            );
    } else {
      newPlayQueue = generateOrderedArray(
        isLoop ? 10 : Math.min(10, musicList.length),
        currentMusicIndex + 1,
        musicList.length,
        isLoop,
      );
    }

    setPlayQueue(newPlayQueue);

    const nextMusic = musicList[newPlayQueue[0]] || {};
    parseMusicMeta(nextMusic.etag || "", nextMusic.basename);
  }
};

export type PlayerInitData = {
  volume?: number | null;
};

export default class Player extends Audio {
  controllers: AbortController[];

  constructor(source?: string, initData: PlayerInitData = {}) {
    super(source);
    super.preload = "auto";
    this.setVolume(initData.volume || 100);

    this.controllers = [];
  }

  private addControllerEventListener<K extends keyof HTMLMediaElementEventMap>(
    eventType: K,
    fn: (this: HTMLMediaElement, ev: HTMLMediaElementEventMap[K]) => unknown,
  ) {
    const controller = new AbortController();
    super.addEventListener(eventType, fn, {
      signal: controller.signal,
    });
    this.controllers.push(controller);
  }

  loadedData(fn: () => void) {
    this.addControllerEventListener("loadeddata", fn);
  }

  timeUpdate(fn: () => void) {
    this.addControllerEventListener("timeupdate", fn);
  }

  canPlay(fn: () => void) {
    this.addControllerEventListener("canplay", fn);
  }

  bePlayed(fn: () => void) {
    this.addControllerEventListener("play", fn);
  }

  bePaused(fn: () => void) {
    this.addControllerEventListener("pause", fn);
  }

  onEnded(fn: () => void) {
    this.addControllerEventListener("ended", fn);
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
    super.src = source;
    super.load();
  }

  reload() {
    super.load();
  }

  destroy() {
    this.controllers.forEach((controller) => controller.abort());
    this.controllers = [];
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
