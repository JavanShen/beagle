import { Card, Image, Spacer, Button, Slider, Skeleton } from "@heroui/react";
import PlayIcon from "@/assets/play_arrow.svg?react";
import PauseIcon from "@/assets/pause.svg?react";
import NextIcon from "@/assets/skip_next.svg?react";
import PrevIcon from "@/assets/skip_previous.svg?react";
import ShuffleIcon from "@/assets/shuffle.svg?react";
import LoopIcon from "@/assets/repeat.svg?react";
import VolumeIcon from "@/assets/volume.svg?react";
import MuteIcon from "@/assets/volume_mute.svg?react";
import RepeatIcon from "@/assets/repeat_one.svg?react";
import DownIcon from "@/assets/down.svg?react";
import { PlayerProps } from "@/types/player";
import { useResponsive } from "ahooks";

const FullPlayer = ({
  cover,
  title,
  artist,
  durationText,
  currentTimeText,
  volume,
  duration,
  currentTime,
  isPlaying,
  updateTime,
  jump,
  isLoop,
  isShuffle,
  isRepeat,
  setIsShuffle,
  setIsRepeat,
  setIsLoop,
  prevDisabled,
  nextDisabled,
  next,
  updateVolume,
  mute,
  unmute,
  prev,
  play: onPlay,
  pause: onPause,
  ref,
  onChangePlayer,
}: PlayerProps) => {
  console.count("Full player rerender");
  const responsive = useResponsive();
  const size = !responsive.sm
    ? "85vw"
    : !responsive.md
      ? "60vw"
      : !responsive.lg
        ? "50vw"
        : "35vw";
  const maxSize = "500px";

  return (
    <div
      ref={ref}
      className="fixed w-full h-full left-0 top-0 z-20 pointer-events-auto"
    >
      <img
        src={cover}
        style={{ transform: "scale(1.5)" }}
        className="h-full w-full absolute left-0 top-0 z-20 blur-2xl"
      />
      <Button
        className="absolute right-8 top-6 z-50"
        isIconOnly
        size="lg"
        radius="md"
        variant="light"
        onPress={() => onChangePlayer?.()}
      >
        <DownIcon className="opacity-50" height={50} width={50} />
      </Button>
      <Card
        fullWidth
        isBlurred
        radius="none"
        style={{ backgroundColor: "hsl(0deg 0% 100% / 40%)" }}
        className="w-full h-full justify-center items-center z-40"
      >
        <div
          style={{ width: size, maxWidth: maxSize }}
          className="flex flex-col items-stretch justify-between"
        >
          <div>
            {cover ? (
              <Image src={cover} isBlurred alt="cover" />
            ) : (
              <Skeleton
                style={{
                  height: size,
                  width: size,
                  maxWidth: maxSize,
                  maxHeight: maxSize,
                }}
                className="rounded-xl"
              />
            )}
          </div>
          <div className="flex items-center justify-between my-7">
            <div className="whitespace-nowrap overflow-hidden flex-1">
              <p className="text-lg font-semibold text-ellipsis overflow-hidden">
                {title}
              </p>
              <p className="text-md opacity-80 text-ellipsis overflow-hidden">
                {artist}
              </p>
            </div>
            <div className="items-center flex-1 hidden sm:flex">
              <Button
                isIconOnly
                size="sm"
                radius="md"
                variant="light"
                onPress={volume ? mute : unmute}
              >
                {volume ? (
                  <VolumeIcon height={20} width={20} />
                ) : (
                  <MuteIcon height={20} width={20} />
                )}
              </Button>
              <Spacer />
              <Slider
                aria-label="volume control"
                className="flex-1"
                size="sm"
                maxValue={100}
                minValue={0}
                step={1}
                hideThumb
                value={volume || 0}
                onChange={(val) => updateVolume(val as number)}
              />
            </div>
          </div>
          <div className="flex items-center mb-6">
            <span className="text-sm opacity-65">{currentTimeText}</span>
            <Spacer />
            <Slider
              aria-label="music-progress"
              size="sm"
              radius="md"
              hideThumb
              minValue={0}
              maxValue={duration}
              value={currentTime}
              step={1}
              onChange={(val) => updateTime(val as number)}
              onChangeEnd={(val) => jump(val as number)}
            />
            <Spacer />
            <span className="text-sm opacity-65">{durationText}</span>
          </div>
          <div className="flex justify-center items-center">
            <Button
              isIconOnly
              size="sm"
              radius="md"
              variant="light"
              onPress={() => {
                if (isRepeat) {
                  setIsRepeat(false);
                  setIsLoop(false);
                } else if (isLoop) {
                  setIsLoop(false);
                  setIsRepeat(true);
                } else {
                  setIsLoop(true);
                }
              }}
            >
              {isRepeat ? (
                <RepeatIcon height={20} width={20} />
              ) : (
                <LoopIcon opacity={isLoop ? 1 : 0.5} height={20} width={20} />
              )}
            </Button>
            <Spacer />
            <Button
              isIconOnly
              size="lg"
              radius="md"
              variant="light"
              isDisabled={prevDisabled}
              onPress={() => prev()}
            >
              <PrevIcon height={35} width={35} />
            </Button>
            <Spacer />
            <Button
              className="h-14 w-14"
              isIconOnly
              size="lg"
              radius="md"
              variant="light"
              onPress={isPlaying ? onPause : onPlay}
            >
              {isPlaying ? (
                <PauseIcon height={46} width={46} />
              ) : (
                <PlayIcon height={66} width={66} />
              )}
            </Button>
            <Spacer />
            <Button
              isIconOnly
              size="lg"
              radius="md"
              variant="light"
              isDisabled={nextDisabled}
              onPress={() => next()}
            >
              <NextIcon height={35} width={35} />
            </Button>
            <Spacer />
            <Button
              isIconOnly
              size="sm"
              radius="md"
              variant="light"
              onPress={() => setIsShuffle(!isShuffle)}
            >
              <ShuffleIcon
                opacity={isShuffle ? 1 : 0.5}
                height={20}
                width={20}
              />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FullPlayer;
