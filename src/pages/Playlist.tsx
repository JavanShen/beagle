import { memo, useEffect } from "react";
import useStore from "@/store";
import { Image, Skeleton } from "@heroui/react";
import { secondsToMinutes } from "@/utils/player";
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
    const { title: musicName, artist, album, duration } = metadata || {};

    useEffect(() => {
      if (musicId && fileName) {
        parseMusicMeta(musicId, fileName);
      }
    }, [musicId, fileName]);

    return (
      <div
        key={musicId}
        className={`flex items-center justify-between whitespace-nowrap px-5 rounded-lg ${isLoaded ? "hover:bg-gray-200/40 hover:cursor-pointer" : ""} transition-background`}
        style={{ ...style, height: 64 }}
        onClick={() => isLoaded && onClick?.()}
      >
        <div className="flex items-center w-4/12">
          <Image
            isLoading={!isLoaded}
            width={50}
            height={50}
            src={metadata?.cover}
            radius="md"
            alt="cover"
          />
          <div
            className="ml-4 flex flex-col justify-between flex-1 overflow-hidden"
            style={{ height: 46 }}
          >
            {isLoaded ? (
              <>
                <span className="text-base font-semibold text-ellipsis overflow-hidden">
                  {musicName}
                </span>
                <span className="text-sm opacity-70 text-ellipsis overflow-hidden">
                  {artist}
                </span>
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
        </div>
        <div className="text-sm opacity-70 text-start w-4/12 overflow-hidden text-ellipsis">
          <span>{album}</span>
        </div>
        <div className="text-sm opacity-70 text-end w-1/12 overflow-hidden">
          <span>{duration ? secondsToMinutes(duration) : ""}</span>
        </div>
      </div>
    );
  },
);

const Playlist = () => {
  const musicList = useStore((state) => state.musicList);
  const setCurrentMusic = useStore((state) => state.setCurrentMusic);

  return (
    <div className="w-full h-full px-4">
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
                    setCurrentMusic(sign, index, name);
                  }}
                ></ListItem>
              );
            }}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};

export default Playlist;
