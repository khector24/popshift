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
        <NavLink to="/states" className="navbar__link">
          States
        </NavLink>
        <NavLink to="/metros/" className="navbar__link">
          Metros
        </NavLink>
        {/* <NavLink to="/dashboard" className="navbar__link">
          Dashboard
        </NavLink> */}

        {/* <NavLink to="/compare" className="navbar__link">
          Compare
        </NavLink> */}
        <NavLink to="/about" className="navbar__link">
          About
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
