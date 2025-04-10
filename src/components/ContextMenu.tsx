import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from "@heroui/react";
import { useImperativeHandle, useState } from "react";

type Position = {
  x: number;
  y: number;
};
type ContextMenuItem = {
  id: string;
  children: React.ReactNode;
};
export type ContextMenuRef = {
  open: (pos: Position) => void;
};
const ContextMenu = ({
  ref,
  content = [],
}: {
  ref?: React.Ref<ContextMenuRef>;
  content?: ContextMenuItem[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    open(pos: Position) {
      // 关闭上一个Context Menu
      setIsOpen(false);
      setTimeout(() => {
        setPosition(pos);
        setIsOpen(true);
      }, 0);
    },
  }));

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-start">
      <DropdownTrigger>
        <div
          className="fixed opacity-0 h-0 w-0"
          style={{ left: position.x + 10, top: position.y + 10 }}
        ></div>
      </DropdownTrigger>
      <DropdownMenu>
        {content.map((item) => (
          <DropdownItem key={item.id}>{item.children}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ContextMenu;
