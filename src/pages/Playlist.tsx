import { useRef, memo } from "react";
import useStore from "@/store";
import { useDebounceEffect, useVirtualList } from "ahooks";
import { Image, Skeleton } from "@heroui/react";
import { parseID3 } from "@/utils/meta";
import { getFileInfo } from "@/request/fs";

type ListItemProps = {
  musicId: string;
  cover?: string;
  musicName?: string;
  artist?: string;
  isLoaded?: boolean;
};
const ListItem = memo(
  ({ musicId, cover, musicName, artist, isLoaded }: ListItemProps) => {
    return (
      <li
        key={musicId}
        className="flex items-center px-5 mx-4 rounded-lg hover:bg-red-400/40 hover:text-red-600 hover:cursor-pointer transition-background"
        style={{ height: "64px" }}
      >
        <Image
          isLoading={!isLoaded}
          width={50}
          height={50}
          src={cover}
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

  const musicPath = useStore((state) => state.musicPath);
  const musicList = useStore((state) => state.musicList);
  const musicMetaMap = useStore((state) => state.musicMetaMap);
  const addMusicMeta = useStore((state) => state.addMusicMeta);

  const [virtualList] = useVirtualList(musicList, {
    itemHeight: 50,
    wrapperTarget: wrapperRef,
    containerTarget: containerRef,
  });

  useDebounceEffect(
    () => {
      for (const item of virtualList) {
        if (musicMetaMap.has(item.data.sign)) continue;

        getFileInfo(musicPath + "/" + item.data.name).then((fileInfo) => {
          parseID3(fileInfo.data.raw_url).then((id3) => {
            const coverInfo = id3?.common.picture?.[0];
            const coverUrl = coverInfo
              ? URL.createObjectURL(
                  new Blob([coverInfo.data], { type: coverInfo.type }),
                )
              : undefined;
            addMusicMeta(
              item.data.sign,
              id3
                ? {
                    ...id3,
                    cover: coverUrl,
                  }
                : null,
            );
          });
        });
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
          return (
            <ListItem
              key={data.sign}
              musicId={data.sign}
              cover={musicMeta?.cover}
              musicName={title || data.name}
              artist={artist}
              isLoaded={musicMetaMap.has(data.sign)}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Playlist;
