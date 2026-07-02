import { NavLink } from "react-router-dom";
import "../../styles/components/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar__brand">PopShift</h2>

      <div className="navbar__links">
        <NavLink to="/" className="navbar__link">
          Home
        </NavLink>
        <NavLink to="/dashboard" className="navbar__link">
          Dashboard
        </NavLink>
        <NavLink to="/rankings" className="navbar__link">
          Rankings
        </NavLink>
        <NavLink to="/compare" className="navbar__link">
          Compare
        </NavLink>
        <NavLink to="/about" className="navbar__link">
          About
        </NavLink>
        <NavLink to="/methodology" className="navbar__link">
          Methodology
        </NavLink>

        {/* Temporary */}
        <NavLink to="/metros/new-york-newark-jersey-city">Metros</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
