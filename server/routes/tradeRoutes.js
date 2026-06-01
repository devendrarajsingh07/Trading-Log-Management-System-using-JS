const express = require("express");
const router = express.Router();

const {
  addTrade,
  getAllTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
  getDashboardSummary,
  searchTrades,
  exportTradesCsv,
} = require("../controllers/tradeController");

const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/summary", getDashboardSummary);
router.get("/search", searchTrades);
router.get("/export/csv", exportTradesCsv);
router.get("/", getAllTrades);
router.get("/:id", getTradeById);
router.post("/", addTrade);
router.put("/:id", updateTrade);
router.delete("/:id", deleteTrade);

module.exports = router;