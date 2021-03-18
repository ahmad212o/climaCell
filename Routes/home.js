const express = require("express");
const router = express.Router();

router.get("", (req, res, next) => {
  res.render({ title: "hi this " });
});

module.exports = router;
