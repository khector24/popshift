import "../../styles/components/EducationAttainmentTable.css";

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

export default function EducationAttainmentTable({
  stateName,
  attainment,
  nationalAttainment,
}) {
  return (
    <table className="education-attainment-table">
      <thead>
        <tr>
          <th>Educational Attainment</th>
          <th>{stateName}</th>
          <th>U.S. Average</th>
        </tr>
      </thead>

      <tbody>
        {attainmentRows.map((row) => (
          <tr
            key={row.key}
            className={
              row.highlight ? "education-attainment-table__highlight" : ""
            }
          >
            <td>{row.label}</td>
            <td>{attainment[row.key]}%</td>
            <td>{nationalAttainment[row.key]}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
