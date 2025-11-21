import express from "express";
import { Sources } from "../models";
import jwt from "jsonwebtoken";
import { SourceCreationAttributes as TokenReq } from "../models/sources";

export const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

export const sourcesRouter = express.Router();

sourcesRouter.post("/addSource", async (req, res) => {
  const { id, source } = (await Sources.create(req.body)) as unknown as {
    id: number;
    source: string;
  };

  const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "3d" });
  res.success({ id, source, token }, "Source added successfully");
});

sourcesRouter.post("/removeSource", async (req, res) => {
  const { source } = req.body as TokenReq;

  await Sources.destroy({
    where: {
      source,
    },
  });

  res.success(null, "Source removed successfully");
});

sourcesRouter.get("/getSourceList", async (_req, res) => {
  const sources = await Sources.findAll({
    attributes: ["id", "username", "type"],
  });
  res.success(sources);
});
