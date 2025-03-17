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

export default class Player extends Audio {
  constructor(source?: string) {
    super(source);
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
