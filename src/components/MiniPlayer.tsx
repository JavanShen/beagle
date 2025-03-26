import { Card, Image, Spacer, Button, Slider, Skeleton } from "@heroui/react";
import { UsePlayAudioReturn } from "@/hooks/usePlayAudio";
import PlayIcon from "@/assets/play_arrow.svg?react";
import PauseIcon from "@/assets/pause.svg?react";
import NextIcon from "@/assets/skip_next.svg?react";
import PrevIcon from "@/assets/skip_previous.svg?react";
import ShuffleIcon from "@/assets/shuffle.svg?react";
import LoopIcon from "@/assets/repeat.svg?react";
import QueueIcon from "@/assets/queue_music.svg?react";
import VolumeIcon from "@/assets/volume.svg?react";
import MuteIcon from "@/assets/volume_mute.svg?react";
import RepeatIcon from "@/assets/repeat_one.svg?react";

type MiniPlayerProps = UsePlayAudioReturn & {
  cover?: string;
  title?: string;
  artist?: string;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  isLoop?: boolean;
  isShuffle?: boolean;
  isRepeat?: boolean;
  next: () => void;
  prev: () => void;
  setIsShuffle: (value: boolean) => void;
  setIsRepeat: (value: boolean) => void;
  setIsLoop: (value: boolean) => void;
};

const MiniPlayer = ({
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
}: MiniPlayerProps) => {
  console.count("mini player rerender");

  return (
    <Card
      fullWidth
      isBlurred
      style={{ height: 80 }}
      className="w-11/12 fixed bottom-4 z-50 left-1/2 -translate-x-1/2"
    >
      <div className="flex items-center px-4 h-full w-full">
        {cover ? (
          <Image src={cover} height={60} width={60} isBlurred alt="cover" />
        ) : (
          <Skeleton className="rounded-xl" style={{ height: 60, width: 60 }} />
        )}

        <div className="sm:w-2/12 sm:max-w-36 mx-4 whitespace-nowrap overflow-hidden flex-1">
          <p className="text-base font-semibold text-ellipsis overflow-hidden">
            {title}
          </p>
          <p className="text-sm opacity-80 text-ellipsis overflow-hidden">
            {artist}
          </p>
        </div>
        <Button
          isIconOnly
          size="md"
          radius="md"
          variant="light"
          isDisabled={prevDisabled}
          onPress={() => prev()}
        >
          <PrevIcon />
        </Button>
        <Button
          isIconOnly
          size="lg"
          radius="md"
          variant="light"
          onPress={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? (
            <PauseIcon height={36} width={36} />
          ) : (
            <PlayIcon height={40} width={40} />
          )}
        </Button>
        <Button
          isIconOnly
          size="md"
          radius="md"
          variant="light"
          isDisabled={nextDisabled}
          onPress={() => next()}
        >
          <NextIcon />
        </Button>
        <Spacer className="hidden sm:inline" />
        <span className="text-sm opacity-65 hidden sm:inline">
          {currentTimeText}
        </span>
        <Spacer className="hidden sm:inline" />
        <Slider
          aria-label="music-progress"
          size="sm"
          className="flex-1 hidden sm:block"
          radius="md"
          hideThumb
          minValue={0}
          maxValue={duration}
          value={currentTime}
          step={1}
          onChange={(val) => updateTime(val as number)}
          onChangeEnd={(val) => jump(val as number)}
        />
        <Spacer className="hidden sm:inline" />
        <span className="text-sm opacity-65 hidden sm:inline">
          {durationText}
        </span>
        <div className="hidden md:flex">
          <Spacer />
          <Button
            isIconOnly
            size="sm"
            radius="md"
            variant="light"
            onPress={() => setIsShuffle(!isShuffle)}
          >
            <ShuffleIcon
              fill={isShuffle ? "#006FED" : undefined}
              height={20}
              width={20}
            />
          </Button>
          <Spacer />
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
              <RepeatIcon fill="#006FED" height={20} width={20} />
            ) : (
              <LoopIcon
                fill={isLoop ? "#006FED" : undefined}
                height={20}
                width={20}
              />
            )}
          </Button>
          <Spacer />
          <div className="flex items-center">
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
            <Slider
              aria-label="volume control"
              className="hidden lg:block w-20"
              size="sm"
              maxValue={101}
              minValue={0}
              step={1}
              hideThumb
              value={volume || 0}
              onChange={(val) => updateVolume(val as number)}
            />
          </div>
          <Spacer />
          <Button isIconOnly size="sm" radius="md" variant="light">
            <QueueIcon height={24} width={24} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MiniPlayer;
