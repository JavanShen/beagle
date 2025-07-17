import { WebDAVCredentialAttributes } from "../models/webdav";

export {};

declare global {
  namespace Express {
    interface Request {
      credential: WebDAVCredentialAttributes;
    }
  }
}
