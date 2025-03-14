import { useRef, memo } from "react";
import useStore from "@/store";
import { useDebounceEffect, useVirtualList } from "ahooks";
import { Image, Skeleton } from "@heroui/react";
import { parseMusicMeta } from "@/utils/meta";

type ListItemProps = {
  musicId: string;
  cover?: string;
  musicName?: string;
  artist?: string;
  isLoaded?: boolean;
  onClick?: () => void;
};
const ListItem = memo(
  ({ musicId, cover, musicName, artist, isLoaded, onClick }: ListItemProps) => {
    return (
      <li
        key={musicId}
        className={`flex items-center px-5 mx-4 rounded-lg ${isLoaded ? "hover:bg-red-400/40 hover:text-red-600 hover:cursor-pointer hover:shadow-md" : ""} transition-all`}
        style={{ height: "64px" }}
        onClick={onClick}
      >
        <Image
          isLoading={!isLoaded}
          width={50}
          height={50}
          src={cover}
          shadow="md"
          alt="cover"
        />
        <div className="ml-2">
          {isLoaded ? (
            <>
              <p className="text-base font-semibold">{musicName}</p>
              <p className="text-sm opacity-70">{artist}</p>
            </>
          ) : (
            <>
              <Skeleton
                className="rounded-lg"
                style={{ width: 150, height: 12, marginBottom: 8 }}
              />
              <Skeleton
                className="rounded-lg"
                style={{ width: 100, height: 12 }}
              />
            </>
          )}
        </div>
      </li>
    );
  },
);

const Playlist = () => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const musicList = useStore((state) => state.musicList);
  const musicMetaMap = useStore((state) => state.musicMetaMap);
  const setCurrentMusicId = useStore((state) => state.setCurrentMusicId);

  const [virtualList] = useVirtualList(musicList, {
    itemHeight: 50,
    wrapperTarget: wrapperRef,
    containerTarget: containerRef,
    overscan: 10,
  });

  useDebounceEffect(
    () => {
      for (const item of virtualList) {
        parseMusicMeta(item.data.sign, item.data.name);
      }
    },
    [virtualList],
    { wait: 500 },
  );

  return (
    <div className="w-full h-full overflow-auto" ref={containerRef}>
      <ul className="w-full h-full overflow-auto" ref={wrapperRef}>
        {virtualList.map(({ data }) => {
          const musicMeta = musicMetaMap.get(data.sign);
          const { artist, title } = musicMeta?.common || {};
          const isLoaded = musicMetaMap.has(data.sign);
          return (
            <ListItem
              key={data.sign}
              musicId={data.sign}
              cover={musicMeta?.cover}
              musicName={title || data.name}
              artist={artist}
              isLoaded={isLoaded}
              onClick={() => {
                if (isLoaded) {
                  setCurrentMusicId(data.sign);
                }
              }}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Playlist;
