import { useState, useRef, useEffect, useMemo } from "react";
import Player, { secondsToMinutes } from "@/utils/player";

const usePlayAudio = (source?: string, loaded?: () => void) => {
  console.log("useaudio");
  const player = useMemo(() => new Player(), []);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeText, setCurrentTimeText] = useState("00:00");
  const [totalTime, setTotalTime] = useState(0);
  const [totalTimeText, setTotalTimeText] = useState("00:00");
  const [volume, setVolume] = useState<null | number>(null);

  const [isPlay, setIsPlay] = useState(false);
  const [isCanPlay, setIsCanPlay] = useState(false);
  const isManualUpdating = useRef(false);

  useEffect(() => {
    if (!source) return;

    setIsCanPlay(false);
    setIsPlay(false);
    player.playAudio(source);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  useEffect(() => {
    player?.canPlay(() => {
      setTotalTime(Math.floor(player.duration || 0));
      setTotalTimeText(player.totalTimeText || "00:00");
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
      setIsPlay(false);
    });

    return () => {
      player?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = () => {
    player?.play();
    setIsPlay(true);
  };

  const pause = () => {
    player?.pause();
    setIsPlay(false);
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
    totalTime,
    totalTimeText,
    play,
    pause,
    updateTime,
    jump,
    isPlay,
    currentTimeText,
    isCanPlay,
    volume,
    updateVolume,
    mute,
    unmute,
  };
};

export default usePlayAudio;
