import { useEffect, useMemo, useState } from "react";
import { getSummary, getTrades } from "../services/api";
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [summary, setSummary] = useState({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    netProfit: 0,
    avgProfit: 0,
    bestTrade: 0,
    worstTrade: 0,
    winRate: 0,
  });

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryRes, tradesRes] = await Promise.all([
          getSummary(),
          getTrades(),
        ]);

        setSummary(summaryRes.data);
        setTrades(Array.isArray(tradesRes.data) ? tradesRes.data : []);
      } catch (err) {
        console.log("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const chartData = useMemo(() => {
    const latestTrades = [...trades].slice(0, 10).reverse();

    return {
      labels: latestTrades.map((trade) =>
        trade.symbol ? `${trade.symbol} #${trade.id}` : `Trade #${trade.id}`
      ),
      datasets: [
        {
          label: "PNL",
          data: latestTrades.map((trade) => Number(trade.pnl || 0)),
        },
      ],
    };
  }, [trades]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Profit / Loss by Trade" },
    },
  };

  return (
    <div className="page-wrap">
      <h1>Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/add-trade">Add Trade</Link> |{" "}
        <Link to="/view-trades">View Trades</Link>
      </div>

      {loading ? (
        <p>Loading summary...</p>
      ) : (
        <>
          <div className="grid-cards">
            <div className="stat-card"><h3>Total Trades</h3><p>{summary.totalTrades}</p></div>
            <div className="stat-card"><h3>Winning Trades</h3><p>{summary.winningTrades}</p></div>
            <div className="stat-card"><h3>Losing Trades</h3><p>{summary.losingTrades}</p></div>
            <div className="stat-card"><h3>Win Rate</h3><p>{summary.winRate}%</p></div>
            <div className="stat-card"><h3>Net Profit</h3><p>{summary.netProfit}</p></div>
            <div className="stat-card"><h3>Average Profit</h3><p>{summary.avgProfit}</p></div>
            <div className="stat-card"><h3>Best Trade</h3><p>{summary.bestTrade}</p></div>
            <div className="stat-card"><h3>Worst Trade</h3><p>{summary.worstTrade}</p></div>
          </div>

          <div className="card">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;