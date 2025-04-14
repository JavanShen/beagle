import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Input,
} from "@heroui/react";
import LogoutIcon from "@/assets/logout.svg?react";
import AddIcon from "@/assets/add.svg?react";
import DelIcon from "@/assets/delete.svg?react";
import useStore from "@/store";
import { jumpLogin } from "@/utils/request";
import { useEffect, useState, useRef } from "react";
import ContextMenu, { ContextMenuRef } from "@/components/ContextMenu";
import { updatePlayQuque } from "@/utils/player";

const CreatePlaylist = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const addGroup = useStore((state) => state.addGroup);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setGroupName("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Create Playlist</ModalHeader>
            <ModalBody>
              <Input
                type="text"
                placeholder="Playlist Name"
                value={groupName}
                onValueChange={setGroupName}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => onClose()}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  addGroup(groupName, []);
                  onClose();
                }}
                color="primary"
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const Menu = () => {
  const groups = useStore((state) => state.groups);
  const currentGroup = useStore((state) => state.currentGroup);
  const setCurrentGroup = useStore((state) => state.setCurrentGroup);
  const removeGroup = useStore((state) => state.removeGroup);

  const curActGroup = useRef("");
  const contextMenuRef = useRef<ContextMenuRef>(null);

  const logout = () => {
    useStore.getState().clearToken();
    jumpLogin();
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4 mx-2">
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
        <Button
          isIconOnly
          size="sm"
          radius="md"
          variant="light"
          title="create playlist"
          onPress={() => onOpen()}
        >
          <AddIcon className="opacity-70" height={30} width={30} />
        </Button>
      </div>
      <ul>
        {Object.keys(groups).map((key) => {
          return (
            <li
              key={key}
              className={`flex items-center justify-start w-full px-4 bg-opacity-70 hover:bg-white cursor-pointer ${key === currentGroup ? "bg-white" : "bg-transparent"}`}
              style={{ height: 90 }}
              onClick={() => {
                setCurrentGroup(key);
                updatePlayQuque();
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                if (key === "All Music") return;
                curActGroup.current = key;
                contextMenuRef.current?.open({
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
            >
              <Image
                isBlurred
                isZoomed
                height={70}
                width={70}
                src={
                  useStore.getState().musicMetaMap.get(groups[key]?.[0]?.sign)
                    ?.coverUrl
                }
              />
              <div className="flex flex-col ml-4">
                <span className="text-lg font-bold mb-2">{key}</span>
                <span className="text-sm opacity-70">
                  {groups[key]?.length || 0} songs
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <CreatePlaylist isOpen={isOpen} onOpenChange={onOpenChange} />
      <ContextMenu
        ref={contextMenuRef}
        content={[
          {
            id: "deleteGroup",
            children: "Delete Playlist",
            props: {
              color: "danger",
              startContent: <DelIcon />,
            },
            onClick: () => {
              removeGroup(curActGroup.current);
            },
          },
        ]}
      />
    </div>
  );
};

export default Menu;
