import { useMemo } from "react";
import useStore from "@/store";
import usePlayAudio from "@/hooks/usePlayAudio";
import MiniPlayer from "@/components/MiniPlayer";

const Player = () => {
  const currentMusicId = useStore((state) => state.currentMusicId);
  const musicMetaMap = useStore.getState().musicMetaMap;

  const musicInfo = useMemo(() => {
    const musicMeta = musicMetaMap.get(currentMusicId);
    const { title, artist } = musicMeta || {};

    return {
      title,
      artist,
      cover: musicMeta?.cover,
      rawUrl: musicMeta?.rawUrl,
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMusicId]);

  const controls = usePlayAudio(musicInfo.rawUrl);

  const playerInfo = {
    ...controls,
    ...musicInfo,
  };

  return <MiniPlayer {...playerInfo} />;
};

export default Player;
