import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export type MusicMetaAttributes = {
  id: number;
  title?: string;
  artist?: string;
  album?: string;
  coverUrl?: string;
  path: string;
  duration?: number;
};

type MusicMetaCreationAttributes = Optional<MusicMetaAttributes, "id">;

export const getMusicMeta = (sequelize: Sequelize) =>
  sequelize.define<Model<MusicMetaAttributes, MusicMetaCreationAttributes>>(
    "MusicMeta",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
