import {
  FaBus,
  FaCar,
  FaClock,
  FaHouseLaptop,
  FaPersonWalking,
  FaPeopleGroup,
} from "react-icons/fa6";

import "../../styles/components/city/CityTransportationSection.css";

function TransportationCard({ icon, label, value }) {
  return (
    <article className="city-transport-card">
      <div>{icon}</div>

      <span>{label}</span>

      <strong>{value}</strong>
    </article>
  );
}

export default function CityTransportationSection({ acsProfile }) {
  return (
    <section className="city-domain-section">
      <div className="city-domain-section__header">
        <div>
          <span>Transportation</span>
          <h2>Getting Around</h2>
        </div>
      </div>

      <div className="city-transport-grid">
        <TransportationCard
          icon={<FaClock />}
          label="Mean Commute"
          value={`${Number(acsProfile.mean_commute_minutes).toFixed(1)} min`}
        />

        <TransportationCard
          icon={<FaCar />}
          label="Drive Alone"
          value={`${Number(acsProfile.drive_share).toFixed(1)}%`}
        />

        <TransportationCard
          icon={<FaPeopleGroup />}
          label="Carpool"
          value={`${Number(acsProfile.carpool_share).toFixed(1)}%`}
        />

        <TransportationCard
          icon={<FaBus />}
          label="Public Transit"
          value={`${Number(acsProfile.transit_share).toFixed(1)}%`}
        />

        <TransportationCard
          icon={<FaPersonWalking />}
          label="Walk"
          value={`${Number(acsProfile.walk_share).toFixed(1)}%`}
        />

        <TransportationCard
          icon={<FaHouseLaptop />}
          label="Work From Home"
          value={`${Number(acsProfile.work_from_home_share).toFixed(1)}%`}
        />
      </div>
    </section>
  );
}
