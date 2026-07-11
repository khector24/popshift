import {
  FaUsers,
  FaArrowTrendUp,
  FaDollarSign,
  FaHouse,
  FaBuilding,
  FaGraduationCap,
} from "react-icons/fa6";

import BigPictureCard from "./BigPictureCard";
import "../../styles/components/home/BigPicture.css";

export default function BigPicture({ states, economics }) {
  const totalPopulation = states.reduce(
    (sum, state) => sum + state.population,
    0,
  );

  const cards = [
    {
      icon: <FaUsers />,
      title: "U.S. Population",
      value: `${(totalPopulation / 1_000_000).toFixed(2)}M`,
      subtitle: "People",
    },
    {
      icon: <FaArrowTrendUp />,
      title: "Net Migration",
      value: "+1.6M",
      subtitle: "People",
    },
    {
      icon: <FaDollarSign />,
      title: "Median Household Income",
      value: `$${economics.medianIncome.toLocaleString()}`,
    },
    {
      icon: <FaHouse />,
      title: "Median Home Value",
      value: `$${economics.medianHomeValue.toLocaleString()}`,
    },
    {
      icon: <FaBuilding />,
      title: "Median Gross Rent",
      value: `$${economics.medianRent.toLocaleString()}`,
    },
    {
      icon: <FaGraduationCap />,
      title: "College Degree (25+)",
      value: "36.1%",
    },
  ];

  return (
    <section className="big-picture">
      <div className="big-picture__header">
        <h2>The Big Picture (2020–2025)</h2>
      </div>

      <div className="big-picture__grid">
        {cards.map((card) => (
          <BigPictureCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
