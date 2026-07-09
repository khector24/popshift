import MetroCard from "./MetroCard";
import "../../styles/components/metro-directory/MetroGrid.css";

export default function MetroGrid({ metros }) {
  return (
    <section className="metro-grid">
      {metros.map((metro) => (
        <MetroCard key={metro.slug} metro={metro} />
      ))}
    </section>
  );
}
