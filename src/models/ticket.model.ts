import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { TicketData } from "../interfaces/queueInterface";
import { User } from "./user.model";

type TicketCreationAttributes = Optional<TicketData, "id" | "appointmentTime">;
export class Ticket
  extends Model<TicketData, TicketCreationAttributes>
  implements TicketData
{
  public id!: number;
  public queueId!: number;
  public ticketNumber!: string;
  public orgId!: number;
  public userId!: number;
  public status!: "pending" | "completed" | "cancelled";
  declare user?: User;
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
    orgId: { type: DataTypes.INTEGER, allowNull: false },
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
