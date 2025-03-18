import { useRef, memo, useEffect } from "react";
import useStore from "@/store";
import { Image, Skeleton } from "@heroui/react";
import { parseMusicMeta } from "@/utils/meta";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

type ListItemProps = {
  musicId: string;
  fileName: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};
const ListItem = memo(
  ({ musicId, fileName, style, onClick }: ListItemProps) => {
    const metadata = useStore((state) => state.musicMetaMap.get(musicId));
    const isLoaded = metadata !== undefined;
    const { title: musicName, artist } = metadata || {};

    useEffect(() => {
      parseMusicMeta(musicId, fileName);
    }, [musicId, fileName]);

    return (
      <li
        key={musicId}
        className={`flex items-center px-5 mx-4 rounded-lg ${isLoaded ? "hover:bg-gray-200/40 hover:cursor-pointer" : ""} transition-background`}
        style={{ ...style, height: 64 }}
        onClick={() => isLoaded && onClick?.()}
      >
        <Image
          isLoading={!isLoaded}
          width={50}
          height={50}
          src={metadata?.cover}
          radius="md"
          alt="cover"
        />
        <div
          className="ml-4 flex flex-col justify-between"
          style={{ height: 46 }}
        >
          {isLoaded ? (
            <>
              <div className="text-base font-semibold">{musicName}</div>
              <div className="text-sm opacity-70">{artist}</div>
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
  const setCurrentMusicId = useStore((state) => state.setCurrentMusicId);

  return (
    <div className="w-full h-full" ref={containerRef}>
      <ul className="w-full h-full" ref={wrapperRef}>
        <AutoSizer style={{ height: "100%", width: "100%" }}>
          {({ height }) => (
            <FixedSizeList
              height={height}
              itemSize={64}
              width={"100%"}
              itemCount={musicList.length}
            >
              {({ index, style }) => {
                const { name, sign } = musicList[index] || {};

                return (
                  <ListItem
                    key={sign}
                    musicId={sign}
                    fileName={name}
                    style={style}
                    onClick={() => {
                      setCurrentMusicId(sign);
                    }}
                  ></ListItem>
                );
              }}
            </FixedSizeList>
          )}
        </AutoSizer>
      </ul>
    </div>
  );
};

export default Playlist;
