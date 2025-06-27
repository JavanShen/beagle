import { useState, useRef, useEffect, useMemo } from "react";
import Player, { secondsToMinutes } from "@/utils/player";
import useStore from "@/store";

export type UsePlayAudioReturn = ReturnType<typeof usePlayAudio>;

const usePlayAudio = (
  source?: string,
  loaded?: () => void,
  ended?: (isEnded?: boolean) => void,
) => {
  console.log("current music rawurl", source);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeText, setCurrentTimeText] = useState("00:00");
  const [duration, setDuration] = useState(0);
  const [durationText, setDurationText] = useState("00:00");
  const volume = useStore((state) => state.volume);
  const setVolume = useStore((state) => state.setVolume);
  const player = useMemo(
    () => new Player(undefined, { volume }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isCanPlay, setIsCanPlay] = useState(false);
  const isManualUpdating = useRef(false);
  const isAutoPlay = useRef(false);

  useEffect(() => {
    if (!source) return;

    setIsCanPlay(false);
    player.playAudio(source);
    if (isAutoPlay.current) {
      player.play();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  useEffect(() => {
    player?.canPlay(() => {
      setDuration(Math.floor(player.duration || 0));
      setDurationText(player.durationText || "00:00");
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
      navigator.mediaSession.playbackState = "paused";
      setIsPlaying(false);
    });

    player?.bePlayed(() => {
      navigator.mediaSession.playbackState = "playing";
      setIsPlaying(true);
    });

    player?.onEnded(() => {
      ended?.(true);
    });

    return () => {
      player?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = () => {
    player?.play();
    isAutoPlay.current = true;
  };

  const pause = () => {
    player?.pause();
    isAutoPlay.current = false;
  };

  const reload = () => {
    player?.reload();
    if (isAutoPlay.current) {
      player?.play();
    }
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
    reload,
  };
};

export default usePlayAudio;
