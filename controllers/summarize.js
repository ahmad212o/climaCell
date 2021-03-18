const mysql = require("mysql2");
const importCsv = require("../csv");
exports.getSummary = (req, res, next) => {
  importCsv.findSummary(req.params.lat, req.params.lon, (result) => {
    if (result[0]) {
      let data = {
        max: {
          Temperature: result[0].Temperature,
          Precipitation: result[0].Precipitation,
        },
        min: {
          Temperature: result[2].Temperature,
          Precipitation: result[2].Precipitation,
        },
        avg: {
          Temperature: result[1].Temperature,
          Precipitation: result[1].Precipitation,
        },
      };

      return res.status(200).json(data);
    }
    return res.status(404).json("there is no forecast summary for this place ");
  });
};
