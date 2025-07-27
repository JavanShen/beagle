import { client } from "../webdav";
import express from "express";
import { parseStream } from "music-metadata";
import mime from "mime";
import fs from "fs/promises";
import path from "path";
import { MusicMeta, MusicInfo } from "../models";
import filesConfig from "../config/files";
import { FileStat } from "webdav";
import crypto from "crypto";
import { SECRET_KEY } from "./sources";
import { omit } from "lodash-es";
import { MusicInfo as MusicInfoType } from "../../types/music";

export const musicRouter = express.Router();

musicRouter.get("/getMusicList", async (_req, res) => {
  const newMusicList = ((await client.getDirectoryContents("/")) as FileStat[])
    .filter(
      (item) =>
        item.type === "file" && /audio/.test(mime.getType(item.basename) || ""),
    )
    .map((item) => ({
      ...omit(item, ["props", "type"]),
      sign: crypto
        .createHmac("sha256", SECRET_KEY)
        .update(`${item.basename}|${item.etag}`)
        .digest("hex"),
    }));

  const originMusicList = (await MusicInfo.findAll({
    raw: true,
  })) as unknown as MusicInfoType[];

  const addItems: MusicInfoType[] = [];
  const delItems: MusicInfoType[] = [];

  const newMusicListSet = new Set<string>(
    newMusicList.map((item) => item.sign),
  );
  const originMusicListSet = new Set<string>(
    originMusicList.map((item) => item.sign),
  );

  newMusicList.forEach((item) => {
    if (!originMusicListSet.has(item.sign)) {
      addItems.push(item);
    }
  });

  originMusicList.forEach((item) => {
    if (!newMusicListSet.has(item.sign)) {
      delItems.push(item);
    }
  });

  await MusicInfo.destroy({
    where: { sign: delItems.map((item) => item.sign) },
  });
  await MusicInfo.bulkCreate(addItems);

  const musicList = await MusicInfo.findAll({
    include: {
      model: MusicMeta,
      attributes: ["title", "artist", "album", "coverUrl"],
      as: "metadata",
    },
  });

  res.success(musicList);
});

musicRouter.post("/getMusicMeta", async (req, res) => {
  const { path: filePath, sign } = req.body;

  const cache = await MusicMeta.findOne({ where: { path: filePath } });

  if (cache) {
    res.success(cache);
    return;
  }

  const stream = client.createReadStream(filePath);
  const meta = await parseStream(stream);
  stream.destroy();

  req.on("close", () => {
    stream.destroy();
  });

  const { title, artist, picture, album } = meta.common;

  let fileUrl = "";

  const cover = picture?.[0];
  if (cover) {
    const { data, format } = cover;
    const fileName = title + "." + mime.getExtension(format);
    const filePath = path.join(filesConfig.coversDirPath, fileName);

    await fs.writeFile(filePath, data);
    fileUrl =
      req.protocol +
      "://" +
      req.host +
      `${filesConfig.coversRoute}/${fileName}`;
  }

  const musicMeta = await MusicMeta.create(
    {
      musicFileSign: sign,
      path: filePath,
      title,
      artist,
      coverUrl: fileUrl,
      duration: meta.format.duration,
      album,
    },
    { raw: true },
  );

  res.success(musicMeta);
});

musicRouter.use("/file", async (req, res) => {
  const filePath = decodeURIComponent(req.path);
  const parts = req.headers.range?.replace(/bytes=/, "").split("-");

  const stat = (await client.stat(filePath)) as FileStat;

  const range = parts && {
    start: parseInt(parts[0], 10),
    end: parts[1] ? parseInt(parts[0], 10) : stat.size - 1,
  };

  if (range) {
    res.writeHead(206, {
      "content-range": `bytes ${range.start}-${range.end}/${stat.size}`,
      "accept-ranges": "bytes",
      "content-length": range.end - range.start + 1,
      "content-type": stat.mime,
    });
  } else {
    res.writeHead(200, {
      "content-length": stat.size,
      "content-type": stat.mime,
    });
  }

  client
    .createReadStream(filePath, {
      range,
    })
    .pipe(res);
});
