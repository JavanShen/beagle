import MusicList from "@/components/MusicList";
import useStore from "@/store";

const Playlist = () => {
  const musicList = useStore((state) => state.getMusicList());

  return <MusicList musicList={musicList} />;
};

export default Playlist;
