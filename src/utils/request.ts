import { createClient, WebDAVClient, WebDAVClientError } from "webdav";
import { addToast } from "@heroui/react";
import useStore from "@/store";
import router from "@/routes";

export const jumpLogin = () => {
  router.navigate("/login", { replace: true });
};

export const showErrorMsg = (errorMsg: string) => {
  addToast({
    title: "Error",
    description: errorMsg || "Unknown error",
    color: "danger",
  });
};

const { account: username, password, source } = useStore.getState();

let initialClient = createClient(source, {
  username,
  password,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
const withErrorHandling = <T extends (...args: any[]) => Promise<any> | any>(
  fn: T,
) => {
  return async (...args: Parameters<T>) => {
    try {
      const result = await fn(...args);

      return result;
    } catch (error) {
      const { status, message } = error as WebDAVClientError;
      if (status === 401 || status === 404 || status === 403) {
        jumpLogin();
      }

      // ignore abort errors
      if ((error as { code: number })?.code !== 20) {
        showErrorMsg(message);
      }
      return null;
    }
  };
};

const methods = [
  "getDirectoryContents",
  "customRequest",
  "exists",
  "getFileDownloadLink",
] as const;

type Client = {
  [P in (typeof methods)[number]]: P extends "getFileDownloadLink"
    ? (path: string) => Promise<string>
    : WebDAVClient[P];
};

export const getWebdavClient = () => {
  const client = {} as Client;

  methods.forEach((method) => {
    client[method] = withErrorHandling(initialClient[method]);
  });

  return client;
};

export const updateWebdavClient = (
  ...config: Parameters<typeof createClient>
) => {
  initialClient = createClient(...config);
};
