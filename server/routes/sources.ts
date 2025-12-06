import express from "express";
import { Sources } from "../models";
import jwt from "jsonwebtoken";
import { SourceCreationAttributes as TokenReq } from "../models/sources";
import { client, updateClient } from "../webdav";

export const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

export const sourcesRouter = express.Router();

sourcesRouter.post("/addSource", async (req, res) => {
  try {
    const { source: url, username, password } = req.body;
    updateClient(url, { username, password });

    await client.exists("/");

    const { id, source } = (await Sources.create(req.body)) as unknown as {
      id: number;
      source: string;
    };

    const token = jwt.sign({ id }, SECRET_KEY);
    res.success({ id, source, token }, "Connected successfully");
    // eslint-disable-next-line
  } catch (_error) {
    res.error("connection failed", 500);
  }
});

sourcesRouter.post("/removeSource", async (req, res) => {
  const { id } = req.body as TokenReq;

  await Sources.destroy({
    where: {
      id,
    },
  });

  res.success(null, "Source removed successfully");
});

sourcesRouter.get("/getSourceList", async (_req, res) => {
  const sources = await Sources.findAll({
    attributes: ["id", "username", "type", "source"],
  });
  res.success(sources);
});
