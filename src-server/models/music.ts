import { Sequelize, DataTypes, Model } from "sequelize";
import { MusicInfo, MusicMeta } from "../../types/music";

export type MusicInfoAttributes = Omit<MusicInfo, "playlists" | "metadata">;
export const getMusicInfo = (sequelize: Sequelize) =>
  sequelize.define<Model<MusicInfoAttributes, MusicInfoAttributes>>(
    "MusicInfo",
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      basename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastmod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      etag: {
        type: DataTypes.STRING,
      },
      mime: {
        type: DataTypes.STRING,
      },
      sign: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
      tableName: "music_info",
    },
  );

export const getMusicMeta = (sequelize: Sequelize) =>
  sequelize.define<Model<MusicMeta, MusicMeta & { musicFileSign: string }>>(
    "MusicMeta",
    {
      title: {
        type: DataTypes.STRING,
      },
      artist: {
        type: DataTypes.STRING,
      },
      album: {
        type: DataTypes.STRING,
      },
      coverUrl: {
        type: DataTypes.STRING,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
      tableName: "music_meta",
    },
  );
