import ScoreBar from "./ScoreBar";
import { FaBookReader, FaCalculator } from "react-icons/fa";

export default function EducationStatCard({
  stateName,
  readingScore,
  mathScore,
  nationalReadingScore,
  nationalMathScore,
  readingRank,
  mathRank,
}) {
  return (
    <div className="education-stat-card">
      <ScoreBar
        icon={<FaBookReader />}
        title="Reading"
        stateName={stateName}
        stateScore={readingScore}
        stateRank={readingRank}
        nationalScore={nationalReadingScore}
        topStateName="MA"
        topStateScore={294}
      />

      <ScoreBar
        icon={<FaCalculator />}
        title="Math"
        stateName={stateName}
        stateScore={mathScore}
        stateRank={mathRank}
        nationalScore={nationalMathScore}
        topStateName="MA"
        topStateScore={304}
      />
    </div>
  );
}
