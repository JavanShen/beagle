import MusicList from "@/components/MusicList";
import usePlaylist from "@/hooks/usePlaylist";

const Playlist = () => {
  const { playlist } = usePlaylist();

  return <MusicList musicList={playlist} />;
};

export default Playlist;
