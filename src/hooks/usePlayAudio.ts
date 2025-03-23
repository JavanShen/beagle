import { useState, useRef, useEffect, useMemo } from "react";
import Player, { secondsToMinutes } from "@/utils/player";

export type UsePlayAudioReturn = ReturnType<typeof usePlayAudio>;

const usePlayAudio = (
  source?: string,
  loaded?: () => void,
  ended?: () => void,
) => {
  console.log("useaudio");
  const player = useMemo(() => new Player(), []);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeText, setCurrentTimeText] = useState("00:00");
  const [duration, setDuration] = useState(0);
  const [durationText, setDurationText] = useState("00:00");
  const [volume, setVolume] = useState<null | number>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isCanPlay, setIsCanPlay] = useState(false);
  const isManualUpdating = useRef(false);

  useEffect(() => {
    if (!source) return;

    setIsCanPlay(false);
    setIsPlaying(false);
    player.playAudio(source);
    play();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  useEffect(() => {
    player?.canPlay(() => {
      setDuration(Math.floor(player.duration || 0));
      setDurationText(player.durationText || "00:00");
      setVolume(player.muted ? null : player.volume * 100);
      setIsCanPlay(true);
      loaded?.();
    });

    player?.timeUpdate(() => {
      if (!isManualUpdating.current && player) {
        setCurrentTime(Math.floor(player.currentTime));
        setCurrentTimeText(player.currentTimeText);
      }
    });

    player?.bePaused(() => {
      setIsPlaying(false);
    });

    player?.addEventListener("ended", () => {
      ended?.();
    });

    return () => {
      player?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = () => {
    player?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    player?.pause();
    setIsPlaying(false);
  };

  const updateTime = (val: number) => {
    if (!isManualUpdating.current) isManualUpdating.current = true;
    setCurrentTime(val);
    setCurrentTimeText(secondsToMinutes(val));
  };

  const jump = (val: number) => {
    if (player) {
      player.currentTime = val;
    }
    isManualUpdating.current = false;
  };

  const updateVolume = (val: number) => {
    if (val > 0 && player?.muted) {
      player.unmute();
    }
    player?.setVolume(val);
    setVolume(val);
  };

  const mute = () => {
    player?.mute();
    setVolume(null);
  };

  const unmute = () => {
    player?.unmute();
    setVolume((player?.volume || 0) * 100);
  };

  return {
    currentTime,
    duration,
    durationText,
    play,
    pause,
    updateTime,
    jump,
    isPlaying,
    currentTimeText,
    isCanPlay,
    volume,
    updateVolume,
    mute,
    unmute,
  };
};

export default usePlayAudio;
