import { useMemo } from "react";
import useStore from "@/store";
import usePlayAudio from "@/hooks/usePlayAudio";
import MiniPlayer from "@/components/MiniPlayer";

const Player = () => {
  const currentMusicId = useStore((state) => state.currentMusicId);
  const musicMetaMap = useStore.getState().musicMetaMap;

  const musicInfo = useMemo(() => {
    const musicMeta = musicMetaMap.get(currentMusicId);
    const { title, artist } = musicMeta?.common || {};

    return {
      title,
      artist,
      cover: musicMeta?.cover,
      rawUrl: musicMeta?.rawUrl,
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMusicId]);

  const { play, pause, totalTimeText, currentTimeText } = usePlayAudio(
    musicInfo.rawUrl,
  );

  return (
    <MiniPlayer
      musicName={musicInfo.title}
      artist={musicInfo.artist}
      cover={musicInfo.cover}
      duration={totalTimeText}
      progress={currentTimeText}
      onPlay={play}
      onPause={pause}
    />
  );
};

export default Player;
