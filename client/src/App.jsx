import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddTrade from "./pages/AddTrade";
import ViewTrades from "./pages/ViewTrades";
import EditTrade from "./pages/EditTrade";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />

      {token && (
        <nav style={styles.nav}>
          <div style={styles.brand}>Trading Log System</div>

          <div style={styles.links}>
            <Link style={styles.link} to="/dashboard">Dashboard</Link>
            <Link style={styles.link} to="/add-trade">Add Trade</Link>
            <Link style={styles.link} to="/view-trades">View Trades</Link>
            <button style={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-trade"
          element={
            <ProtectedRoute>
              <AddTrade />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-trades"
          element={
            <ProtectedRoute>
              <ViewTrades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-trade/:id"
          element={
            <ProtectedRoute>
              <EditTrade />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    background: "#111827",
    color: "white",
    flexWrap: "wrap",
    gap: "12px",
  },
  brand: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  button: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default App;