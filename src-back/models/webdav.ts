import { sequelize } from "../index";
import { DataTypes } from "sequelize";
import crypto from "crypto";

export const WebDAVCredential = sequelize.define(
  "WebDAVCredential",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encryptedPassword: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    iv: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    lastVerified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    hooks: {
      beforeSave: (credential) => {
        // 加密密码
        if (credential.changed("password")) {
          const iv = crypto.randomBytes(12);
          const cipher = crypto.createCipheriv(
            "aes-256-gcm",
            Buffer.from(process.env.ENCRYPTION_KEY, "hex"),
            iv,
          );

          let encrypted = cipher.update(credential.password, "utf8", "hex");
          encrypted += cipher.final("hex");
          const tag = cipher.getAuthTag();

          credential.encryptedPassword = `${encrypted}:${tag.toString("hex")}`;
          credential.iv = iv.toString("hex");
          credential.password = undefined; // 清除明文密码
        }
      },
    },
    instanceMethods: {
      getPassword() {
        const [encrypted, tag] = this.encryptedPassword.split(":");
        const iv = Buffer.from(this.iv, "hex");

        const decipher = crypto.createDecipheriv(
          "aes-256-gcm",
          Buffer.from(process.env.ENCRYPTION_KEY, "hex"),
          iv,
        );

        decipher.setAuthTag(Buffer.from(tag, "hex"));

        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
      },
    },
  },
);
