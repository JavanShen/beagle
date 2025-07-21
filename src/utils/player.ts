import useStore from "@/store";
import { generateRandomArray, generateOrderedArray } from "./array";
import { parseMusicMeta } from "./meta";
import { getPlaylist } from "@/hooks/usePlaylist";
import { Howl, HowlOptions } from "howler";

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
    parseMusicMeta(nextMusic.sign || "", nextMusic.basename, nextMusic.etag);
  }
};

type PlayerOptions = HowlOptions & {
  timeUpdate?: (currentTime: number, currentTimeText: string) => void;
};
export default class Player {
  sound: Howl;
  options: HowlOptions;
  timeUpdate: PlayerOptions["timeUpdate"];
  timer?: number;

  constructor(options: PlayerOptions) {
    const { timeUpdate, ...opt } = options;
    this.options = opt;
    this.timeUpdate = timeUpdate;

    this.sound = new Howl(opt);
  }

  private _updateTime() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeUpdate?.(this.currentTime, this.currentTimeText);
    }, 1000) as unknown as number;
  }

  mute() {
    this.sound.mute(true);
    this.options.mute = true;
  }

  unmute() {
    this.sound.mute(false);
    this.options.mute = false;
  }

  setVolume(val: number) {
    const volume = Math.min(Math.max(0, val), 100) / 100;
    this.sound.volume(volume);
  }

  play() {
    this.sound.play();
    this._updateTime();
  }

  pause() {
    this.sound.pause();
    clearInterval(this.timer);
  }

  playAudio(source: string) {
    const mute = this.muted;
    const volume = this.volume;

    console.log(mute, volume);

    this.sound.unload();
    this.sound = new Howl({
      ...this.options,
      volume,
      mute,
      src: source,
    });
    this._updateTime();
  }

  reload() {
    this.sound.seek(0);
  }

  destroy() {
    this.sound.unload();
    clearInterval(this.timer);
  }

  get muted() {
    return this.options.mute;
  }

  get volume() {
    return this.sound.volume();
  }

  get duration() {
    return this.sound.duration();
  }

  get durationText() {
    return secondsToMinutes(this.duration);
  }

  get currentTime() {
    return this.sound.seek();
  }

  set currentTime(val: number) {
    this.sound.seek(val);
  }

  get currentTimeText() {
    return secondsToMinutes(this.currentTime);
  }
}
