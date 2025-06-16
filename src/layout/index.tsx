import { Outlet } from "react-router";
import { getFileList } from "@/request/fs";
import { Listbox, ListboxItem } from "@heroui/react";
import { useEffect } from "react";
import useStore from "@/store";
import Player from "./Player";
import Menu from "./Menu";
import mime from "mime";
import MusicIcon from "@/assets/music.svg?react";
import NiceModal from "@ebay/nice-modal-react";
import AddSource from "@/components/AddSource";

const Start = ({ onAction }: { onAction?: (key: string) => void }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small">
        <Listbox
          aria-label="Actions"
          variant="flat"
          onAction={(key) => onAction?.(key as string)}
        >
          <ListboxItem
            key="connect"
            description="Add music source"
            startContent={<MusicIcon />}
          >
            Add Source
          </ListboxItem>
        </Listbox>
      </div>
    </div>
  );
};

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
        {source ? (
          <Outlet />
        ) : (
          <Start onAction={() => NiceModal.show(AddSource)} />
        )}
      </main>
      <Player />
    </div>
  );
};

export default Layout;
