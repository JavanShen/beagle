import { useState, useEffect } from "react";
import useStore from "@/store";

const useCover = (
  musicId: string,
  coverData?: Uint8Array<ArrayBufferLike>,
  coverType?: string,
) => {
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    useStore.getState().coverMap.get(musicId),
  );
  useEffect(() => {
    if (coverData && coverType) {
      const coverMap = useStore.getState().coverMap;
      if (coverMap.has(musicId)) {
        setCoverUrl(coverMap.get(musicId));
      } else {
        const url = URL.createObjectURL(
          new Blob([coverData], { type: coverType }),
        );

        useStore.getState().addCover(musicId, url);
        setCoverUrl(url);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverData]);

  return { coverUrl };
};

export default useCover;
