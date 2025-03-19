import { useEffect } from "react";
import useStore from "@/store";
import usePlayAudio from "@/hooks/usePlayAudio";
import MiniPlayer from "@/components/MiniPlayer";
import { parseMusicMeta } from "@/utils/meta";

const Player = () => {
  const currentMusicId = useStore((state) => state.currentMusicId);
  const currentFileName = useStore((state) => state.currentFileName);
  const musicInfo = useStore((state) => state.musicMetaMap.get(currentMusicId));
  const musicMetaMap = useStore.getState().musicMetaMap;

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

  const controls = usePlayAudio(musicInfo?.rawUrl);

  const playerInfo = {
    ...controls,
    ...musicInfo,
  };

  return <MiniPlayer {...playerInfo} />;
};

export default Player;
