import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaStickyNote,
  FaFileMedical,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { removeToken } from "../utils/auth";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    navigate("/login");
  }

  const menuItems = [
    { path: "/profile", label: "Profile", icon: <FaUser /> },

    { divider: true },

    { path: "/notes", label: "Notes", icon: <FaStickyNote /> },
    { path: "/reports", label: "Reports", icon: <FaFileMedical /> },
    { path: "/help", label: "Help", icon: <FaQuestionCircle /> },
  ];

  return (
    <div className="sidebar">
      <h2 className="logo">EchoNapse</h2>

      <nav className="menu">
        {menuItems.map((item, index) =>
          item.divider ? (
            <div key={index} className="divider" />
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="icon">{item.icon}</span>
              <span className="text">{item.label}</span>
            </Link>
          )
        )}
      </nav>

      {/* Logout */}
      <div className="logout" onClick={handleLogout}>
        <span className="icon">
          <FaSignOutAlt />
        </span>
        <span className="text">Logout</span>
      </div>
    </div>
  );
}
