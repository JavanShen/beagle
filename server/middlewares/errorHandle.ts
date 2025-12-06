import { NextFunction, Request, Response } from "express";

type ErrorWithStatus = Error & { status?: number };

export default (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  console.error("ErrorCatch:", err.stack);
  res.error(err.message || "Something broke!", err.status || 500);
};
