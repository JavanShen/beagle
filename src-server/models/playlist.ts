import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Playlist } from "../../types/playlist";

export type PlaylistAttributes = Playlist;

type PlaylistCreationAttributes = Optional<PlaylistAttributes, "id">;

export const getPlaylist = (sequelize: Sequelize) =>
  sequelize.define<Model<PlaylistAttributes, PlaylistCreationAttributes>>(
    "Playlist",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      coverUrl: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "playlist",
    },
  );
