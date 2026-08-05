import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

import {
  FaRobot,
  FaUpload,
  FaExclamationTriangle,
  FaClipboardList,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/ComplaintForm.css";

function ComplaintForm({ onComplaintAdded }) {
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [batch, setBatch] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const analyzeComplaint = async () => {
    try {
      setLoading(true);
      setAnalysis(null);

      const formData = new FormData();

      if (selectedFile) {
        formData.append("pdf", selectedFile);
      } else {
        formData.append("title", title);
        formData.append("product", product);
        formData.append("batch", batch);
        formData.append("description", description);
      }

      const response = await axios.post(
        "http://localhost:5000/api/complaints/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(response.data);

      if (onComplaintAdded) {
        onComplaintAdded();
      }
    } catch (error) {
      console.error(error);
      alert("AI analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AIVOA AI Complaint Report", 20, 20);

    doc.setFontSize(12);

    doc.text(`Complaint Title: ${title}`, 20, 40);
    doc.text(`Product: ${product}`, 20, 50);
    doc.text(`Batch Number: ${batch}`, 20, 60);

    doc.text(`Risk Level: ${analysis.riskLevel}`, 20, 75);

    doc.text("Risk Assessment:", 20, 90);
    doc.text(
      doc.splitTextToSize(analysis.riskAssessment || "", 170),
      20,
      100
    );

    doc.text("Root Cause:", 20, 125);
    doc.text(
      doc.splitTextToSize(analysis.rootCause || "", 170),
      20,
      135
    );

    doc.text("Summary:", 20, 160);
    doc.text(
      doc.splitTextToSize(analysis.summary || "", 170),
      20,
      170
    );

    let y = 195;

    doc.text("Suggested CAPA:", 20, y);

    y += 10;

    analysis.capa?.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 8;
    });

    y += 10;

    doc.text(`Confidence: ${analysis.confidence}`, 20, y);

    y += 10;

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      20,
      y
    );

    doc.save("AIVOA_Complaint_Report.pdf");
  };

  const getRiskColor = () => {
    if (!analysis) return "#2563eb";

    const risk = analysis.riskLevel?.toUpperCase();

    if (risk === "HIGH") return "#dc2626";
    if (risk === "MEDIUM") return "#f59e0b";
    if (risk === "LOW") return "#16a34a";

    return "#2563eb";
  };

  return (
    <>
          <div className="complaint-card">
        <h2>
          <FaClipboardList /> Complaint Information
        </h2>

        <label>Complaint Title</label>
        <input
          type="text"
          placeholder="Enter complaint title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <label>Batch Number</label>
        <input
          type="text"
          placeholder="Enter batch number"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        />

        <label>Complaint Description</label>
        <textarea
          rows="6"
          placeholder="Describe the complaint..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="upload-label">
          <FaUpload /> Upload Complaint PDF (Optional)
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />

        <button
          className="analyze-btn"
          onClick={analyzeComplaint}
          disabled={loading}
        >
          <FaRobot />
          {loading ? "Analyzing with AI..." : "Analyze with AI"}
        </button>
      </div>

      {analysis && (
        <div className="analysis-card">

          <h2>
            <FaRobot />
            AI Complaint Analysis
          </h2>

          <div
            className="risk-badge"
            style={{ background: getRiskColor() }}
          >
            <FaExclamationTriangle />
            {analysis.riskLevel}
          </div>

          <div className="result-section">
            <h3>
              <FaSearch />
              Risk Assessment
            </h3>

            <p>{analysis.riskAssessment}</p>
          </div>

          <div className="result-section">
            <h3>
              <FaSearch />
              Root Cause
            </h3>

            <p>{analysis.rootCause}</p>
          </div>
                    <div className="result-section">
            <h3>
              <FaClipboardList />
              Summary
            </h3>

            <p>{analysis.summary}</p>
          </div>

          <div className="result-section">
            <h3>
              <FaCheckCircle />
              Suggested CAPA
            </h3>

            <ul>
              {analysis.capa?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="confidence">
            Confidence : <strong>{analysis.confidence}</strong>
          </div>

                    <button
            className="download-btn"
            onClick={downloadReport}
          >
            Download PDF Report
          </button>

        </div>
      )}

    </>
  );
}

export default ComplaintForm;