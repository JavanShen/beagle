import { useState, useRef, useEffect } from "react";
import Player, { secondsToMinutes } from "@/utils/player";

const usePlayAudio = (source: string, loaded?: () => void) => {
  const [player, setPlayer] = useState<null | Player>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeText, setCurrentTimeText] = useState("00:00");
  const [totalTime, setTotalTime] = useState(0);
  const [totalTimeText, setTotalTimeText] = useState("00:00");
  const [volume, setVolume] = useState<null | number>(null);

  const [isPlay, setIsPlay] = useState(false);
  const [isCanPlay, setIsCanPlay] = useState(false);
  const isManualUpdating = useRef(false);

  useEffect(() => {
    setPlayer((preVal) => {
      setIsCanPlay(false);
      setIsPlay(false);
      preVal?.destroy();
      return new Player(source || "");
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(
    () => () => {
      player?.destroy();
    },
    [player],
  );

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
