import { FaUserGraduate, FaSchool } from "react-icons/fa6";
import MetroEducationMiniCard from "./MetroEducationMiniCard.jsx";
import EducationAttainmentTable from "../ui/EducationAttainmentTable.jsx";
import ResourceLink from "../ui/ResourceLink.jsx";
import "../../styles/components/metro/MetroEducationSnapshot.css";

function getPointContext(value, average) {
  const difference = value - average;
  const isAbove = difference >= 0;

  return {
    direction: isAbove ? "up" : "down",
    tone: isAbove ? "positive" : "negative",
    value: `${Math.abs(difference).toFixed(1)} pp`,
    text: `${isAbove ? "above" : "below"} U.S. avg (${average}%)`,
  };
}

const metroAttainmentRows = [
  { label: "Less than High School Diploma", key: "lessThanHighSchool" },
  { label: "High School Graduate", key: "highSchoolGraduate" },
  { label: "Some College or Associate Degree", key: "someCollegeOrAssociate" },
  {
    label: "Bachelor's Degree or Higher",
    key: "bachelorsOrHigher",
    highlight: true,
  },
];

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

        <div className="metro-education-snapshot__table">
          <EducationAttainmentTable
            areaName="Metro Area"
            attainment={education.attainment}
            nationalAttainment={nationalAverages.attainment}
            attainmentRows={metroAttainmentRows}
          />
        </div>
      </div>

      <ResourceLink
        label="Source"
        text="2024 ACS 5-Year Table S1501"
        url="https://data.census.gov/table?q=S1501"
      />
    </article>
  );
}
