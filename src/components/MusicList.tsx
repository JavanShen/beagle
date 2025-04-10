import { memo, useEffect, useRef, CSSProperties } from "react";
import useStore from "@/store";
import { Image, Skeleton } from "@heroui/react";
import { secondsToMinutes, updatePlaylist } from "@/utils/player";
import { parseMusicMeta } from "@/utils/meta";
import { FixedSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { FileList } from "@/request/fs";
import ContextMenu, { ContextMenuRef } from "./ContextMenu";

type ListItemProps = {
  musicId: string;
  fileName: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
};
const ListItem = memo(
  ({ musicId, fileName, style, onClick, onContextMenu }: ListItemProps) => {
    const metadata = useStore((state) => state.musicMetaMap.get(musicId));
    const isLoaded = metadata !== undefined;
    const {
      title: musicName,
      artist,
      album,
      duration,
      coverUrl,
    } = metadata || {};

    useEffect(() => {
      if (musicId && fileName) {
        const controller = new AbortController();
        parseMusicMeta(musicId, fileName, controller.signal);

        return () => {
          controller.abort();
        };
      }
    }, [musicId, fileName]);

    console.count("playlist item reload" + fileName);

    return (
      <div
        key={musicId}
        className={`flex items-center justify-between whitespace-nowrap px-5 rounded-lg ${isLoaded ? "hover:bg-gray-200/40 hover:cursor-pointer" : ""} transition-background`}
        style={{ ...style, height: 64 }}
        onClick={() => isLoaded && onClick?.()}
        onContextMenu={(e) => {
          if (onContextMenu) {
            e.preventDefault();
            onContextMenu(e);
          }
        }}
      >
        <div className="flex items-center w-full md:w-4/12">
          <Image
            isLoading={!isLoaded}
            width={50}
            height={50}
            src={coverUrl}
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
                  {musicName || fileName}
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
        <div className="text-sm opacity-70 text-start w-4/12 overflow-hidden text-ellipsis hidden md:block">
          <span>{album}</span>
        </div>
        <div className="text-sm opacity-70 text-end w-1/12 overflow-hidden hidden sm:block">
          <span>{duration ? secondsToMinutes(duration) : ""}</span>
        </div>
      </div>
    );
  },
);

const MusicList = ({ musicList }: { musicList: FileList["content"] }) => {
  const setCurrentMusic = useStore((state) => state.setCurrentMusic);
  const isInitializedScroll = useRef(false);
  const listRef = useRef<FixedSizeList | null>(null);
  const contextMenuRef = useRef<ContextMenuRef>(null);

  // 定位到当前播放音乐位置
  useEffect(() => {
    if (!isInitializedScroll.current && listRef.current) {
      isInitializedScroll.current = true;
      listRef.current?.scrollToItem(
        useStore.getState().currentMusicIndex,
        "center",
      );
    }
  }, [musicList.length]);

  console.count("playlist rerender");

  return (
    <div className="w-full h-full px-4">
      <AutoSizer style={{ width: "100%" }}>
        {({ height }) => (
          <FixedSizeList
            height={height}
            itemSize={64}
            width={"100%"}
            itemCount={musicList.length}
            ref={listRef}
          >
            {memo(
              ({ index, style }: { index: number; style: CSSProperties }) => {
                const { name, sign } = musicList[index] || {};

                return (
                  <ListItem
                    key={sign}
                    musicId={sign}
                    fileName={name}
                    style={style}
                    onClick={() => {
                      setCurrentMusic(sign, index, name);
                      updatePlaylist("select");
                    }}
                    onContextMenu={(e) => {
                      contextMenuRef.current?.open({
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                  ></ListItem>
                );
              },
              areEqual,
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
      <ContextMenu
        ref={contextMenuRef}
        content={[
          {
            id: "group",
            children: "Add to Playlist",
          },
        ]}
      />
    </div>
  );
};

export default MusicList;
