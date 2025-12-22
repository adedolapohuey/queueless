import { User } from "./user.model";
import { Ticket } from "./ticket.model";

Ticket.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Ticket, {
  foreignKey: "userId",
  as: "tickets",
});

export { User, Ticket };
