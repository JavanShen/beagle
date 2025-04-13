import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  ListboxItem,
  ListboxItemProps,
  PopoverProps,
  Listbox,
} from "@heroui/react";
import { useImperativeHandle, useState } from "react";

export type Position = {
  x: number;
  y: number;
};
type ContextMenuItem = {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  props?: Partial<ListboxItemProps>;
};
export type ContextMenuRef = {
  open: (pos: Position) => void;
  close: () => void;
};
const ContextMenu = ({
  ref,
  content = [],
  children,
  popoverProps,
}: {
  ref?: React.Ref<ContextMenuRef>;
  content?: ContextMenuItem[];
  children?: React.ReactNode;
  popoverProps?: PopoverProps;
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
    close() {
      setIsOpen(false);
    },
  }));

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-start"
      {...popoverProps}
    >
      <PopoverTrigger>
        <div
          className="fixed opacity-0 h-0 w-0"
          style={{ left: position.x + 7, top: position.y + 7 }}
        ></div>
      </PopoverTrigger>
      <PopoverContent>
        {
          <div className="px-0">
            {children || (
              <Listbox className="px-0 py-1" aria-label="context menu">
                {content.map((item) => (
                  <ListboxItem
                    key={item.id}
                    onPress={() => item.onClick?.()}
                    {...item.props}
                  >
                    {item.children}
                  </ListboxItem>
                ))}
              </Listbox>
            )}
          </div>
        }
      </PopoverContent>
    </Popover>
  );
};

export default ContextMenu;
