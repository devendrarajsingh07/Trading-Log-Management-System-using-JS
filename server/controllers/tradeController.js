const db = require("../config/db");


const addTrade = (req, res) => {
  const {
    symbol,
    side,
    strategy,
    remarks,
    trade_date,
    entry_price,
    exit_price,
    quantity,
    pnl,
    live_price,
  } = req.body;

  if (!symbol || !side || !trade_date || entry_price === undefined || quantity === undefined) {
    return res.status(400).json({
      message: "symbol, side, trade_date, entry_price, and quantity are required",
    });
  }

  const finalPnl =
    pnl !== undefined && pnl !== null && pnl !== ""
      ? pnl
      : (Number(exit_price || 0) - Number(entry_price || 0)) * Number(quantity || 0);

  const query = `
    INSERT INTO trades
    (symbol, side, strategy, remarks, trade_date, entry_price, exit_price, quantity, pnl, live_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      symbol,
      side,
      strategy || "",
      remarks || "",
      trade_date,
      entry_price,
      exit_price || null,
      quantity,
      finalPnl,
      live_price || 0,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({
        message: "Trade added successfully",
        tradeId: result.insertId,
      });
    }
  );
};


const getAllTrades = (req, res) => {
  db.query("SELECT * FROM trades ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json(results);
  });
};


const getTradeById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM trades WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.json(results[0]);
  });
};


const updateTrade = (req, res) => {
  const { id } = req.params;
  const {
    symbol,
    side,
    strategy,
    remarks,
    trade_date,
    entry_price,
    exit_price,
    quantity,
    pnl,
    live_price,
  } = req.body;

  if (!symbol || !side || !trade_date || entry_price === undefined || quantity === undefined) {
    return res.status(400).json({
      message: "symbol, side, trade_date, entry_price, and quantity are required",
    });
  }

  const finalPnl =
    pnl !== undefined && pnl !== null && pnl !== ""
      ? pnl
      : (Number(exit_price || 0) - Number(entry_price || 0)) * Number(quantity || 0);

  const query = `
    UPDATE trades
    SET symbol = ?, side = ?, strategy = ?, remarks = ?, trade_date = ?, entry_price = ?, exit_price = ?, quantity = ?, pnl = ?, live_price = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      symbol,
      side,
      strategy || "",
      remarks || "",
      trade_date,
      entry_price,
      exit_price || null,
      quantity,
      finalPnl,
      live_price || 0,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Trade not found" });
      }

      res.json({ message: "Trade updated successfully" });
    }
  );
};


const deleteTrade = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM trades WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.json({ message: "Trade deleted successfully" });
  });
};


const getDashboardSummary = (req, res) => {
  const query = `
    SELECT
      COUNT(*) AS totalTrades,
      COALESCE(SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END), 0) AS winningTrades,
      COALESCE(SUM(CASE WHEN pnl < 0 THEN 1 ELSE 0 END), 0) AS losingTrades,
      COALESCE(SUM(pnl), 0) AS netProfit,
      COALESCE(AVG(pnl), 0) AS avgProfit,
      COALESCE(MAX(pnl), 0) AS bestTrade,
      COALESCE(MIN(pnl), 0) AS worstTrade
    FROM trades
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const row = results[0];
    const totalTrades = Number(row.totalTrades || 0);
    const winningTrades = Number(row.winningTrades || 0);

    res.json({
      ...row,
      winRate: totalTrades > 0 ? Number(((winningTrades / totalTrades) * 100).toFixed(2)) : 0,
    });
  });
};


const searchTrades = (req, res) => {
  const { q = "", side = "" } = req.query;

  let sql = "SELECT * FROM trades WHERE 1=1";
  const params = [];

  if (q.trim()) {
    sql += " AND (symbol LIKE ? OR strategy LIKE ? OR remarks LIKE ?)";
    const like = `%${q.trim()}%`;
    params.push(like, like, like);
  }

  if (side.trim()) {
    sql += " AND side = ?";
    params.push(side.trim());
  }

  sql += " ORDER BY id DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json(results);
  });
};


const exportTradesCsv = (req, res) => {
  db.query("SELECT * FROM trades ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const headers = [
      "id",
      "symbol",
      "side",
      "strategy",
      "remarks",
      "trade_date",
      "entry_price",
      "exit_price",
      "quantity",
      "pnl",
      "live_price",
    ];

    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.join(","),
      ...results.map((row) => headers.map((key) => escapeCsv(row[key])).join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="trades_export.csv"');
    res.send(csv);
  });
};

module.exports = {
  addTrade,
  getAllTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
  getDashboardSummary,
  searchTrades,
  exportTradesCsv,
};