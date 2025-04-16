import { UsePlayAudioReturn } from "@/hooks/usePlayAudio";

export type PlayerProps = UsePlayAudioReturn & {
  cover?: string;
  title?: string;
  artist?: string;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  isLoop?: boolean;
  isShuffle?: boolean;
  isRepeat?: boolean;
  next: () => void;
  prev: () => void;
  setIsShuffle: (value: boolean) => void;
  setIsRepeat: (value: boolean) => void;
  setIsLoop: (value: boolean) => void;
  onChangePlayer?: () => void;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
};
