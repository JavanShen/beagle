import { Button, Card, Chip } from "@heroui/react";
import DeleteIcon from "@/assets/delete.svg?react";
import useStore from "@/store";

const Group = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="my-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm my-1">Manage your music sources</p>
      {children}
    </div>
  );
};

const Settings = () => {
  const account = useStore((state) => state.account);
  const resetState = useStore((state) => state.reset);

  return (
    <div className="p-14">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <Group title="Sources">
        {account && (
          <Card shadow="sm" className="w-96">
            <div className="flex justify-between p-4 items-center">
              <span>{account}</span>
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
                  <DeleteIcon className="h-5 w-5" onClick={resetState} />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Group>
    </div>
  );
};

export default Settings;
