import { FaRobot } from "react-icons/fa";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <FaRobot className="logo-icon" />

        <div>
          <h1>AIVOA</h1>
          <p>AI-Powered Pharmaceutical Complaint Management System</p>
        </div>
      </div>

      <div className="header-right">
        <span className="status">● AI Connected</span>
      </div>
    </header>
  );
}

export default Header;