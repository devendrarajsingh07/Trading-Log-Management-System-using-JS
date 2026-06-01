import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTradeById, updateTrade } from "../services/api";
import { toast } from "react-toastify";

function EditTrade() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    symbol: "",
    side: "BUY",
    strategy: "",
    remarks: "",
    trade_date: "",
    entry_price: "",
    exit_price: "",
    quantity: "",
    live_price: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrade = async () => {
      try {
        const res = await getTradeById(id);
        setForm({
          symbol: res.data.symbol || "",
          side: res.data.side || "BUY",
          strategy: res.data.strategy || "",
          remarks: res.data.remarks || "",
          trade_date: res.data.trade_date || "",
          entry_price: res.data.entry_price || "",
          exit_price: res.data.exit_price || "",
          quantity: res.data.quantity || "",
          live_price: res.data.live_price || "",
        });
      } catch (err) {
        setError("Failed to load trade");
        toast.error("Failed to load trade");
      } finally {
        setLoading(false);
      }
    };

    loadTrade();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const pnl =
        (Number(form.exit_price || 0) - Number(form.entry_price || 0)) *
        Number(form.quantity || 0);

      await updateTrade(id, { ...form, pnl });
      toast.success("Trade updated successfully");
      navigate("/view-trades");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update trade";
      setError(msg);
      toast.error(msg);
    }
  };

  if (loading) {
    return <div className="page-wrap">Loading trade...</div>;
  }

  return (
    <div className="center-page">
      <div className="card form-card">
        <h1 style={{ marginBottom: "20px" }}>Edit Trade</h1>

        <form onSubmit={handleSubmit}>
          <input className="input" type="text" name="symbol" placeholder="Symbol" value={form.symbol} onChange={handleChange} />
          <select className="select" name="side" value={form.side} onChange={handleChange}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input className="input" type="text" name="strategy" placeholder="Strategy" value={form.strategy} onChange={handleChange} />
          <textarea className="textarea" name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} />
          <input className="input" type="date" name="trade_date" value={form.trade_date} onChange={handleChange} />
          <input className="input" type="number" name="entry_price" placeholder="Entry Price" value={form.entry_price} onChange={handleChange} />
          <input className="input" type="number" name="exit_price" placeholder="Exit Price" value={form.exit_price} onChange={handleChange} />
          <input className="input" type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
          <input className="input" type="number" name="live_price" placeholder="Live Price" value={form.live_price} onChange={handleChange} />
          <button className="primary-btn" style={{ width: "100%" }} type="submit">
            Update Trade
          </button>
        </form>

        {error && <p className="auth-note">{error}</p>}
      </div>
    </div>
  );
}

export default EditTrade;