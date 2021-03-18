const mysql = require("mysql2");
const importCsv = require("../csv");
exports.getData = (req, res, next) => {
  importCsv.findData(req.params.lat, req.params.lon, (result, error) => {
    let data = [];
    if (!error) {
      for (let i = 0; i < 3; i++) {
        data.push({
          forecast_time: result[i][0].forecast_time,
          Temperature: result[i][0].Temperature,
          Precipitation: result[i][0].Precipitation,
        });
      }
      return res.status(200).json(data);
    }
    return res
      .status(404)
      .json(error + " there is no weather data for this place ");
  });
};
