import { useEffect } from "react";
import useStore from "@/store";
import usePlayAudio from "@/hooks/usePlayAudio";
import MiniPlayer from "@/components/MiniPlayer";
import { parseMusicMeta } from "@/utils/meta";
import { updatePlaylist } from "@/utils/player";

const Player = () => {
  const currentMusicId = useStore((state) => state.currentMusicId);
  const currentFileName = useStore((state) => state.currentFileName);
  const musicInfo = useStore((state) => state.musicMetaMap.get(currentMusicId));
  const musicMetaMap = useStore.getState().musicMetaMap;
  const musicList = useStore((state) => state.getMusicList());
  const history = useStore((state) => state.history);
  const playlist = useStore((state) => state.playlist);
  const isShuffle = useStore((state) => state.isShuffle);
  const isRepeat = useStore((state) => state.isRepeat);
  const isLoop = useStore((state) => state.isLoop);

  const setIsShuffle = useStore((state) => state.setIsShuffle);
  const setIsRepeat = useStore((state) => state.setIsRepeat);
  const setIsLoop = useStore((state) => state.setIsLoop);
  const setCurrentMusic = useStore((state) => state.setCurrentMusic);

  const { coverUrl, artist, title, rawUrl } = musicInfo || {};

  // 销毁后清理媒体通知
  useEffect(() => {
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("seekto", null);
      }
    };
  }, []);

  // 获取播放音乐的信息
  useEffect(() => {
    if (!musicMetaMap.has(currentMusicId)) {
      parseMusicMeta(currentMusicId, currentFileName);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMusicId, currentFileName]);

  useEffect(() => {
    updatePlaylist();
  }, [isShuffle, isLoop]);

  const next = (isEnded?: boolean) => {
    if (useStore.getState().isRepeat && isEnded) {
      return controls.reload();
    }

    const playlist = useStore.getState().playlist;

    if (playlist.length === 0) return;

    const musicIndex = playlist[0];
    const music = useStore.getState().getMusicList()[musicIndex];

    setCurrentMusic(music.sign, musicIndex, music.name);
    updatePlaylist("next");
  };

  const prev = () => {
    if (history.length === 0) return;

    const musicIndex = history[history.length - 1];
    const music = musicList[musicIndex];

    setCurrentMusic(music.sign, musicIndex, music.name);
  };

  const controls = usePlayAudio(rawUrl, undefined, next);

  // 设置媒体通知 https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      artwork: [{ src: coverUrl || "" }],
    });

    navigator.mediaSession.setActionHandler("play", () => controls.play());
    navigator.mediaSession.setActionHandler("pause", () => controls.pause());
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
    navigator.mediaSession.setActionHandler("previoustrack", prev);
    navigator.mediaSession.setActionHandler("seekto", (val) => {
      if (val.seekTime) {
        controls.jump(val.seekTime);
      }
    });
  }

  const playerInfo = {
    ...controls,
    title: title || currentFileName,
    artist,
    cover: coverUrl,
    prevDisabled: history.length === 0,
    nextDisabled: playlist.length === 0,
    next,
    prev,
    isLoop,
    isShuffle,
    isRepeat,
    setIsShuffle,
    setIsRepeat,
    setIsLoop,
  };

  return <MiniPlayer {...playerInfo} />;
};

export default Player;
