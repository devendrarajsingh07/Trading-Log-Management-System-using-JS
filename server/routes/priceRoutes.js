const express = require("express");
const router = express.Router();
const { getLivePrice } = require("../controllers/priceController");

router.get("/:symbol", getLivePrice);

module.exports = router;