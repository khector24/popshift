import "../../styles/components/EducationAttainmentTable.css";

export default function EducationAttainmentTable({
  areaName = "State",
  attainment,
  nationalAttainment,
  attainmentRows,
}) {
  return (
    <table className="education-attainment-table">
      <thead>
        <tr>
          <th>Educational Attainment</th>
          <th>{areaName}</th>
          <th>U.S. Avg.</th>
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
