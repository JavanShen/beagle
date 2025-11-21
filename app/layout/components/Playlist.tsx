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
import WaveIcon from "@/assets/wave.svg?react";
import AddIcon from "@/assets/add.svg?react";
import DelIcon from "@/assets/delete.svg?react";
import MusicNoteIcon from "@/assets/music-note.svg?react";
import useStore from "@/store";
import { useEffect, useState, useRef } from "react";
import ContextMenu, { ContextMenuRef } from "@/components/ContextMenu";
import { useNavigate, useParams } from "react-router";
import IconWrapper from "@/components/IconWrapper";
import { useRequest } from "ahooks";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylists,
} from "@/request/playlist";

const CreatePlaylist = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess?: () => void;
}) => {
  const [groupName, setGroupName] = useState("");

  const { run: create, loading } = useRequest(
    async () => {
      return await createPlaylist({ title: groupName });
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === 200) {
          onSuccess?.();
        }
      },
    },
  );

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
              <Button isLoading={loading} onPress={create} color="primary">
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const Playlist = () => {
  const navigate = useNavigate();

  const currentPlaylistId = useParams()?.playlistId;

  const playlists = useStore((state) => state.playlists);
  const setPlaylists = useStore((state) => state.setPlaylists);
  const allPlaylists = [
    {
      id: "All Music",
      title: "All Music",
      coverUrl: "",
      musicCount: useStore.getState().musicList.length,
    },
    ...playlists,
  ];

  const { run: fetchPlaylists } = useRequest(
    async () => {
      setPlaylists((await getPlaylists()).data);
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    fetchPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrentGroup = (groupId: string) => {
    navigate(`/playlist/${groupId}`);
  };

  const { run: removePlaylist } = useRequest(
    async (playlistId: string) => {
      return await deletePlaylist(playlistId);
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === 200) {
          fetchPlaylists();
        }
      },
    },
  );

  const curActGroup = useRef("");
  const contextMenuRef = useRef<ContextMenuRef>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
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
        {allPlaylists?.map((playlist) => {
          return (
            <li
              key={playlist.id}
              className={
                "flex items-center justify-between w-full px-4 rounded-small hover:bg-gray-200/40 cursor-pointer"
              }
              style={{ height: 90 }}
              onClick={() => {
                setCurrentGroup(playlist.id);
                //TODO updatePlayQueue
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                if (playlist.id === "All Music") return;
                curActGroup.current = playlist.id;
                contextMenuRef.current?.open({
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
            >
              <div className="flex items-center justify-start">
                {playlist.coverUrl ? (
                  <Image height={70} width={70} src={playlist.coverUrl} />
                ) : (
                  <IconWrapper className="h-[70px] w-[70px] bg-gray-50">
                    <MusicNoteIcon className="fill-gray-500" />
                  </IconWrapper>
                )}
                <div className="flex flex-col ml-4">
                  <span
                    className={`text-lg mb-2 ${playlist.id == currentPlaylistId ? "text-primary" : ""}`}
                  >
                    {playlist.title}
                  </span>
                  <span className="text-sm opacity-70">
                    {playlist.musicCount} songs
                  </span>
                </div>
              </div>
              {playlist.id == currentPlaylistId && (
                <WaveIcon className="fill-primary" />
              )}
            </li>
          );
        })}
      </ul>
      <CreatePlaylist
        isOpen={isOpen}
        onSuccess={() => {
          fetchPlaylists();
          onClose();
        }}
        onOpenChange={onOpenChange}
      />
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
              removePlaylist(curActGroup.current);
            },
          },
        ]}
      />
    </>
  );
};

export default Playlist;
