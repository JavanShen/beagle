import { createClient, WebDAVClientOptions } from "webdav";

export let client = createClient("");

export const updateClient = (url: string, opt?: WebDAVClientOptions) => {
  client = createClient(url, opt);
};
