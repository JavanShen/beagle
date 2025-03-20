import { useEffect } from "react";
import useStore from "@/store";
import usePlayAudio from "@/hooks/usePlayAudio";
import MiniPlayer from "@/components/MiniPlayer";
import { parseMusicMeta } from "@/utils/meta";
import { generateRandomArray, generateOrderedArray } from "@/utils/array";

const Player = () => {
  const currentMusicId = useStore((state) => state.currentMusicId);
  const currentFileName = useStore((state) => state.currentFileName);
  const currentMusicIndex = useStore((state) => state.currentMusicIndex);
  const musicInfo = useStore((state) => state.musicMetaMap.get(currentMusicId));
  const musicMetaMap = useStore.getState().musicMetaMap;
  const musicList = useStore((state) => state.musicList);
  const history = useStore((state) => state.history);
  const playlist = useStore((state) => state.playlist);
  const playMode = useStore((state) => state.playMode);

  const setCurrentMusic = useStore((state) => state.setCurrentMusic);
  const setPlaylist = useStore((state) => state.setPlaylist);
  const setPlayMode = useStore((state) => state.setPlayMode);

  // 销毁后清理媒体通知
  useEffect(
    () => () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
      }
    },
    [],
  );

  // 获取播放音乐的信息
  useEffect(() => {
    if (!musicMetaMap.has(currentMusicId)) {
      parseMusicMeta(currentMusicId, currentFileName);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMusicId, currentFileName]);

  // 设置媒体通知 https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: musicInfo?.title,
      artist: musicInfo?.artist,
      artwork: [{ src: musicInfo?.cover || "" }],
    });
  }

  // 更新待播放列表
  useEffect(() => {
    if (musicList.length > 0) {
      console.log("update playlist");

      if (playMode === "single") {
        setPlaylist([]);
      } else if (playMode === "list") {
        console.log("list done", currentMusicIndex, musicList.length);

        setPlaylist(
          generateOrderedArray(
            Math.min(10, musicList.length),
            currentMusicIndex + 1,
          ),
        );
      } else if (playMode === "random") {
        setPlaylist(
          playlist.length > 0
            ? [
                ...playlist.filter((item) => item !== currentMusicIndex),
                ...generateRandomArray(
                  Math.min(10, musicList.length) - playlist.length,
                  musicList.length - 1,
                  playlist.slice(1),
                ),
              ]
            : generateRandomArray(
                Math.min(10, musicList.length),
                musicList.length - 1,
                [currentMusicIndex],
              ),
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicList, playMode, currentMusicIndex]);

  const next = () => {
    if (playlist.length === 0) return;

    const musicIndex = playlist[0];
    const music = musicList[musicIndex];

    setCurrentMusic(music.sign, musicIndex, music.name);
  };

  // TODO 上一首逻辑修补
  const prev = () => {
    if (history.length === 0) return;

    const musicIndex = history[history.length - 1];
    const music = musicList[musicIndex];

    setCurrentMusic(music.sign, musicIndex, music.name);
  };

  const controls = usePlayAudio(musicInfo?.rawUrl);

  const playerInfo = {
    ...controls,
    ...musicInfo,
    prevDisabled: history.length === 0,
    nextDisabled: playlist.length === 0,
    next,
    prev,
    playMode,
    setPlayMode,
  };

  return <MiniPlayer {...playerInfo} />;
};

export default Player;
