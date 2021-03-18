const express = require("express");
const dataController = require("../controllers/data");
const SummaryController = require("../controllers/summarize");

const router = express.Router();
router.get("/data/lat=:lat&&lon=:lon", dataController.getData);
router.get("/summarize/lat=:lat&&lon=:lon", SummaryController.getSummary);

module.exports = router;
