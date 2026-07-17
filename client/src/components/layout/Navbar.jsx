import { useState } from "react";
import { NavLink } from "react-router-dom";

import GlobalSearch from "./GlobalSearch";

import "../../styles/components/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar__content">
        <NavLink className="navbar__logo" to="/" onClick={closeMenu}>
          RegionLore
        </NavLink>

        <button
          className={`navbar__menu-button ${
            menuOpen ? "navbar__menu-button--open" : ""
          }`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((currentValue) => !currentValue)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={`navbar__panel ${menuOpen ? "navbar__panel--open" : ""}`}
        >
          <div className="navbar__search">
            <GlobalSearch />
          </div>

          <div className="navbar__links">
            <NavLink to="/states" onClick={closeMenu}>
              States
            </NavLink>

            <NavLink to="/metros" onClick={closeMenu}>
              Metros
            </NavLink>

            <NavLink to="/about" onClick={closeMenu}>
              About
            </NavLink>

            <NavLink to="/dashboard" onClick={closeMenu}>
              Dashboard
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
