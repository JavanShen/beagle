import { Form, Input, Button, Tooltip, Tabs, Tab } from "@heroui/react";
import { login } from "@/request/user";
import useStore from "@/store";
import { useNavigate } from "react-router";
import { useRequest } from "ahooks";
import TipIcon from "@/assets/help.svg?react";
import { SourceType } from "@/types/global";

const Login = () => {
  const sourceType = useStore((state) => state.sourceType);
  const source = useStore((state) => state.source);
  const setSource = useStore((state) => state.setSource);
  const setToken = useStore((state) => state.setToken);
  const setSourceType = useStore((state) => state.setSourceType);

  const navigate = useNavigate();

  const { loading: isLoginLoading, run: onLogin } = useRequest(
    async (_type, user, pwd, otp) => {
      // 允许无账号登录
      if (user && pwd) {
        return await login(user, pwd, otp);
      } else {
        navigate("/", { replace: true });
      }
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res?.code === 200) {
          setToken(res.data.token);
          navigate("/", {
            replace: true,
          });
        }
      },
    },
  );

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    type: SourceType,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const otp = formData.get("OTP") as string;
    const sourceURL = formData.get("source") as string;

    setSource(sourceURL);
    onLogin(type, username, password, otp);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="w-2/3 lg:w-1/3 lg:max-w-screen-md">
        <Tabs
          selectedKey={sourceType}
          onSelectionChange={(key) => setSourceType(key as SourceType)}
          aria-label="Source"
          fullWidth
        >
          <Tab key={SourceType.WEBDAV} title="WebDAV">
            <Form
              className="flex flex-col items-center gap-y-10"
              onSubmit={(event) => onSubmit(event, SourceType.WEBDAV)}
            >
              <Input
                type="url"
                name="source"
                label="Source URL"
                defaultValue={source}
                required
                endContent={
                  <Tooltip content="URL pointing to the music folder in webdav, like https://example.com/webdav/music">
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
                type="submit"
                color="primary"
                fullWidth
                isLoading={isLoginLoading}
              >
                Login
              </Button>
              <Input className="opacity-0" label="Hidden" />
            </Form>
          </Tab>
          <Tab key={SourceType.ALIST} title="Alist">
            <Form
              className="flex flex-col items-center gap-y-10"
              onSubmit={(event) => onSubmit(event, SourceType.ALIST)}
            >
              <Input
                type="url"
                name="source"
                label="Source URL"
                defaultValue={source}
                required
                endContent={
                  <Tooltip content="URL pointing to the music folder in alist, like https://example.com/alist/music">
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
              <Input type="text" name="OTP" label="OTP" />
              <Button
                type="submit"
                color="primary"
                fullWidth
                isLoading={isLoginLoading}
              >
                Login
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
