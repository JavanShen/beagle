import Sources from "@/components/Sources";

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
      <p className="text-gray-500 text-sm mb-4">Manage your music sources</p>
      {children}
    </div>
  );
};

const Settings = () => {
  return (
    <div className="p-14">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <Group title="Sources">
        <Sources />
      </Group>
    </div>
  );
};

export default Settings;
