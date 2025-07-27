import express from "express";
import { Playlist } from "../models/index";

export const playlistRouter = express.Router();

playlistRouter.get("/list", async (req, res) => {
  const playlists = await Playlist.findAll();
  res.success(playlists);
});

playlistRouter.post("/create", async (req, res) => {
  const { title } = req.body;
  const playlist = await Playlist.create({ title });
  res.success(playlist, "Playlist created successfully");
});

playlistRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Playlist.destroy({ where: { id } });
  res.success({ message: "Playlist deleted successfully" });
});
