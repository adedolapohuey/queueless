"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Queue.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
      modelName: "Queue",
    }
  );
  return Queue;
};
