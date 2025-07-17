import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../routes/sources";
import { WebDAVCredential } from "../models";
import { Request, Response, NextFunction } from "express";
import { WebDAVCredentialAttributes } from "../models/webdav";
import { updateClient } from "../webdav";

const whiteList = ["/sources/addSource"];

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (whiteList.includes(req.path)) {
      next();
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

    const credential = (await WebDAVCredential.findByPk(decoded.id, {
      raw: true,
    })) as unknown as WebDAVCredentialAttributes;
    if (!credential) {
      res.status(404).json({ message: "凭证不存在" });
      return;
    }

    const { source, username, password } = credential;

    updateClient(source, { username, password });

    // 将凭证信息附加到请求对象
    req.credential = credential;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "访问令牌已过期" });
      return;
    }

    res.status(401).json({ message: "无效的访问令牌" });
  }
};
