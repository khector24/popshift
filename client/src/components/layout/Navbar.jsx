import { NavLink } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import "../../styles/components/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__content">
        <NavLink className="navbar__logo" to="/">
          PopShift
        </NavLink>

        <GlobalSearch />

        <div className="navbar__links">
          <NavLink to="/states">States</NavLink>
          <NavLink to="/metros">Metros</NavLink>
          {/* Future */}
          {/* <NavLink to="/explore-moving">Explore Moving</NavLink>
          <NavLink to="/articles">Articles</NavLink> */}
          <NavLink to="/about">About</NavLink>
          <NavLink to="/dashboard">dashboard</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
