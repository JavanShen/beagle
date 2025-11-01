import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import SettingsIcon from "@/assets/settings.svg?react";
import MoreIcon from "@/assets/more.svg?react";
import CloudIcon from "@/assets/cloud.svg?react";
import useStore from "@/store";
import { useNavigate } from "react-router";
import Playlist from "./components/Playlist";

const Menu = () => {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);

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
      <Playlist />
    </div>
  );
};

export default Menu;
