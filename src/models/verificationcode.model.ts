// src/models/verificationCode.model.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { otpActionTypes } from "../interfaces/authInterface";

export class VerificationCode extends Model {
  declare id: number;
  declare user: string;
  declare code: string;
  declare action: otpActionTypes;
  declare createdAt: Date;
  declare expiresAt: Date;
}

VerificationCode.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING, allowNull: false },
    action: {
      type: DataTypes.ENUM("email_verification", "forgot_password", ""),
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: "VerificationCodes",
  }
);
