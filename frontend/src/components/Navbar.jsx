import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleLogout } from "../utils/logout";

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedLang, setSelectedLang] = useState("English");

  return (
    <nav className="navbar navbar-dark px-3 px-md-4 py-2" style={styles.nav}>
      {/* Logo */}
      <span className="navbar-brand fw-bold fs-4" style={styles.logo}>
        SHAREDOCS
      </span>

      {/* Desktop Search */}
      <div className="input-group d-none d-md-flex" style={{ maxWidth: "400px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search documents..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(searchText)}
        />
        <button
          className="btn btn-success"
          onClick={() => onSearch(searchText)}
        >
          Search
        </button>
      </div>

      {/* Desktop Right */}
      <div className="d-none d-md-flex align-items-center gap-3">
        {/* Language Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-outline-light btn-sm dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            🌐 {selectedLang}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            {["English", "Spanish", "French", "German", "Urdu"].map((lang) => (
              <li key={lang}>
                <button
                  className="dropdown-item"
                  onClick={() => setSelectedLang(lang)}
                >
                  {lang}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Username */}
        {user && (
          <span className="text-white fw-bold">
            👤 {user.name}
          </span>
        )}

        {/* Logout */}
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleLogout(navigate)}
        >
          Logout
        </button>
      </div>

      {/* Hamburger — mobile only */}
      <button
        className="navbar-toggler d-md-none"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="w-100 d-md-none mt-2 pb-2" style={styles.mobileMenu}>
          {/* Mobile Search */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search documents..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch(searchText);
                  setMenuOpen(false);
                }
              }}
            />
            <button
              className="btn btn-success"
              onClick={() => {
                onSearch(searchText);
                setMenuOpen(false);
              }}
            >
              Search
            </button>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

          {/* Mobile User */}
          {user && (
            <p className="text-white fw-bold mb-2">👤 {user.name}</p>
          )}

          {/* Mobile Logout */}
          <button
            className="btn btn-danger w-100"
            onClick={() => handleLogout(navigate)}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(6px)",
    flexWrap: "wrap",
  },
  logo: {
    letterSpacing: "2px",
    color: "#fff",
  },
  mobileMenu: {
    borderTop: "1px solid rgba(255,255,255,0.15)",
    paddingTop: "12px",
  },
};