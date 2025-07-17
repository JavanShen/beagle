import { client } from "../webdav";
import express from "express";
import { parseStream } from "music-metadata";

export const musicRouter = express.Router();

musicRouter.get("/getMusicList", async (_req, res) => {
  const musicList = await client.getDirectoryContents("/");
  res.json(musicList);
});

musicRouter.post("/getMusicMeta", async (req, res) => {
  const { filePath } = req.body;

  const stream = client.createReadStream(filePath);
  const meta = await parseStream(stream);
  stream.destroy();

  req.on("close", () => {
    stream.destroy();
  });

  const { title, artist, picture, album } = meta.common;

  res.json({
    title,
    artist,
    picture,
    album,
  });
});
