import { useState } from "react";
import "../../styles/components/InfoTooltip.css";

export default function InfoTooltip({ text, symbol = "?" }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleTooltip(event) {
    event.stopPropagation();
    setIsOpen((currentValue) => !currentValue);
  }

  return (
    <span
      className="info-tooltip"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <button
        className="info-tooltip__button"
        type="button"
        onClick={toggleTooltip}
        aria-label={text}
      >
        {symbol}
      </button>

      {isOpen && (
        <span className="info-tooltip__bubble" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
