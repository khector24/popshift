import "../../styles/components/metro-directory/MetroFilters.css";

export default function MetroFilters({ states }) {
  return (
    <aside className="metro-filters">
      <div className="metro-filters__header">
        <h2>Filters</h2>
        <button type="button">Clear all</button>
      </div>

      <section className="metro-filters__section">
        <h3>Population</h3>

        <div className="metro-filters__range-row">
          <input type="text" value="0" readOnly />
          <span>to</span>
          <input type="text" value="20M+" readOnly />
        </div>

        <input className="metro-filters__range" type="range" />
      </section>

      <section className="metro-filters__section">
        <h3>Growth Since 2020</h3>

        <label className="metro-filters__checkbox-row">
          <input type="checkbox" />
          <span>Growing</span>
          <strong>247</strong>
        </label>

        <label className="metro-filters__checkbox-row">
          <input type="checkbox" />
          <span>Declining</span>
          <strong className="metro-filters__negative">59</strong>
        </label>

        <label className="metro-filters__checkbox-row">
          <input type="checkbox" />
          <span>No Change</span>
          <strong>75</strong>
        </label>
      </section>

      <section className="metro-filters__section">
        <h3>States</h3>

        <input
          className="metro-filters__search"
          type="text"
          placeholder="Search states..."
        />

        <label className="metro-filters__checkbox-row">
          <input type="checkbox" />
          <span>All States</span>
        </label>

        {states.map((state) => (
          <label className="metro-filters__checkbox-row" key={state.code}>
            <input type="checkbox" />
            <span>{state.name}</span>
            <strong>12</strong>
          </label>
        ))}
      </section>

      <section className="metro-filters__section">
        <h3>Region</h3>

        <label className="metro-filters__checkbox-row">
          <input type="checkbox" />
          <span>Northeast</span>
          <strong>74</strong>
        </label>

        <label className="metro-filters__checkbox-row">
          <input type="checkbox" />
          <span>Midwest</span>
          <strong>85</strong>
        </label>

        <label className="metro-filters__checkbox-row">
          <input type="checkbox" />
          <span>South</span>
          <strong>142</strong>
        </label>

        <label className="metro-filters__checkbox-row">
          <input type="checkbox" />
          <span>West</span>
          <strong>80</strong>
        </label>
      </section>

      <button className="metro-filters__apply" type="button">
        Apply Filters
      </button>
    </aside>
  );
}
