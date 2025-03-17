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

export const parseMusicMeta = (sign: string, fileName: string) => {
  const { musicMetaMap, musicPath, origin, addMusicMeta } = useStore.getState();
  if (musicMetaMap.has(sign)) return;
  const joinUrl = encodeURI(`${origin}/p${musicPath}/${fileName}?sign=${sign}`);
  parseID3(joinUrl).then((id3) => {
    const coverInfo = id3?.common.picture?.[0];
    const coverUrl = coverInfo
      ? URL.createObjectURL(
          new Blob([coverInfo.data], { type: coverInfo.type }),
        )
      : undefined;
    addMusicMeta(sign, {
      ...id3,
      cover: coverUrl,
      hasMeta: id3 ? true : false,
      rawUrl: joinUrl,
    });
  });
};
