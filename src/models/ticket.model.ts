import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export class Ticket extends Model {
  public id!: number;
  public queueId!: number;
  public organizationId!: number;
  public userId!: number;
  public status!: "WAITING" | "SERVED";
}

Ticket.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ticketNumber: { type: DataTypes.STRING, allowNull: false },
    appointmentTime: {
      type: DataTypes.DATE,
    },
    queueId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    organizationId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "Tickets",
  }
);
