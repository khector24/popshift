import "../../styles/components/ResourceLink.css";

export default function ResourceLink({ label, text, url, links = [] }) {
  const hasLinks = links.length > 0;

  return (
    <p className="resource-link">
      <span className="resource-link__label">{label}: </span>

      {hasLinks ? (
        links.map((link, index) => (
          <span key={link.url}>
            <a
              className="resource-link__anchor"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.text}
            </a>
            {index < links.length - 1 && ", "}
          </span>
        ))
      ) : (
        <a
          className="resource-link__anchor"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {text}
        </a>
      )}
    </p>
  );
}
