import { Outlet } from "react-router";
import { getFileList } from "@/request/fs";
import { useEffect } from "react";
import useStore from "@/store";
import Player from "./Player";
import Menu from "./Menu";
import mime from "mime";

const Layout = () => {
  const source = useStore((state) => state.source);
  const addGroup = useStore((state) => state.addGroup);

  // 获取全部音乐列表
  useEffect(() => {
    const controller = new AbortController();

    getFileList("/", controller.signal).then((res) => {
      console.log(res);
      if (Array.isArray(res)) {
        addGroup(
          "All Music",
          res.filter(
            (item) =>
              item.type === "file" &&
              /audio/.test(mime.getType(item.basename) || ""),
          ),
        );
      }
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

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
