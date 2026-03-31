const cardStyle = {
  padding: "16px",
  background: "#121a2b",
  border: "1px solid #283247",
  flex: 1,
};

function StatCard({ label, value }) {
  return (
    <div style={cardStyle}>
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default StatCard;
