import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "@vnedyalk0v/react19-simple-maps";
import { feature } from "topojson-client";

import "../../styles/components/PopulationChangeMap.css";

const geoUrl = "/maps/states-10m.json";

export default function PopulationChangeMap({ states }) {
  const [geographyData, setGeographyData] = useState([]);

  useEffect(() => {
    async function loadMapData() {
      const response = await fetch(geoUrl);
      const topology = await response.json();

      const geoJson = feature(topology, topology.objects.states);

      setGeographyData(geoJson.features);
    }

    loadMapData();
  }, []);

  const statesByCode = {};

  states.forEach((state) => {
    statesByCode[state.code] = state;
  });

  function getMapColor(growth) {
    if (growth === undefined || growth === null) return "#94a3b8";
    if (growth >= 5) return "#2563eb";
    if (growth >= 2.5) return "#60a5fa";
    if (growth > 0) return "#bfdbfe";
    if (growth === 0) return "#cbd5e1";
    if (growth > -2.5) return "#fca5a5";
    if (growth > -5) return "#f87171";
    return "#ef4444";
  }

  return (
    <div className="population-change-map">
      <div className="population-change-map__content">
        <div className="population-change-map__legend">
          <div>
            <span style={{ background: "#2563eb" }}></span>5%+
          </div>
          <div>
            <span style={{ background: "#60a5fa" }}></span>2.5% to 5%
          </div>
          <div>
            <span style={{ background: "#bfdbfe" }}></span>0% to 2.5%
          </div>
          <div>
            <span style={{ background: "#cbd5e1" }}></span>0%
          </div>
          <div>
            <span style={{ background: "#fca5a5" }}></span>-2.5% to 0%
          </div>
          <div>
            <span style={{ background: "#f87171" }}></span>-5% to -2.5%
          </div>
          <div>
            <span style={{ background: "#ef4444" }}></span>-5% or less
          </div>
        </div>

        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geographyData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateData = statesByCode[geo.id];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className="population-change-map__state"
                    data-name={stateData?.name}
                    style={{
                      default: {
                        fill: getMapColor(stateData?.growth),
                        outline: "none",
                      },
                      hover: {
                        fill: "#60a5fa",
                        outline: "none",
                      },
                      pressed: {
                        fill: getMapColor(stateData?.growth),
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div className="population-change-map__scale">
        <div className="population-change-map__gradient"></div>

        <div className="population-change-map__scale-labels">
          <span>-5%</span>
          <span>0%</span>
          <span>+5%</span>
        </div>
      </div>
    </div>
  );
}
