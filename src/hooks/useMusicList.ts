import { getMusicList } from "@/request/music";
import useStore from "@/store";
import { useRequest } from "ahooks";
import { useEffect } from "react";
import { useParams } from "react-router";

const useFetchMusicList = () => {
  const currentPlaylist = useParams()?.playlistId || "";
  console.log("currentPlaylist change", currentPlaylist);
  const setMusicList = useStore((state) => state.setMusicList);

  const { run: fetchMusicList } = useRequest(
    async (signal: AbortSignal) => {
      setMusicList(
        (
          await getMusicList(
            currentPlaylist === "All Music" ? "" : currentPlaylist,
            signal,
          )
        ).data,
      );
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchMusicList(controller.signal);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlaylist]);
};

export default useFetchMusicList;
