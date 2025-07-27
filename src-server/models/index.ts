import dotenv from "dotenv";
dotenv.config();
import { DataTypes, Sequelize } from "sequelize";
import { getSources } from "./sources";
import { getMusicMeta, getMusicInfo } from "./music";
import { getPlaylist } from "./playlist";
import databaseConfig from "../config/database";

const sequelize = new Sequelize(
  databaseConfig[process.env.NODE_ENV || "production"],
);

const Sources = getSources(sequelize);
const MusicMeta = getMusicMeta(sequelize);
const MusicInfo = getMusicInfo(sequelize);
const Playlist = getPlaylist(sequelize);

MusicInfo.hasOne(MusicMeta, {
  as: "metadata",
  foreignKey: "musicFileSign",
  onDelete: "CASCADE",
});
MusicMeta.belongsTo(MusicInfo, {
  as: "musicInfo",
  foreignKey: "musicFileSign",
});

const MusicPlaylist = sequelize.define("MusicPlaylist", {
  musicId: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: MusicInfo,
      key: "sign",
    },
  },
  playlistId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Playlist,
      key: "id",
    },
  },
});
MusicInfo.belongsToMany(Playlist, { through: MusicPlaylist });
Playlist.belongsToMany(MusicInfo, { through: MusicPlaylist });

export { sequelize, Sequelize, Sources, MusicMeta, MusicInfo, Playlist };
