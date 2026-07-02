import { BsTriangleFill } from "react-icons/bs";
import { VscTriangleDown } from "react-icons/vsc";

import "../../styles/components/ContextIndicator.css";

export default function ContextIndicator({
  direction = "up",
  tone = "neutral",
  value,
  text,
}) {
  const Icon = direction === "down" ? VscTriangleDown : BsTriangleFill;

  return (
    <span className={`context-indicator context-indicator--${tone}`}>
      <Icon className="context-indicator__icon" />
      <span className="context-indicator__value">{value}</span>
      <span className="context-indicator__text">{text}</span>
    </span>
  );
}
