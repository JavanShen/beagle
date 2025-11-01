import { SourceCreationAttributes } from "../models/sources";

export {};

declare global {
  namespace Express {
    interface Request {
      source: SourceCreationAttributes;
    }

    interface Response {
      success: (data: unknown, message?: string) => void;
      error: (message?: string, code?: number) => void;
    }
  }
}
