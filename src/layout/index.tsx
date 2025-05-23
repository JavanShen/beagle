import { Outlet } from "react-router";
import { getFileList } from "@/request/fs";
import { useEffect } from "react";
import useStore from "@/store";
import Player from "./Player";
import Menu from "./Menu";
import mime from "mime";

const Layout = () => {
  const musicPath = useStore((state) => state.musicPath);
  const addGroup = useStore((state) => state.addGroup);

  // 获取全部音乐列表
  useEffect(() => {
    const controller = new AbortController();

    getFileList(musicPath, controller.signal).then((res) => {
      if (res.code === 200) {
        addGroup(
          "All Music",
          res.data.content.filter(
            (item) =>
              !item.is_dir && /audio/.test(mime.getType(item.name) || ""),
          ),
        );
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
