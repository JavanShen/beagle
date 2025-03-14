import { Outlet } from "react-router";
import { getFileList } from "@/request/fs";
import { useEffect, useMemo } from "react";
import useStore from "@/store";
import MiniPlayer from "@/components/MiniPlayer";

const Layout = () => {
  const { musicPath, currentMusicId, setMusicList } = useStore();
  const musicMetaMap = useStore((state) => state.musicMetaMap);

  useEffect(() => {
    getFileList(musicPath).then((res) => {
      if (res.code === 200) {
        setMusicList(res.data.content);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicPath]);

  const musicInfo = useMemo(() => {
    const musicMeta = musicMetaMap.get(currentMusicId);
    const { title, artist } = musicMeta?.common || {};

    return {
      title,
      artist,
      cover: musicMeta?.cover,
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMusicId]);

  return (
    <div className="h-screen w-screen flex flex-row">
      <menu className="w-2/12 min-w-56 h-full bg-blue-200">this is a menu</menu>
      <main className="h-full flex-1">
        <Outlet />
      </main>
      <MiniPlayer
        musicName={musicInfo.title}
        artist={musicInfo.artist}
        cover={musicInfo.cover}
      />
    </div>
  );
};

export default Layout;
