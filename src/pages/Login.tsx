import { Form, Input, Button, Tooltip } from "@heroui/react";
import { updateWebdavClient, getWebdavClient } from "@/utils/request";
import useStore from "@/store";
import { useNavigate } from "react-router";
import { useRequest } from "ahooks";
import TipIcon from "@/assets/help.svg?react";

const Login = () => {
  const source = useStore((state) => state.source);
  const setSource = useStore((state) => state.setSource);
  const setAccount = useStore((state) => state.setAccount);

  const navigate = useNavigate();

  const { loading: isLoginLoading, run: onLogin } = useRequest(
    async (source, username, password) => {
      // 允许无账号
      if (username && password) {
        updateWebdavClient(source, {
          username,
          password,
        });

        return {
          username,
          password,
          isValid: await getWebdavClient().exists("/"),
        };
      } else {
        navigate("/", { replace: true });
      }
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res?.isValid) {
          setAccount(res.username, res.password);
          navigate("/", {
            replace: true,
          });
        }
      },
    },
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const sourceURL = formData.get("source") as string;

    setSource(sourceURL);
    onLogin(sourceURL, username, password);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Form
        className="w-2/3 lg:w-1/3 lg:max-w-screen-md flex flex-col items-center gap-y-10"
        onSubmit={onSubmit}
      >
        <Input
          type="url"
          name="source"
          label="Source URL"
          defaultValue={source}
          endContent={
            <Tooltip content="URL pointing to the music folder in WebDAV, like https://example.com/webdav/music">
              <TipIcon
                className="opacity-60 cursor-default"
                height={24}
                width={24}
              />
            </Tooltip>
          }
        />
        <Input type="text" name="username" label="Username" />
        <Input type="password" name="password" label="Password" />
        <Button
          className="text-white"
          type="submit"
          color="primary"
          fullWidth
          isLoading={isLoginLoading}
        >
          Connect
        </Button>
      </Form>
    </div>
  );
};

export default Login;
