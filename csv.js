const fs = require("fs");
const mysql = require("mysql2");
const csv = require("fast-csv");

//-----------this is the code to ingest the scv files to the databases--------------------------------------

//for (let i = 1; i < 4; i++)
//importCsvData2MySQL(`/assets/file${i}.csv`, `data${i}`);

//-----------------------------------------------------------------------------------
//this function connects to the database
function connectToSql() {
  return mysql.createConnection({
    host: "freedb.tech",
    user: "freedbtech_ahmad",
    password: "ahmad1234",
    database: "freedbtech_weatherdb",
    multipleStatements: true,
  });
}
//this function creates new table and ingests in it the provided file
function ingestNewTable(connection, tableName, csvData) {
  connection.connect((error) => {
    if (error) {
      console.error(error);
      connection.end();
    } else {
      const name = tableName;
      const createTable1 = " CREATE TABLE ";
      const createTable2 =
        " (Longitude FLOAT, Latitude FLOAT,forecast_time VARCHAR(45),Temperature FLOAT,Precipitation FLOAT)";
      connection.query(createTable1 + name + createTable2, (error, result) => {
        if (error) {
          console.log(error);
          connection.end();
        } else {
          console.log(" the table created successfully \n ");
          let query1 = "INSERT INTO ";
          let query2 =
            " (Longitude,Latitude,forecast_time,Temperature,Precipitation) VALUES ?";
          connection.query(
            query1 + name + query2,
            [csvData],
            (error, response) => {
              console.log(error || response);
              connection.end();
            }
          );
        }
      });
    }
  });
}
//this function opens the csv file and reads it
function importCsvData2MySQL(filePath, tableName) {
  let stream = fs.createReadStream(__dirname + filePath);
  let csvData = [];
  let csvStream = csv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      csvData.shift();

      const connection = connectToSql();
      ingestNewTable(connection, tableName, csvData);
    });
  stream.pipe(csvStream);
}
// this function finds the weathers summary for a specific place
async function findSummary(lat, lon, callback) {
  const connection = connectToSql();
  connection.connect((error) => {
    if (error) {
      //console.error(error);
      connection.end();
    } else {
      const query1 = `select  data1.Temperature,data1.Precipitation from data1 where Latitude=${lat} AND Longitude=${lon} union `;
      const query2 = `select data2.Temperature,data2.Precipitation from data2 where Latitude=${lat} AND Longitude=${lon} union `;
      const query3 = `select data3.Temperature,data3.Precipitation from data3 where Latitude=${lat} AND Longitude=${lon} order by Temperature desc;`;
      connection.query(query1 + query2 + query3, function (error, rows) {
        if (error) {
          //console.log(error);
          callback(rows, error);
          connection.end();
        } else {
          connection.end();
          callback(rows, error);
        }
      });
    }
  });
}
// this function finds the weathers data
async function findData(lat, lon, callback) {
  const connection = connectToSql();
  connection.connect((error) => {
    if (error) {
      //console.error(error);
      connection.end();
    } else {
      const query1 = `select data1.forecast_time,data1.Temperature,data1.Precipitation from data1 where Latitude=${lat} AND Longitude=${lon};`;
      const query2 = `select data2.forecast_time,data2.Temperature,data2.Precipitation from data2 where Latitude=${lat} AND Longitude=${lon};`;
      const query3 = `select data3.forecast_time,data3.Temperature,data3.Precipitation from data3 where Latitude=${lat} AND Longitude=${lon};`;
      connection.query(query1 + query2 + query3, function (error, rows) {
        if (error) {
          //console.log(error);
          callback(rows, error);
          connection.end();
        } else {
          connection.end();
          callback(rows, error);
        }
      });
    }
  });
}
module.exports.importCsvData2MySQL = importCsvData2MySQL;
module.exports.findData = findData;
module.exports.findSummary = findSummary;
module.exports.connectToSql = connectToSql;
