import { getMusicMeta } from "@/request/music";
import useStore from "@/store";
import { isAxiosError } from "axios";
import pLimit from "p-limit";

const limit = pLimit(5);

export const getMusicUrl = (
  fileName?: string,
  sign?: string,
  etag?: string | null,
) =>
  fileName && sign
    ? `${location.origin}/api/music/file/${fileName}?sign=${sign}&etag=${etag}`
    : "";

export const parseMusicMeta = async (
  sign?: string,
  fileName?: string,
  signal?: AbortSignal,
) => {
  const { musicMetaMap, addMusicMeta } = useStore.getState();
  if (!sign || !fileName || musicMetaMap.has(sign)) return;

  const joinUrl = `/${fileName}`;
  try {
    const res = await limit(() => getMusicMeta(joinUrl, sign, signal));

    const { title, artist, coverUrl, album, duration } = res.data || {};

    const metadata = {
      title,
      artist,
      album,
      coverUrl,
      duration,
      path: joinUrl,
    };

    addMusicMeta(sign, metadata);
  } catch (error) {
    if (isAxiosError(error) && error?.code !== "ERR_CANCELED") {
      addMusicMeta(sign, null);
    }
  }
};
