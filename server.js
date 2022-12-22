const express = require("express");
const tradeRoutes = require("./routes");
const { db } = require("./src/database/db.js");

const app = express();
const port = 3000;

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.listen(port, () => {
  console.log(`Sever is now listening at port ${port}`);
});

app.use("/api/trades", tradeRoutes);
