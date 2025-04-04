import { Outlet } from "react-router";
import { getFileList } from "@/request/fs";
import { useEffect } from "react";
import useStore from "@/store";
import Player from "./Player";
import Menu from "./Menu";

const Layout = () => {
  const musicPath = useStore((state) => state.musicPath);
  const setMusicList = useStore((state) => state.setMusicList);

  // 获取全部音乐列表
  useEffect(() => {
    const controller = new AbortController();

    getFileList(musicPath, controller.signal).then((res) => {
      if (res.code === 200) {
        setMusicList(res.data.content);
      }
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicPath]);

  return (
    <div className="absolute h-full w-full flex flex-row">
      <menu className="w-2/12 min-w-56 h-full py-2 bg-gray-100/50 rounded-lg hidden lg:block">
        <Menu />
      </menu>
      <main className="h-full flex-1">
        <Outlet />
      </main>
      <Player />
    </div>
  );
};

export default Layout;
