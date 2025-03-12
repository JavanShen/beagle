import { getFileSlice } from "@/request/fs";
import { parseBuffer } from "music-metadata";

export const calID3Size = (buffer: ArrayBuffer) => {
  const typedArray = new Int8Array(buffer);

  if (
    typedArray[0] === 0x49 &&
    typedArray[1] === 0x44 &&
    typedArray[2] === 0x33
  ) {
    // 计算元数据总长度 (使用ID3v2头部的4字节长度字段)
    const sizeBytes = typedArray.slice(6, 10);
    const metadataSize =
      ((sizeBytes[0] & 0x7f) << 21) |
      ((sizeBytes[1] & 0x7f) << 14) |
      ((sizeBytes[2] & 0x7f) << 7) |
      (sizeBytes[3] & 0x7f);

    return 10 + metadataSize; // 返回精确范围
  }
};

export const parseID3 = async (filePath: string) => {
  try {
    const slice = await getFileSlice(filePath, 0, 9);
    const id3HeadSize = calID3Size(slice);
    if (id3HeadSize) {
      const id3Buffer = await getFileSlice(filePath, 0, id3HeadSize);
      const id3 = await parseBuffer(new Uint8Array(id3Buffer));
      return id3;
    }
  } catch (error) {
    console.error("Error parsing ID3:", error);
  }
  return null;
};
