import express from "express";
import { WebDAVCredential } from "../models";
import jwt from "jsonwebtoken";

export const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

export const sourcesRouter = express.Router();

type TokenReq = {
  username: string;
  password: string;
  source: string;
};
sourcesRouter.post("/addSource", async (req, res) => {
  const { username, password, source } = req.body as TokenReq;

  const { id } = (await WebDAVCredential.create({
    username,
    password,
    source,
  })) as unknown as { id: number };

  const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "3d" });
  res.json({ id, username, token });
});

sourcesRouter.post("/removeSource", async (req, res) => {
  console.log(req.body);
  const { source } = req.body as TokenReq;

  await WebDAVCredential.destroy({
    where: {
      source,
    },
  });

  res.json({ message: "Source removed successfully" });
});

sourcesRouter.get("/getSourceList", async (req, res) => {
  const sources = await WebDAVCredential.findAll();
  res.json(sources);
});
