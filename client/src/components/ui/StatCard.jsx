const cardStyle = {
  padding: "16px",
  background: "#121a2b",
  border: "1px solid #283247",
  flex: "1 1 30%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

function StatCard({ label, value }) {
  return (
    <div style={cardStyle}>
      <p style={{ marginBottom: "8px", color: "#9fb0cc" }}>{label}</p>
      <h3 style={{ margin: 0, fontSize: "28px" }}>{value}</h3>
    </div>
  );
}

export default StatCard;
