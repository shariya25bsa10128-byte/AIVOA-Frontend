import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

import "../styles/Dashboard.css";

function Dashboard({ refresh }) {
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  useEffect(() => {
  fetchDashboardData();
}, [refresh]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/complaints"
      );

      const complaints = res.data;

      const total = complaints.length;

      const high = complaints.filter(
        (item) => item.riskLevel === "HIGH"
      ).length;

      const medium = complaints.filter(
        (item) => item.riskLevel === "MEDIUM"
      ).length;

      const low = complaints.filter(
        (item) => item.riskLevel === "LOW"
      ).length;

      setStats({
        total,
        high,
        medium,
        low,
      });

    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <div className="dashboard">

      <h2>📊 Complaint Dashboard</h2>

      <div className="dashboard-cards">

        <div className="card">
          <FaClipboardList className="card-icon" />
          <h3>Total Complaints</h3>
          <h1>{stats.total}</h1>
        </div>

        <div className="card high">
          <FaExclamationTriangle className="card-icon" />
          <h3>High Risk</h3>
          <h1>{stats.high}</h1>
        </div>

        <div className="card medium">
          <FaChartLine className="card-icon" />
          <h3>Medium Risk</h3>
          <h1>{stats.medium}</h1>
        </div>

        <div className="card low">
          <FaCheckCircle className="card-icon" />
          <h3>Low Risk</h3>
          <h1>{stats.low}</h1>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;