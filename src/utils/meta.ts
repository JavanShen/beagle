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

    return `bytes=0-${10 + metadataSize}`; // 返回精确范围
  }
};
