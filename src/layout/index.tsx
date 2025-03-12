import { Outlet } from "react-router";
import { getFileList } from "@/request/fs";
import { useEffect } from "react";
import useStore from "@/store";

const Layout = () => {
  const { musicPath, setMusicList } = useStore();

  useEffect(() => {
    getFileList(musicPath).then((res) => {
      if (res.code === 200) {
        setMusicList(res.data.content);
        // res.data.content.slice(0, 9).forEach(async (item) => {
        //   const fileInfo = await getFileInfo(musicPath + "/" + item.name);
        //   const meta = await parseID3(fileInfo.data.raw_url);
        //   console.log(meta);
        // });
      }
    });
  }, [musicPath]);

  return (
    <div className="h-screen w-screen flex flex-row">
      <menu className="w-2/12 min-w-56 h-full bg-blue-200">this is a menu</menu>
      <main className="h-full flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
