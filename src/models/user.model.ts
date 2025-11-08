import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { FullRegistrationData } from "../interfaces/authInterface";

type UserCreationAttributes = Optional<
  FullRegistrationData,
  "id" | "isVerified" | "isDeleted"
>;

export class User
  extends Model<FullRegistrationData, UserCreationAttributes>
  implements FullRegistrationData
{
  public id!: number;
  public username!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public organization!: string;
  public password!: string;
  public isDeleted!: boolean;
  public isVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    organization: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
  }
);
