const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js").sequelize;
const { shares } = require("../datas/bulkDatas.js");

const Share = sequelize.define(
  "Share",
  {
    symbol: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      validate: {
        isUppercase: true,
        len: [3, 3],
      },
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 10,
        max: 99,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Share.sync({ alter: true })
  .then(() => {
    Share.bulkCreate(shares)
      .then(() => {
        console.log("Bulk creation is successful for shares.");
      })
      .catch((error) => console.log(error));
  })
  .catch((err) => console.error("Error creating table:", err));

module.exports = {
  Share,
};
