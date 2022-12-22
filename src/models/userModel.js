const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js").sequelize;
const { users } = require("../datas/bulkDatas.js");

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(64),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Users.sync({ alter: true })
  .then(() => {
    Users.bulkCreate(users)
      .then(() => {
        console.log("Bulk creation is successful for users.");
      })
      .catch((error) => console.log(error));
  })
  .catch((err) => console.error("Error creating table:", err));

module.exports = {
  Users,
};
