import { getFileStream } from "@/request/fs";
import { parseWebStream } from "music-metadata";
import useStore from "@/store";

export const parseID3 = async (filePath: string) => {
  try {
    const stream = await getFileStream(filePath);
    const id3 = await parseWebStream(stream);
    stream.cancel();
    return id3;
  } catch (error) {
    console.error("Error parsing ID3:", error);
  }
  return null;
};

export const parseMusicMeta = async (sign: string, fileName: string) => {
  const musicMetaMap = useStore.getState().musicMetaMap;
  if (musicMetaMap.has(sign) || !sign) return;
  const musicPath = useStore.getState().musicPath;
  const origin = useStore.getState().origin;
  const addMusicMeta = useStore.getState().addMusicMeta;
  const joinUrl = encodeURI(`${origin}/p${musicPath}/${fileName}?sign=${sign}`);

  const id3 = await parseID3(joinUrl);

  const { title, artist, picture, album } = id3?.common || {};
  const coverInfo = picture?.[0];

  const metadata = {
    title,
    artist,
    album,
    coverData: coverInfo?.data,
    coverType: coverInfo?.type,
    duration: id3?.format.duration,
    hasMeta: id3 ? true : false,
    rawUrl: joinUrl,
  };

  addMusicMeta(sign, metadata);

  return metadata;
};
