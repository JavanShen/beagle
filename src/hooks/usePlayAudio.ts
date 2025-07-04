import { useState, useRef, useEffect, useMemo } from "react";
import Player, { secondsToMinutes } from "@/utils/player";
import useStore from "@/store";

export type UsePlayAudioReturn = ReturnType<typeof usePlayAudio>;

const usePlayAudio = (
  source?: string,
  loaded?: () => void,
  ended?: (isEnded?: boolean) => void,
) => {
  const username = useStore((state) => state.account);
  const password = useStore((state) => state.password);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeText, setCurrentTimeText] = useState("-:--");
  const [duration, setDuration] = useState(0);
  const [durationText, setDurationText] = useState("-:--");
  const volume = useStore((state) => state.volume);
  const setVolume = useStore((state) => state.setVolume);
  const player = useMemo(
    () =>
      new Player({
        src: [""],
        volume: volume ? volume / 100 : 1,
        xhr: {
          headers: {
            Authorization: "Basic " + btoa(`${username}:${password}`),
          },
        },
        onload: () => {
          setDuration(Math.floor(player.duration));
          setDurationText(player.durationText);
          setIsCanPlay(true);
          loaded?.();
        },
        timeUpdate: (curTime, curTimeText) => {
          if (!isManualUpdating.current && player) {
            setCurrentTime(Math.floor(curTime));
            setCurrentTimeText(curTimeText);
          }
        },
        onpause: () => {
          navigator.mediaSession.playbackState = "paused";
          setIsPlaying(false);
        },
        onplay: () => {
          navigator.mediaSession.playbackState = "playing";
          setIsPlaying(true);
        },
        onend: () => {
          ended?.(true);
        },
      }),
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
