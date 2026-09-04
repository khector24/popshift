import "../../styles/components/city/CityDemographicsSection.css";

function DemographicRow({ label, value }) {
  return (
    <div className="city-demographic-row">
      <span>{label}</span>

      <div className="city-demographic-row__bar">
        <span style={{ width: `${Number(value)}%` }} />
      </div>

      <strong>{Number(value).toFixed(1)}%</strong>
    </div>
  );
}

export default function CityDemographicsSection({ acsProfile }) {
  return (
    <section className="city-domain-section">
      <div className="city-domain-section__header">
        <div>
          <span>Demographics</span>
          <h2>Who Lives Here</h2>
        </div>
      </div>

      <div className="city-demographics-layout">
        <div>
          <h3>Age</h3>

          <DemographicRow label="Under 18" value={acsProfile.under_18_share} />

          <DemographicRow label="18–24" value={acsProfile.age_18_24_share} />

          <DemographicRow label="25–34" value={acsProfile.age_25_34_share} />

          <DemographicRow label="35–44" value={acsProfile.age_35_44_share} />

          <DemographicRow label="45–64" value={acsProfile.age_45_64_share} />

          <DemographicRow label="65+" value={acsProfile.age_65_plus_share} />
        </div>

        <div>
          <h3>Race & Ethnicity</h3>

          <DemographicRow label="White" value={acsProfile.white_share} />

          <DemographicRow label="Black" value={acsProfile.black_share} />

          <DemographicRow label="Asian" value={acsProfile.asian_share} />

          <DemographicRow
            label="Other Race"
            value={acsProfile.other_race_share}
          />

          <DemographicRow
            label="Hispanic / Latino"
            value={acsProfile.hispanic_latino_share}
          />
        </div>
      </div>
    </section>
  );
}
