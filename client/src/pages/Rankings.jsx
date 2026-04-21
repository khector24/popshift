import "../styles/pages/Rankings.css";

const rankingsData = [
  {
    rank: 1,
    state: "Texas",
    population: "30M",
    growth: "+1.5%",
    share: "9.2%",
  },
  {
    rank: 2,
    state: "Florida",
    population: "22M",
    growth: "+1.2%",
    share: "6.8%",
  },
  {
    rank: 3,
    state: "California",
    population: "39M",
    growth: "-0.3%",
    share: "11.8%",
  },
  {
    rank: 4,
    state: "New York",
    population: "19M",
    growth: "-0.8%",
    share: "5.7%",
  },
];

function Rankings() {
  return (
    <div className="rankings">
      <h1>State Rankings</h1>

      <div className="rankings__table">
        <div className="rankings__row rankings__header">
          <span>Rank</span>
          <span>State</span>
          <span>Population</span>
          <span>Growth</span>
          <span>Share</span>
        </div>

        {rankingsData.map((item) => (
          <div className="rankings__row" key={item.rank}>
            <span>{item.rank}</span>
            <span>{item.state}</span>
            <span>{item.population}</span>
            <span>{item.growth}</span>
            <span>{item.share}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rankings;
