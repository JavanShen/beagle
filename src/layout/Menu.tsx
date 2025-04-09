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
import useStore from "@/store";
import { jumpLogin } from "@/utils/request";
import { useEffect, useState } from "react";

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
              <Button
                onPress={() => {
                  addGroup(groupName, []);
                  onClose();
                }}
              >
                Create
              </Button>
              <Button onPress={() => onClose()}>Cancel</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const Menu = () => {
  const currentMusicId = useStore((state) => state.currentMusicId);
  const totalMusicCount = useStore((state) => state.musicList.length);
  const groups = useStore((state) => state.groups);
  console.log(groups);
  const cover = useStore((state) =>
    state.musicMetaMap.get(currentMusicId),
  )?.coverUrl;

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
              className="flex items-center justify-start w-full px-4 bg-white bg-opacity-70"
              style={{ height: 90 }}
            >
              <Image isBlurred isZoomed height={70} width={70} src={cover} />
              <div className="flex flex-col ml-4">
                <span className="text-lg font-bold mb-2">{key}</span>
                <span className="text-sm opacity-70">
                  {(key === "All Music"
                    ? totalMusicCount
                    : groups[key]?.length) || 0}{" "}
                  songs
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <CreatePlaylist isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default Menu;
