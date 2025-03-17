import { memo } from "react";
import { Card, Image, Spacer, Button, Slider } from "@heroui/react";
import { UsePlayAudioReturn } from "@/hooks/usePlayAudio";
import PlayIcon from "@/assets/play_arrow.svg?react";
import PauseIcon from "@/assets/pause.svg?react";
import NextIcon from "@/assets/skip_next.svg?react";
import PrevIcon from "@/assets/skip_previous.svg?react";

type MiniPlayerProps = UsePlayAudioReturn & {
  cover?: string;
  title?: string;
  artist?: string;
};

const MiniPlayer = memo(
  ({
    cover,
    title,
    artist,
    durationText,
    currentTimeText,
    duration,
    currentTime,
    isPlaying,
    updateTime,
    jump,
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
          <Image src={cover} height={60} width={60} isBlurred alt="cover" />
          <div className="mx-4">
            <p className="text-base font-semibold">{title}</p>
            <p className="text-sm opacity-80">{artist}</p>
          </div>
          <Button isIconOnly size="md" radius="md" variant="light">
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
          <Button isIconOnly size="md" radius="md" variant="light">
            <NextIcon />
          </Button>
          <Spacer />
          <span className="text-sm">{currentTimeText}</span>
          <Spacer />
          <Slider
            aria-label="music-progress"
            size="sm"
            className="flex-1"
            minValue={0}
            maxValue={duration}
            value={currentTime}
            step={1}
            onChange={(val) => updateTime(val as number)}
            onChangeEnd={(val) => jump(val as number)}
          />
          <Spacer />
          <span className="text-sm">{durationText}</span>
        </div>
      </Card>
    );
  },
);

export default MiniPlayer;
