import { useEffect, useState } from "react";
import {
  getTrades,
  deleteTrade,
  searchTrades,
  exportTradesCsv,
} from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ViewTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState("ALL");
  const [error, setError] = useState("");

  const loadTrades = async (q = "", side = "ALL") => {
    setLoading(true);
    setError("");

    try {
      const hasFilter = q.trim() || side !== "ALL";

      const res = hasFilter
        ? await searchTrades(q, side === "ALL" ? "" : side)
        : await getTrades();

      setTrades(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load trades");
      toast.error("Failed to load trades");
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrades(search, sideFilter);
  }, [search, sideFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trade?")) return;

    try {
      await deleteTrade(id);
      toast.success("Trade deleted");
      loadTrades(search, sideFilter);
    } catch (err) {
      toast.error("Failed to delete trade");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportTradesCsv();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "trades_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  return (
    <div className="page-wrap">
      <h1>View Trades</h1>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/dashboard">Back to Dashboard</Link> |{" "}
        <Link to="/add-trade">Add Trade</Link>
      </div>

      <div className="controls">
        <input
          className="input"
          type="text"
          placeholder="Search by symbol, strategy, remarks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select"
          value={sideFilter}
          onChange={(e) => setSideFilter(e.target.value)}
        >
          <option value="ALL">All Sides</option>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>

        <button onClick={handleExport} className="secondary-btn" style={{ width: "auto", marginBottom: 0 }}>
          Export CSV
        </button>
      </div>

      {loading ? (
        <p>Loading trades...</p>
      ) : error ? (
        <p className="auth-note">{error}</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Symbol</th>
                <th>Side</th>
                <th>Strategy</th>
                <th>Remarks</th>
                <th>Trade Date</th>
                <th>Entry Price</th>
                <th>Exit Price</th>
                <th>Quantity</th>
                <th>PNL</th>
                <th>Live Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.length > 0 ? (
                trades.map((trade) => (
                  <tr key={trade.id}>
                    <td>{trade.id}</td>
                    <td>{trade.symbol}</td>
                    <td>{trade.side}</td>
                    <td>{trade.strategy}</td>
                    <td>{trade.remarks}</td>
                    <td>{trade.trade_date}</td>
                    <td>{trade.entry_price}</td>
                    <td>{trade.exit_price}</td>
                    <td>{trade.quantity}</td>
                    <td>{trade.pnl}</td>
                    <td>{trade.live_price}</td>
                    <td>
                      <Link to={`/edit-trade/${trade.id}`}>Edit</Link>{" "}
                      <button className="danger-btn" onClick={() => handleDelete(trade.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>
                    No trades found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewTrades;