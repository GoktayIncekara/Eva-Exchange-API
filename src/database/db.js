const { Sequelize } = require("sequelize");

const DATABASE_NAME = "eva_exchange";
const PASSWORD = "";

const sequelize = new Sequelize(DATABASE_NAME, "postgres", PASSWORD, {
  host: "localhost",
  dialect: "postgres",
});

async function db() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = {
  sequelize,
};
