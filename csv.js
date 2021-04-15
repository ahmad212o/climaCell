const fs = require("fs");
const mysql = require("mysql2");
const csv = require("fast-csv");
const { Sequelize, DataTypes, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(
  "freedbtech_weatherdb",
  "freedbtech_ahmad",
  "ahmad1234",
  {
    host: "freedb.tech",
    dialect: "mysql",
  }
);
showAll(sequelize);
async function showAll(sequelize) {
  const queryInterface = await sequelize.getQueryInterface();
  const all = await queryInterface.showAllSchemas();
  console.log(all);
}
//this function creates new table
function createNewTable(queryInterface, tableName, cols) {
  return queryInterface.createTable(tableName, cols);
}

function cols(colsNames, DataTypes) {
  let tableCols = {};
  for (let item of colsNames) {
    tableCols[item] = DataTypes.STRING;
  }

  return tableCols;
}
function setRows(colsNames, row) {
  let tableCols = {};
  let i = 0;
  for (let item of colsNames) {
    tableCols[item] = row[i];
    if (i < row.length) i++;
  }

  return tableCols;
}

async function insertToDataBase(
  sequelize,
  DataTypes,
  tableName,
  colsNames,
  csvData
) {
  try {
    await sequelize.authenticate();
    const queryInterface = await sequelize.getQueryInterface();
    const col = cols(colsNames, DataTypes);
    await createNewTable(queryInterface, tableName, col);
    let b = [];
    for (let item of csvData) b.push(setRows(colsNames, item));
    queryInterface.bulkInsert(tableName, b);
  } catch (err) {
    throw err;
  }
}
//this function opens the csv file and reads it
//importCsvData2MySQL("/assets/file1.csv", "test44", sequelize, DataTypes);
function importCsvData2MySQL(filePath, tableName, sequelize, DataTypes) {
  let stream = fs.createReadStream(__dirname + filePath);
  let csvData = [];
  let csvStream = csv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      const headers = csvData.shift();
      insertToDataBase(sequelize, DataTypes, tableName, headers, csvData);
    });
  stream.pipe(csvStream);
}
findData(sequelize, QueryTypes, "asad", "asad", "tableName44");

async function findData(sequelize, QueryTypes, column, value, tableName) {
  const query = `SELECT *  FROM ${tableName} WHERE ${column} = :param `;
  const result = await sequelize.query(query, {
    replacements: { param: value },
    type: QueryTypes.SELECT,
  });
  return result;
}
