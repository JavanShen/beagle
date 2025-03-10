import { getFileList } from "@/request/fs";
import { useEffect } from "react";

const Playlist = () => {
  useEffect(() => {
    getFileList();
  }, []);

  return <div>this is a playlist</div>;
};

export default Playlist;
