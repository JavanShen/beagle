import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export type WebDAVCredentialAttributes = {
  id: number;
  source: string;
  username: string;
  password: string;
};

type WebDAVCredentialCreationAttributes = Optional<
  WebDAVCredentialAttributes,
  "id"
>;

export const getWebDAVCredential = (sequelize: Sequelize) =>
  sequelize.define<
    Model<WebDAVCredentialAttributes, WebDAVCredentialCreationAttributes>
  >(
    "WebDAVCredential",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "webdav_credentials",
    },
  );
