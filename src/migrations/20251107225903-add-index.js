// migrations/20251107120000-add-user-email-index.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("Users", ["email"], {
      unique: true,
      name: "Users_email_unique_idx", // 👈 custom index name (optional)
    });

    await queryInterface.addIndex("Users", ["username"], {
      unique: true,
      name: "Users_username_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Users", "Users_email_unique_idx");
    await queryInterface.removeIndex("Users", "Users_username_idx");
  },
};
