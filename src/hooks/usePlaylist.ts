import useStore from "@/store";
import { useParams } from "react-router";

const usePlaylist = () => {
  const groups = useStore((state) => state.groups);
  const currentGroup = useParams()?.groupId || "";

  return {
    playlist: groups?.[currentGroup] || [],
  };
};

export const getPlaylist = () => {
  const groups = useStore.getState().groups;
  const currentGroup = useStore.getState().currentGroup;
  return groups?.[currentGroup] || [];
};

export default usePlaylist;
