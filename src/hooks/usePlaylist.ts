import useStore from "@/store";

const usePlaylist = () => {
  const groups = useStore((state) => state.groups);
  const currentGroup = useStore((state) => state.currentGroup);

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
