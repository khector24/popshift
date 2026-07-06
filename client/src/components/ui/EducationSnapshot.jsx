import "../../styles/components/EducationSnapshot.css";
import ResourceLink from "./ResourceLink";
import EducationScoreCard from "./EducationScoreCard";
import EducationAttainmentTable from "./EducationAttainmentTable";
import EducationStatCard from "./EducationStatCard";
import {
  FaGraduationCap,
  FaUsers,
  FaMedal,
  FaBookOpen,
  FaCalculator,
} from "react-icons/fa6";

const attainmentRows = [
  {
    label: "Less than High School Diploma",
    key: "lessThanHighSchool",
  },
  {
    label: "High School Graduate (or GED)",
    key: "highSchoolGraduate",
  },
  {
    label: "Some College or Associate Degree",
    key: "someCollegeOrAssociate",
  },
  {
    label: "Bachelor's Degree or Higher",
    key: "bachelorsOrHigher",
    highlight: true,
  },
];

export default function EducationSnapshot({
  education,
  national,
  year,
  metadata,
}) {
  return (
    <section className="education-snapshot">
      <h2>Education Snapshot</h2>

      <p className="education-snapshot__description">
        Key education indicators that reflect the skills, knowledge, and
        outcomes of students and adults in the state.
      </p>

      <ResourceLink
        label="Sources"
        links={[
          {
            text: `${year} American Community Survey (ACS) 5-Year Estimates`,
            url: "https://www.census.gov/programs-surveys/acs/",
          },
          {
            text: `${year} NAEP`,
            url: "https://www.nationsreportcard.gov/",
          },
        ]}
      />

      <div className="education-score-grid">
        <EducationScoreCard
          icon={<FaGraduationCap />}
          title="Bachelor's Degree or Higher"
          subtitle={metadata.attainmentPopulation}
          value={education.attainment.bachelorsOrHigher}
          displayValue={`${education.attainment.bachelorsOrHigher}%`}
          nationalValue={national.attainment.bachelorsOrHigher}
          unit="%"
          badge={`#${education.rankings.bachelorsOrHigher} nationally`}
        />

        <EducationScoreCard
          icon={<FaMedal />}
          title="High School Graduate or Higher"
          subtitle={metadata.attainmentPopulation}
          value={education.attainment.highSchoolOrHigher}
          displayValue={`${education.attainment.highSchoolOrHigher}%`}
          nationalValue={national.attainment.highSchoolOrHigher}
          unit="%"
          badge={`#${education.rankings.highSchoolOrHigher} nationally`}
        />

        <EducationScoreCard
          icon={<FaBookOpen />}
          title="NAEP 8th Grade Reading Score"
          subtitle={`${year} Average Score`}
          value={education.naep.reading}
          displayValue={`${education.naep.reading} / 500`}
          nationalValue={national.naep.reading}
          badge={`#${education.rankings.readingScore} nationally`}
        />

        <EducationScoreCard
          icon={<FaCalculator />}
          title="NAEP 8th Grade Math Score"
          subtitle={`${year} Average Score`}
          value={education.naep.math}
          displayValue={`${education.naep.math} / 500`}
          nationalValue={national.naep.math}
          badge={`#${education.rankings.mathScore} nationally`}
        />
      </div>

      <div className="education-snapshot__details">
        <div className="education-snapshot__breakdown">
          <div>
            <h3>Education Attainment Breakdown</h3>
            <p>{metadata.attainmentPopulation}</p>
          </div>

          <EducationAttainmentTable
            stateName={education.name}
            attainment={education.attainment}
            nationalAttainment={national.attainment}
            attainmentRows={attainmentRows}
          />

          <p className="education-snapshot__panel-source">
            Source: {year} ACS 5-Year Estimates (S1501)
            <br />
            Totals may not add to 100% due to rounding.
          </p>
        </div>
        <div className="education-snapshot__comparison">
          <div>
            <h3>Reading and Math Score Comparison</h3>
            <p>{`2024 NAEP Average Score (Grade 8)`}</p>
          </div>

          <EducationStatCard
            stateName={education.name}
            readingScore={education.naep.reading}
            mathScore={education.naep.math}
            nationalReadingScore={national.naep.reading}
            nationalMathScore={national.naep.math}
            readingRank={education.rankings.readingScore}
            mathRank={education.rankings.mathScore}
          />

          <p className="education-snapshot__panel-source">
            Source: {year} NAEP Mathematics & Reading Assessments
          </p>
        </div>
      </div>

      <div className="education-snapshot__why">
        <span className="education-snapshot__why-icon">
          <FaUsers />
        </span>

        <div>
          <h3>Why it matters</h3>

          <p>
            Strong educational outcomes are linked to higher earnings, better
            health, and greater economic growth for communities.
          </p>
        </div>
      </div>
    </section>
  );
}
