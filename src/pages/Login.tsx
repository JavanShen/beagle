import { Form, Input, Button } from "@heroui/react";
import { login } from "@/request/user";
import useStore from "@/store";
import { useNavigate } from "react-router";
import { useRequest } from "ahooks";

const Login = () => {
  const { setSource, setToken } = useStore();

  const navigate = useNavigate();

  const { loading: isLoginLoading, run: onLogin } = useRequest(login, {
    manual: true,
    onSuccess: (res) => {
      if (res?.code === 200) {
        setToken(res.data.token);
        navigate("/");
      }
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const sourceURL = formData.get("source") as string;

    setSource(sourceURL);
    onLogin(username, password);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Form
        className="w-1/3 max-w-screen-md flex flex-col items-center gap-y-10"
        onSubmit={onSubmit}
      >
        <Input type="url" name="source" label="Source URL" isRequired />
        <Input type="text" name="username" label="Username" isRequired />
        <Input type="password" name="password" label="Password" isRequired />
        <Button
          type="submit"
          color="primary"
          fullWidth
          isLoading={isLoginLoading}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
