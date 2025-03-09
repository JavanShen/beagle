import { Form, Input, Button } from "@heroui/react";

const Login = () => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    // TODO: Implement login logic

    console.log(username, password);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Form
        className="w-1/3 max-w-screen-md flex flex-col items-center gap-y-10"
        onSubmit={onSubmit}
      >
        <Input type="username" name="username" label="Username" isRequired />
        <Input type="password" name="password" label="Password" isRequired />
        <Button type="submit" color="primary" fullWidth>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
