import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

import "../../styles/components/Modal.css";

export default function Modal({
  isOpen,
  title,
  description,
  onClose,
  children,
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal__overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <FaXmark />
        </button>

        <div className="modal__heading">
          <h3 id="modal-title">{title}</h3>
          {description && <p>{description}</p>}
        </div>

        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
}
