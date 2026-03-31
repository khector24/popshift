import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        background: "#0b1020",
        borderBottom: "1px solid #283247",
        color: "#f3f7ff",
      }}
    >
      <h2 style={{ margin: 0 }}>PopShift</h2>

      <div style={{ display: "flex", gap: "16px" }}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/rankings">Rankings</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
