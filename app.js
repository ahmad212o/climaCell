const express = require("express");
const mysql = require("mysql2");
const app = express();
const path = require("path");
const importCsv = require("./csv");
const weather = require("./Routes/weather");
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  return res.sendFile(path.join(__dirname + "/templates/index.html"));
});
app.use("/weather", weather);

const server = app.listen(process.env.PORT || 5000);
