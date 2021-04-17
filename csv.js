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
const queryInterface = sequelize.getQueryInterface();
async function showAll(sequelize) {
  const queryInterface = await sequelize.getQueryInterface();
  const all = await queryInterface.showAllSchemas();
  console.log(all);
  return all;
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
    let rows = [];
    for (let item of csvData) rows.push(setRows(colsNames, item));
    queryInterface.bulkInsert(tableName, rows);
  } catch (err) {
    throw err;
  }
}

//this function opens the csv file and reads it
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

async function findData(sequelize, QueryTypes, column, value, tableName) {
  const query = `SELECT *  FROM ${tableName} WHERE ${column} = :param `;
  const result = await sequelize.query(query, {
    replacements: { param: value },
    type: QueryTypes.SELECT,
  });
  return result;
}

async function printAllColumns(sequelize, QueryTypes, tableName) {
  try {
    const query = `SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA=:schemaName 
    AND TABLE_NAME=:tableName;`;
    const schema = await extractSchemasNames(showAll(sequelize));
    const result = await sequelize.query(query, {
      replacements: { schemaName: schema, tableName: tableName },
      type: QueryTypes.SELECT,
    });

    console.log(result);
    return result;
  } catch (err) {
    throw err;
  }
}

async function extractSchemasNames(schemas) {
  try {
    let schemaArray = await schemas;
    const result = schemaArray.map((item) => {
      const array = Object.keys(item)[0].split("_");
      let schemaName = array[2];
      for (let i = 3; i < array.length; i++) {
        if (array[i]) schemaName = schemaName + "_" + array[i];
      }
      return schemaName;
    });
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function dropTable(queryInterface, tableName) {
  try {
    await queryInterface.dropTable(tableName);
  } catch (err) {
    throw err;
  }
}
