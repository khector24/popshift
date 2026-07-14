import { TbTriangleFilled } from "react-icons/tb";
import { TbTriangleInvertedFilled } from "react-icons/tb";

import "../../styles/components/ContextIndicator.css";

export default function ContextIndicator({
  direction = "up",
  tone = "neutral",
  value,
  text,
}) {
  const Icon =
    direction === "down" ? TbTriangleInvertedFilled : TbTriangleFilled;

  return (
    <span className={`context-indicator context-indicator--${tone}`}>
      <Icon className="context-indicator__icon" />
      <span className="context-indicator__value">{value}</span>
      <span className="context-indicator__text">{text}</span>
    </span>
  );
}
