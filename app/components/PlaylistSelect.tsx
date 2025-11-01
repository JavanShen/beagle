import useStore from "@/store";
import ContextMenu, { ContextMenuRef, Position } from "./ContextMenu";
import { Listbox, ListboxItem } from "@heroui/react";
import { useImperativeHandle, useState, useRef } from "react";
import { useRequest } from "ahooks";
import { updatePlaylists } from "@/request/music";

export type PlaylistSelectRef = Omit<ContextMenuRef, "open"> & {
  open: (pos: Position, musicId: string) => void;
};
const PlaylistSelect = ({ ref }: { ref?: React.Ref<PlaylistSelectRef> }) => {
  const playlists = useStore((state) => state.playlists);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const curMusicId = useRef("");
  const contextMenuRef = useRef<ContextMenuRef>(null);

  const { run: update } = useRequest(
    async (playlistIds: string[]) => {
      await updatePlaylists(curMusicId.current, playlistIds);
    },
    {
      manual: true,
    },
  );

  useImperativeHandle(ref, () => ({
    open(pos, musicId) {
      curMusicId.current = musicId;

      console.log(
        "open now",
        useStore
          .getState()
          .musicList.find((item) => item.sign === musicId)
          ?.playlists.map((item) => item.id),
      );
      setSelectedKeys(
        new Set(
          useStore
            .getState()
            .musicList.find((item) => item.sign === musicId)
            ?.playlists.map((item) => String(item.id)),
        ),
      );
      contextMenuRef.current?.open(pos);
    },
    close() {
      return contextMenuRef.current?.close();
    },
  }));

  return (
    <ContextMenu ref={contextMenuRef}>
      <div className="w-40 py-2">
        <h3 className="text-medium font-bold p-2">Add to playlist</h3>
        <Listbox
          aria-label="playlists"
          variant="flat"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            const selectedPlaylists = keys as Set<string>;

            update([...selectedPlaylists]);

            setSelectedKeys(selectedPlaylists);
          }}
        >
          {playlists.map((playlist) => (
            <ListboxItem key={playlist.id}>{playlist.title}</ListboxItem>
          ))}
        </Listbox>
      </div>
    </ContextMenu>
  );
};

export default PlaylistSelect;
