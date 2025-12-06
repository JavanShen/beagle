import { Button, Card, Chip } from "@heroui/react";
import DeleteIcon from "@/assets/delete.svg?react";
import AddIcon from "@/assets/add.svg?react";
import NiceModal from "@ebay/nice-modal-react";
import AddSource from "@/components/AddSource";
import useStore from "@/store";
import { getSources, removeSource } from "@/request/sources";
import { useRequest } from "ahooks";

const Sources = () => {
  const token = useStore((state) => state.token);

  const { data: sources = [], run: fetchSources } = useRequest(async () => {
    return (await getSources()).data;
  });

  const { run: remove } = useRequest(
    async (id: string) => {
      return await removeSource(id);
    },
    {
      manual: true,
      onSuccess: () => {
        useStore.getState().clearToken();
        fetchSources();
      },
    },
  );

  return token ? (
    <div className="flex gap-4">
      {sources?.map((source) => (
        <Card shadow="sm" className="w-72" key={source.id}>
          <div className="flex justify-between p-4 items-center">
            <span>{source.username}</span>
            <div className="flex items-center gap-4">
              <Chip color="primary" variant="flat" size="sm">
                WebDAV
              </Chip>
              <Button
                title="Remove Source"
                size="sm"
                color="danger"
                isIconOnly
                variant="flat"
              >
                <DeleteIcon
                  className="h-5 w-5"
                  onClick={() => remove(source.id)}
                />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  ) : (
    <Button
      color="primary"
      startContent={<AddIcon />}
      onPress={() => NiceModal.show(AddSource)}
    >
      Add Source
    </Button>
  );
};

export default Sources;
