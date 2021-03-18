const express = require("express");
const mysql = require("mysql2");
const app = express();
const importCsv = require("./csv");
const weather = require("./Routes/weather");

app.get("/", (req, res, next) => {
  return res.json("hi");
});
app.use("/weather", weather);

const server = app.listen(3000);
