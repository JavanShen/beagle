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
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import WaveIcon from "@/assets/wave.svg?react";
import AddIcon from "@/assets/add.svg?react";
import DelIcon from "@/assets/delete.svg?react";
import SettingsIcon from "@/assets/settings.svg?react";
import MusicNoteIcon from "@/assets/music-note.svg?react";
import MoreIcon from "@/assets/more.svg?react";
import CloudIcon from "@/assets/cloud.svg?react";
import useStore from "@/store";
import { useEffect, useState, useRef } from "react";
import ContextMenu, { ContextMenuRef } from "@/components/ContextMenu";
import { updatePlayQuque } from "@/utils/player";
import { useNavigate, useParams } from "react-router";
import IconWrapper from "@/components/IconWrapper";
import { MusicListItem } from "@/request/music";

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
  const navigate = useNavigate();

  const token = useStore((state) => state.token);

  const currentGroup = useParams()?.groupId;
  const setCurrentGroup = (groupId: string) => {
    navigate(`/playlist/${groupId}`);
  };
  const groups = useStore((state) => state.groups);
  const removeGroup = useStore((state) => state.removeGroup);

  const curActGroup = useRef("");
  const contextMenuRef = useRef<ContextMenuRef>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getCover = (group: MusicListItem[]) => {
    return useStore.getState().musicMetaMap.get(group?.[0]?.sign || "")
      ?.coverUrl;
  };

  return (
    <div className="w-full h-full px-4 py-2">
      <div className="flex items-center justify-end mb-8">
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            {token ? (
              <Avatar
                className="cursor-pointer"
                isBordered
                icon={<CloudIcon className="fill-white" />}
                radius="sm"
                size="sm"
                isFocusable
                color="primary"
              />
            ) : (
              <Button isIconOnly size="sm" variant="light">
                <MoreIcon />
              </Button>
            )}
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              key="settings"
              startContent={<SettingsIcon height={20} width={20} />}
              onPress={() => navigate("/settings")}
            >
              Settings
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="opacity-80 font-bold">My Playlist</span>
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
              className={
                "flex items-center justify-between w-full px-4 rounded-small hover:bg-gray-200/40 cursor-pointer"
              }
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
              <div className="flex items-center justify-start">
                {getCover(groups[key]) ? (
                  <Image height={70} width={70} src={getCover(groups[key])} />
                ) : (
                  <IconWrapper className="h-[70px] w-[70px] bg-gray-50">
                    <MusicNoteIcon className="fill-gray-500" />
                  </IconWrapper>
                )}
                <div className="flex flex-col ml-4">
                  <span
                    className={`text-lg mb-2 ${key === currentGroup ? "text-primary" : ""}`}
                  >
                    {key}
                  </span>
                  <span className="text-sm opacity-70">
                    {groups[key]?.length || 0} songs
                  </span>
                </div>
              </div>
              {key === currentGroup && <WaveIcon className="fill-primary" />}
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
