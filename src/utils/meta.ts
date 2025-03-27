import { getFileStream } from "@/request/fs";
import { parseWebStream } from "music-metadata";
import useStore from "@/store";

export const parseID3 = async (filePath: string, signal?: AbortSignal) => {
  const stream = await getFileStream(filePath, signal);
  const id3 = await parseWebStream(stream);
  stream.cancel();
  return id3;
};

export const parseMusicMeta = async (
  sign: string,
  fileName: string,
  signal?: AbortSignal,
) => {
  try {
    const { musicMetaMap, musicPath, origin, addMusicMeta } =
      useStore.getState();
    if (musicMetaMap.has(sign) || !sign) return;
    const joinUrl = encodeURI(
      `${origin}/p${musicPath}/${fileName}?sign=${sign}`,
    );

    const id3 = await parseID3(joinUrl, signal);

    const { title, artist, picture, album } = id3?.common || {};
    const coverInfo = picture?.[0];
    const coverUrl = coverInfo
      ? URL.createObjectURL(
          new Blob([coverInfo.data], { type: coverInfo.type }),
        )
      : undefined;

    const metadata = {
      title,
      artist,
      album,
      coverUrl,
      duration: id3?.format.duration,
      hasMeta: id3 ? true : false,
      rawUrl: joinUrl,
    };

    addMusicMeta(sign, metadata);

    return metadata;
  } catch (error) {
    console.log(error);
  }
  return null;
};
