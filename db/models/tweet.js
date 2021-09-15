"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    "Tweet",
    {
      message: {
        type: DataTypes.STRING(280),
        allowNull: false,
      },

      userId: {
        type: DataTypes.Integer,
        allowNull: false
      }
    },
    {}
  );
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
  };
  return Tweet;
};