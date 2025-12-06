import { Request, Response, NextFunction } from "express";

export default async (_req: Request, res: Response, next: NextFunction) => {
  res.success = (data, message = "操作成功") => {
    res.json({
      code: 200,
      data,
      message,
    });
  };

  res.error = (message = "请求失败", code = 500) => {
    res.status(code).send(message);
  };
  next();
};
