import { Outlet } from "react-router";
import { getMusicList } from "@/request/music";
import { Listbox, ListboxItem } from "@heroui/react";
import { useEffect } from "react";
import useStore from "@/store";
import Player from "./Player";
import Menu from "./Menu";
import AudioFileIcon from "@/assets/headphones.svg?react";
import SettingsIcon from "@/assets/settings.svg?react";
import NiceModal from "@ebay/nice-modal-react";
import AddSource from "@/components/AddSource";
import { useLocation, useNavigate } from "react-router";
import IconWrapper from "@/components/IconWrapper";

const Start = ({ onAction }: { onAction?: (key: string) => void }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full max-w-[320px] mx-4 shadow-small px-1 py-2 rounded-small">
        <Listbox
          aria-label="Actions"
          variant="flat"
          onAction={(key) => onAction?.(key as string)}
        >
          <ListboxItem
            key="connect"
            description="Add music source"
            startContent={
              <IconWrapper className="bg-blue-100">
                <AudioFileIcon className="fill-blue-600" />
              </IconWrapper>
            }
          >
            Add Source
          </ListboxItem>
          <ListboxItem
            key="settings"
            description="View Settings"
            startContent={
              <IconWrapper className="bg-green-100">
                <SettingsIcon className="fill-green-600" />
              </IconWrapper>
            }
          >
            Settings
          </ListboxItem>
        </Listbox>
      </div>
    </div>
  );
};

const Layout = () => {
  const token = useStore((state) => state.token);
  const addGroup = useStore((state) => state.addGroup);

  const location = useLocation();
  const navigate = useNavigate();

  const actions: Record<string, () => void> = {
    settings: () => navigate("/settings"),
    connect: () => NiceModal.show(AddSource),
  };

  // 获取全部音乐列表
  useEffect(() => {
    const controller = new AbortController();

    getMusicList(controller.signal).then((res) => {
      addGroup("All Music", res.data);
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="absolute h-full w-full flex flex-row">
      <menu className="w-2/12 min-w-80 h-full py-2 shadow-small  rounded-lg hidden lg:block">
        <Menu />
      </menu>
      <main className="h-full flex-1">
        {token || !/^\/(playlist)?(\/[^/]*)?$/.test(location.pathname) ? (
          <Outlet />
        ) : (
          <Start onAction={(key) => actions[key]?.()} />
        )}
      </main>
      <Player />
    </div>
  );
};

export default Layout;
