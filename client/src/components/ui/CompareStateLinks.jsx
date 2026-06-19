import { Link } from "react-router-dom";
import "../../styles/components/CompareStateLinks.css";

import { compareColors } from "../../utils/compareColors.js";

export default function CompareStateLinks({ states }) {
  if (states.length === 0) return null;

  return (
    <section className="compare-state-links">
      <div className="compare-state-links__header">
        <h2>Want to explore one state in detail?</h2>
        <p>
          Open a full state profile with population history, growth details, and
          more context.
        </p>
      </div>

      <div className="compare-state-links__buttons">
        {states.map((state, index) => (
          <Link
            className="compare-state-links__button"
            key={`${state.code}-${index}`}
            to={`/states/${state.code}`}
            state={{
              from: `/compare?states=${states.map((s) => s.code).join(",")}`,
              label: "Compare",
            }}
            style={{
              borderColor: compareColors[index],
              color: compareColors[index],
              backgroundColor: `${compareColors[index]}1f`,
            }}
          >
            {state.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
