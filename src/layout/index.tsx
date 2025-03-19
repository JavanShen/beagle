import { Outlet } from "react-router";
import { getFileList } from "@/request/fs";
import { useEffect } from "react";
import useStore from "@/store";
import Player from "./Player";
import { generateOrderedArray, generateRandomArray } from "@/utils/array";

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

  const setPlaylist = useStore((state) => state.setPlaylist);
  const musicList = useStore.getState().musicList;
  const playMode = useStore.getState().playMode;
  // 初始化待播放列表
  useEffect(() => {
    if (playMode === "single") {
      setPlaylist([]);
    } else if (playMode === "list") {
      setPlaylist(generateOrderedArray(Math.min(10, musicList.length)));
    } else if (playMode === "random") {
      setPlaylist(
        generateRandomArray(
          Math.min(10, musicList.length),
          musicList.length - 1,
        ),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicList, playMode]);

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
