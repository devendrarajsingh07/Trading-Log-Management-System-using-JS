import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addTrade, getLivePrice } from "../services/api";

function AddTrade() {
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
  const [priceLoading, setPriceLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchLivePrice = async () => {
    const symbol = form.symbol.trim();

    if (!symbol) {
      setError("Please enter a symbol first");
      toast.error("Please enter a symbol first");
      return;
    }

    setError("");
    setPriceLoading(true);

    try {
      const res = await getLivePrice(symbol);
      setForm((prev) => ({
        ...prev,
        live_price: res.data.price,
      }));
      toast.success("Live price loaded");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch live price";
      setError(msg);
      toast.error(msg);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const pnl =
        (Number(form.exit_price || 0) - Number(form.entry_price || 0)) *
        Number(form.quantity || 0);

      await addTrade({ ...form, pnl });
      toast.success("Trade added successfully");
      navigate("/view-trades");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add trade";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="center-page">
      <div className="card form-card">
        <h1 style={{ marginBottom: "20px" }}>Add Trade</h1>

        <form onSubmit={handleSubmit}>
          <input className="input" type="text" name="symbol" placeholder="Symbol" value={form.symbol} onChange={handleChange} />

          <button type="button" onClick={fetchLivePrice} disabled={priceLoading} className="secondary-btn">
            {priceLoading ? "Fetching..." : "Get Live Price"}
          </button>

          <input className="input" type="number" name="live_price" placeholder="Live Price" value={form.live_price} onChange={handleChange} />

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

          <button className="primary-btn" style={{ width: "100%" }} type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Trade"}
          </button>
        </form>

        {error && <p className="auth-note">{error}</p>}
      </div>
    </div>
  );
}

export default AddTrade;