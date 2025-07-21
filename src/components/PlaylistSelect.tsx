import useStore from "@/store";
import ContextMenu, { ContextMenuRef, Position } from "./ContextMenu";
import { Listbox, ListboxItem } from "@heroui/react";
import { useImperativeHandle, useState, useRef } from "react";

export type PlaylistSelectRef = Omit<ContextMenuRef, "open"> & {
  open: (pos: Position, musicId: string) => void;
};
const PlaylistSelect = ({ ref }: { ref?: React.Ref<PlaylistSelectRef> }) => {
  const groups = useStore((state) => state.groups);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const addFileToGroup = useStore((state) => state.addFileToGroup);
  const removeFileFromGroup = useStore((state) => state.removeFileFromGroup);
  const curMusicId = useRef("");
  const contextMenuRef = useRef<ContextMenuRef>(null);

  useImperativeHandle(ref, () => ({
    open(pos, musicId) {
      curMusicId.current = musicId;
      const curKeys = new Set(
        Object.keys(groups)
          .filter((item) => item !== "All Music")
          .map((item) =>
            groups[item].find((i) => i.sign === musicId) ? item : null,
          )
          .filter((item) => item) as string[],
      );
      setSelectedKeys(curKeys);
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
            const selectedGroup = keys as Set<string>;
            const fileInfo = groups["All Music"].find(
              (item) => item.sign === curMusicId.current,
            );

            if (fileInfo) {
              Object.keys(groups)
                .filter((item) => item !== "All Music")
                .forEach((groupName) => {
                  const index = groups[groupName].findIndex(
                    (item) => item.sign === curMusicId.current,
                  );

                  if (selectedGroup.has(groupName) && index === -1) {
                    addFileToGroup(groupName, fileInfo);
                  } else if (index > -1 && !selectedGroup.has(groupName)) {
                    console.log("remove now");
                    removeFileFromGroup(groupName, fileInfo.sign || "");
                  }
                });
            }

            setSelectedKeys(selectedGroup);
          }}
        >
          {Object.keys(groups)
            .filter((item) => item !== "All Music")
            .map((groupName) => (
              <ListboxItem key={groupName}>{groupName}</ListboxItem>
            ))}
        </Listbox>
      </div>
    </ContextMenu>
  );
};

export default PlaylistSelect;
