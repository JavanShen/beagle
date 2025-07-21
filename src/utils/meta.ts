import { getMusicMeta } from "@/request/music";
import useStore from "@/store";
import { isAxiosError } from "axios";

export const parseMusicMeta = async (
  sign: string,
  fileName: string,
  etag: string | null,
  signal?: AbortSignal,
) => {
  const { musicMetaMap, addMusicMeta } = useStore.getState();
  if (musicMetaMap.has(sign) || !sign) return;

  const joinUrl = `/${fileName}`;
  try {
    const res = await getMusicMeta(joinUrl, signal);

    const { title, artist, coverUrl, album, duration } = res.data || {};

    const metadata = {
      title,
      artist,
      album,
      coverUrl,
      duration,
      hasMeta: res.data ? true : false,
      rawUrl:
        location.origin +
        "/api/music/file" +
        joinUrl +
        `?sign=${sign}&etag=${etag}`,
    };

    addMusicMeta(sign, metadata);

    return metadata;
  } catch (error: unknown) {
    if (isAxiosError(error) && error?.code !== "ERR_CANCELED") {
      addMusicMeta(sign, {});
    }
  }
  return null;
};
