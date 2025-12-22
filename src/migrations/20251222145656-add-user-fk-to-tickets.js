"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tickets", "userId", {
      type: Sequelize.INTEGER, // or INTEGER
      allowNull: false,
    });

    await queryInterface.addConstraint("Tickets", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_Tickets_userId",
      references: {
        table: "Users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Tickets", "fk_Tickets_userId");
    await queryInterface.removeColumn("Tickets", "userId");
  },
};
