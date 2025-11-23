import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { FullOrganizationData } from "../interfaces/authInterface";

type OrganizationCreationAttributes = Optional<
  FullOrganizationData,
  "id" | "isVerified" | "isActive"
>;

export class Organization
  extends Model<FullOrganizationData, OrganizationCreationAttributes>
  implements FullOrganizationData
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public description!: string;
  public domain!: string;
  public isActive!: boolean;
  public isVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Organization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Organization",
    tableName: "Organizations",
    indexes: [
      {
        unique: true,
        fields: ["name"], // 👈 unique index
      },
    ],
  }
);
