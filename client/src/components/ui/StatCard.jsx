import { useState } from "react";

function StatCard({ label, value }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    padding: "20px",
    borderRadius: "12px",
    background: hovered ? "#162036" : "#121a2b",
    border: "1px solid #283247",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    minHeight: "120px",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p style={{ marginBottom: "8px", color: "#9fb0cc" }}>{label}</p>
      <h3 style={{ margin: 0, fontSize: "28px" }}>{value}</h3>
    </div>
  );
}

export default StatCard;
