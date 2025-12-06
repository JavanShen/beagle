import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../routes/sources";
import { Sources } from "../models";
import { Request, Response, NextFunction } from "express";
import { SourceCreationAttributes } from "../models/sources";
import { updateClient } from "../webdav";
import crypto from "crypto";

const whiteList = [
  "/api/sources/addSource",
  /\/covers\/.*/,
  "/",
  "/settings",
  /^\/playlist\/.*/,
  /\.\w+$/,
];

const signList = [/\/api\/music\/file\/.*/];

const isInclude = (list: (string | RegExp)[], str: string) =>
  list.some((path) =>
    typeof path === "string" ? path === str : path.test(str),
  );

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      whiteList.some((path) =>
        typeof path === "string" ? path === req.path : path.test(req.path),
      )
    ) {
      next();
      return;
    }

    if (isInclude(signList, req.path)) {
      const { sign, etag } = req.query;
      const fileName = decodeURIComponent(req.path.match(/[^/]+$/)?.[0] || "");

      const computedSign = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(`${fileName}|${etag}`)
        .digest("hex");

      if (
        crypto.timingSafeEqual(
          Buffer.from(sign as string),
          Buffer.from(computedSign),
        )
      ) {
        next();
      } else {
        res.error("invalid sign", 403);
      }
      return;
    }

    // 从请求头获取token
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(403).json({ message: "未授权" });
      return;
    }

    // 验证token
    const decoded = jwt.verify(token!, SECRET_KEY) as unknown as { id: number };

    const source = (await Sources.findByPk(decoded.id, {
      raw: true,
    })) as unknown as SourceCreationAttributes;
    if (!source) {
      res.status(401).json({ message: "凭证不存在" });
      return;
    }

    const { source: url, username, password } = source;

    updateClient(url, { username, password });

    // 将凭证信息附加到请求对象
    req.source = source;
    next();
  } catch (error) {
    if ((error as { name: string }).name === "TokenExpiredError") {
      res.status(401).json({ message: "访问令牌已过期" });
      return;
    }

    res.status(401).json({ message: "无效的访问令牌" });
  }
};
