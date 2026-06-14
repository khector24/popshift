import "../../styles/components/ResourceLink.css";
export default function ResourceLink({ label, text, url }) {
  return (
    <p className="resource-link">
      <span className="resource-link__label">{label}: </span>

      <a
        className="resource-link__anchor"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        {text}
      </a>
    </p>
  );
}
