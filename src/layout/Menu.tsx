import { Button, Image } from "@heroui/react";
import LogoutIcon from "@/assets/logout.svg?react";
import useStore from "@/store";
import { jumpLogin } from "@/utils/request";

const Menu = () => {
  const currentMusicId = useStore((state) => state.currentMusicId);
  const totalMusicCount = useStore((state) => state.musicList.length);
  const cover = useStore((state) =>
    state.musicMetaMap.get(currentMusicId),
  )?.coverUrl;

  const logout = () => {
    useStore.getState().clearToken();
    jumpLogin();
  };

  return (
    <div className="w-full h-full">
      <div className="text-right mb-4 mx-2">
        <Button
          isIconOnly
          size="sm"
          radius="md"
          variant="light"
          title="logout"
          onPress={logout}
        >
          <LogoutIcon className="opacity-70" height={24} width={24} />
        </Button>
      </div>
      <ul>
        <li
          className="flex items-center justify-start w-full px-4 bg-white bg-opacity-70"
          style={{ height: 90 }}
        >
          <Image isBlurred isZoomed height={70} width={70} src={cover} />
          <div className="flex flex-col ml-4">
            <span className="text-lg font-bold mb-2">All Music</span>
            <span className="text-sm opacity-70">{totalMusicCount} songs</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
