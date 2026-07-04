import "../../styles/components/metro/MetroEducationSnapshot.css";

export default function MetroEducationSnapshot({ metro }) {
  return (
    <article className="metro-education-snapshot">
      <h2>Education Snapshot</h2>
      <p>{metro.metroACSYear} ACS 5-Year Estimates</p>
    </article>
  );
}
