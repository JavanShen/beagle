import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export type SourceAttributes = {
  id: number;
  source: string;
  username?: string;
  password?: string;
  type: "dav" | "smb" | "ftp";
};

export type SourceCreationAttributes = Optional<SourceAttributes, "id">;

export const getSources = (sequelize: Sequelize) =>
  sequelize.define<Model<SourceAttributes, SourceCreationAttributes>>(
    "Sources",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
      },
      username: {
        type: DataTypes.STRING,
        // unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM("dav", "smb", "ftp"),
        allowNull: false,
      },
    },
    {
      tableName: "sources",
    },
  );
