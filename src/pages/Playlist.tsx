import { getFileList, getFileInfo } from "@/request/fs";
import { useEffect } from "react";
import useStore from "@/store";
import { parseID3 } from "@/utils/meta";

const Playlist = () => {
  const { musicPath } = useStore();

  useEffect(() => {
    getFileList().then((res) => {
      if (res.code === 200) {
        res.data.content.slice(0, 9).forEach(async (item) => {
          const fileInfo = await getFileInfo(musicPath + "/" + item.name);
          const meta = await parseID3(fileInfo.data.raw_url);
          console.log(meta);
        });
      }
    });
  }, [musicPath]);

  return <div>this is a playlist</div>;
};

export default Playlist;
