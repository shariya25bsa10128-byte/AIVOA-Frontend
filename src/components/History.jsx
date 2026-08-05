import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/History.css";

function History({ refresh }) {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  useEffect(() => {
  fetchComplaints();
}, [refresh]);

  useEffect(() => {
    filterComplaints();
  }, [search, riskFilter, complaints]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/complaints"
      );

      setComplaints(res.data);
      setFilteredComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let data = [...complaints];

    if (search.trim() !== "") {
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.product.toLowerCase().includes(search.toLowerCase()) ||
          item.batch.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (riskFilter !== "ALL") {
      data = data.filter(
        (item) => item.riskLevel === riskFilter
      );
    }

    setFilteredComplaints(data);
  };

  return (
    <div className="history-container">
      <h2>Complaint History</h2>

      <div className="history-filters">

        <input
          type="text"
          placeholder="Search by title, product or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option value="ALL">All Risks</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredComplaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Product</th>
              <th>Batch</th>
              <th>Risk</th>
              <th>Confidence</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.product}</td>
                <td>{item.batch}</td>
                <td>{item.riskLevel}</td>
                <td>{item.confidence}</td>
                <td>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;