import express from "express";
import { Playlist, MusicInfo, sequelize } from "../models";

export const playlistRouter = express.Router();

playlistRouter.get("/list", async (_req, res) => {
  const playlists = await Playlist.findAll({
    attributes: [
      "id",
      "title",
      "description",
      "coverUrl",
      [
        sequelize.fn(
          "COUNT",
          sequelize.col("MusicInfos->MusicPlaylist.MusicInfoSign"),
        ),
        "musicCount",
      ],
    ],
    include: [
      {
        model: MusicInfo,
        as: "musicInfos",
        attributes: [],
        through: {
          attributes: [],
        },
        required: false,
      },
    ],
    group: ["Playlist.id"],
    raw: true,
  });
  res.success(playlists);
});

playlistRouter.post("/create", async (req, res) => {
  const { title, description, coverUrl } = req.body;
  const playlist = await Playlist.create({ title, description, coverUrl });
  res.success(playlist, "Playlist created successfully");
});

playlistRouter.delete("/delete", async (req, res) => {
  const { id } = req.body;
  await Playlist.destroy({ where: { id } });
  res.success({ message: "Playlist deleted successfully" });
});

playlistRouter.post("/addMusic", async (req, res) => {
  const { musicId, playlistId } = req.body;

  const musicInfo = await MusicInfo.findByPk(musicId);
  const playlist = await Playlist.findByPk(playlistId);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const musicPlaylist = await (musicInfo as any)?.addPlaylists(playlist);

  res.success(musicPlaylist);
});
