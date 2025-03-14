import { Card, Image } from "@heroui/react";

type MiniPlayerProps = {
  cover?: string;
  musicName?: string;
  artist?: string;
};

const MiniPlayer = ({ cover, musicName, artist }: MiniPlayerProps) => {
  return (
    <Card
      fullWidth
      isBlurred
      style={{ height: 80 }}
      className="w-11/12 fixed bottom-4 z-50 left-1/2 -translate-x-1/2"
    >
      <div className="flex items-center px-4 h-full w-full">
        <Image src={cover} height={60} width={60} isBlurred alt="cover" />
        <div className="ml-4">
          <p className="text-base font-semibold">{musicName}</p>
          <p className="text-sm opacity-80">{artist}</p>
        </div>
      </div>
    </Card>
  );
};

export default MiniPlayer;
