import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { QueueData } from "../interfaces/queueInterface";

type QueueCreationAttributes = Optional<QueueData, "id" | "isDeleted">;

export class Queue
  extends Model<QueueData, QueueCreationAttributes>
  implements QueueData
{
  public id!: number;
  public name!: string;
  public estimatedInterval!: number;
  public orgId!: number;
  public isDeleted!: boolean;
}

Queue.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    estimatedInterval: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "Queues",
  }
);
