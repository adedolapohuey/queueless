"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VerificationCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VerificationCode.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user: DataTypes.STRING,
      action: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VerificationCode",
    }
  );
  return VerificationCode;
};
