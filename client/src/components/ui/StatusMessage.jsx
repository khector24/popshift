import "../../styles/components/StatusMessage.css";

export default function StatusMessage({ type = "info", title, message }) {
  return (
    <div className={`status-message status-message--${type}`}>
      {title && <h2>{title}</h2>}
      {message && <p>{message}</p>}
    </div>
  );
}
