import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { RegistrationData } from "../interfaces/authInterface";

type UserCreationAttributes = Optional<RegistrationData, "id">;

export class User
  extends Model<RegistrationData, UserCreationAttributes>
  implements RegistrationData
{
  public id!: number;
  public username!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public organization!: string;
  public password!: string;
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
