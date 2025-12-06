import { getMusicList } from "@/request/music";
import useStore from "@/store";
import { useRequest } from "ahooks";
import { useEffect } from "react";
import { useParams } from "react-router";

const useFetchMusicList = () => {
  const currentPlaylist = useParams()?.playlistId || "";

  const token = useStore((state) => state.token);
  const setMusicList = useStore((state) => state.setMusicList);
  const setMusicMetaMap = useStore((state) => state.setMusicMetaMap);

  const { run: fetchMusicList } = useRequest(
    async (signal: AbortSignal) => {
      const musicList = (
        await getMusicList(
          currentPlaylist === "All Music" ? "" : currentPlaylist,
          signal,
        )
      ).data;

      setMusicMetaMap(
        musicList.reduce((prev, cur) => {
          if (cur.metadata) {
            prev.set(cur.sign, cur.metadata);
          }
          return prev;
        }, new Map()),
      );
      setMusicList(musicList);
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
  }, [currentPlaylist, token]);
};

export default useFetchMusicList;
