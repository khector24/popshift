import { FaUserGraduate, FaSchool } from "react-icons/fa6";
import MetroEducationMiniCard from "./MetroEducationMiniCard.jsx";
import "../../styles/components/metro/MetroEducationSnapshot.css";

function getPointContext(value, average) {
  const difference = value - average;
  const isAbove = difference >= 0;

  return {
    direction: isAbove ? "up" : "down",
    tone: isAbove ? "positive" : "negative",
    value: `${Math.abs(difference).toFixed(1)} pp`,
    text: `${isAbove ? "above" : "below"} U.S. metro avg (${average}%)`,
  };
}

export default function MetroEducationSnapshot({
  education,
  nationalAverages,
  year,
}) {
  return (
    <article className="metro-education-snapshot">
      <h2>Education Snapshot</h2>
      <p>{year} ACS 5-Year Estimates</p>

      <div className="metro-education-snapshot__content">
        <div className="metro-education-snapshot__stats">
          <MetroEducationMiniCard
            icon={<FaUserGraduate />}
            value={education.bachelorsOrHigher}
            label="Bachelor's Degree or Higher"
            context={getPointContext(
              education.bachelorsOrHigher,
              nationalAverages.bachelorsOrHigher,
            )}
          />

          <MetroEducationMiniCard
            icon={<FaSchool />}
            value={education.highSchoolOrHigher}
            label="High School Graduate or Higher"
            context={getPointContext(
              education.highSchoolOrHigher,
              nationalAverages.highSchoolOrHigher,
            )}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Educational Attainment</th>
              <th>Metro Area</th>
              <th>U.S. Average</th>
            </tr>
          </thead>
        </table>
      </div>
    </article>
  );
}
