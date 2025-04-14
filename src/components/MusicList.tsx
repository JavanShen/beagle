import { memo, useEffect, useRef, CSSProperties } from "react";
import useStore, { FileInfo } from "@/store";
import { Image, Skeleton } from "@heroui/react";
import { secondsToMinutes, updatePlayQuque } from "@/utils/player";
import { parseMusicMeta } from "@/utils/meta";
import { FixedSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ContextMenu, { ContextMenuRef, Position } from "./ContextMenu";
import AddIcon from "@/assets/add.svg?react";
import PlaylistSelect, { PlaylistSelectRef } from "./PlaylistSelect";

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

const MusicList = ({ musicList }: { musicList: FileInfo[] }) => {
  const setCurrentMusic = useStore((state) => state.setCurrentMusic);
  const isInitializedScroll = useRef(false);
  const listRef = useRef<FixedSizeList | null>(null);

  const curActMusicId = useRef("");
  const triggerPos = useRef<Position>({ x: 0, y: 0 });
  const contextMenuRef = useRef<ContextMenuRef>(null);

  const playlistSelectRef = useRef<PlaylistSelectRef>(null);

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
                      updatePlayQuque("select");
                    }}
                    onContextMenu={(e) => {
                      curActMusicId.current = sign;

                      const pos = {
                        x: e.clientX,
                        y: e.clientY,
                      };
                      triggerPos.current = pos;
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
            props: {
              startContent: <AddIcon />,
              color: "primary",
            },
            onClick: () => {
              playlistSelectRef.current?.open(
                triggerPos.current,
                curActMusicId.current,
              );
            },
          },
        ]}
      />
      <PlaylistSelect ref={playlistSelectRef} />
    </div>
  );
};

export default MusicList;
