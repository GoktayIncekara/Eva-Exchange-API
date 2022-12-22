const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js").sequelize;
const { Users } = require("./userModel.js");
const { Share } = require("./shareModel.js");

const Portfolio = sequelize.define(
  "Portfolio",
  {
    user_id: {
      type: Sequelize.UUID,

      references: {
        model: Users,
        key: "id",
      },
    },
    symbol: {
      type: DataTypes.STRING(3),

      references: {
        model: Share,
        key: "symbol",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Portfolio.sync({ alter: true })
  .then(() => {
    Users.findAll({
      attributes: ["id"],
      where: {
        name: "Goktay",
      },
    }).then((instances) => {
      Portfolio.create({
        user_id: instances[0].dataValues.id,
        symbol: "AEY",
        amount: 20,
      });
    });

    Users.findAll({
      attributes: ["id"],
      where: {
        name: "Goktay",
      },
    }).then((instances) => {
      Portfolio.create({
        user_id: instances[0].dataValues.id,
        symbol: "CAC",
        amount: 13,
      });
    });

    Users.findAll({
      attributes: ["id"],
      where: {
        name: "Nour",
      },
    }).then((instances) => {
      Portfolio.create({
        user_id: instances[0].dataValues.id,
        symbol: "SLP",
        amount: 10,
      });
    });

    Users.findAll({
      attributes: ["id"],
      where: {
        name: "Alex",
      },
    }).then((instances) => {
      Portfolio.create({
        user_id: instances[0].dataValues.id,
        symbol: "NGA",
        amount: 31,
      });
    });
  })
  .catch((err) => console.error("Error creating table:", err));

module.exports = {
  Portfolio,
};
