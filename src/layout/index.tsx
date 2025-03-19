import { Outlet } from "react-router";
import { getFileList } from "@/request/fs";
import { useEffect } from "react";
import useStore from "@/store";
import Player from "./Player";

const Layout = () => {
  const musicPath = useStore((state) => state.musicPath);
  const setMusicList = useStore((state) => state.setMusicList);

  // 获取全部音乐列表
  useEffect(() => {
    getFileList(musicPath).then((res) => {
      if (res.code === 200) {
        setMusicList(res.data.content);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicPath]);

  return (
    <div className="h-screen w-screen flex flex-row">
      <menu className="w-2/12 min-w-56 h-full bg-blue-200">this is a menu</menu>
      <main className="h-full flex-1">
        <Outlet />
      </main>
      <Player />
    </div>
  );
};

export default Layout;
