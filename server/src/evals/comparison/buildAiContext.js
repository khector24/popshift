function topStateFlows(flows, limit = 5) {
  if (!Array.isArray(flows)) {
    return [];
  }

  return flows
    .slice()
    .sort((a, b) => Number(b.movers) - Number(a.movers))
    .slice(0, limit)
    .map((flow) => ({
      state: flow.state,
      code: flow.code,
      movers: flow.movers,
    }));
}

function topMetroFlows(flows, limit = 5) {
  if (!Array.isArray(flows)) {
    return [];
  }

  return flows
    .slice()
    .sort((a, b) => Number(b.movers) - Number(a.movers))
    .slice(0, limit)
    .map((flow) => ({
      name: flow.name,
      slug: flow.slug,
      cbsa: flow.cbsa,
      movers: flow.movers,
    }));
}

function compactState(place) {
  return {
    identity: place.identity,
    population: place.population,
    economics: place.economics,
    education: place.education,

    migration: {
      latestYear:
        place.migration?.latestYear ?? null,

      totalInbound:
        place.migration?.totalInbound ?? null,

      totalOutbound:
        place.migration?.totalOutbound ?? null,

      netMigration:
        place.migration?.netMigration ?? null,

      topInbound: topStateFlows(
        place.migration?.inbound
      ),

      topOutbound: topStateFlows(
        place.migration?.outbound
      ),

      history:
        place.migration?.history?.map(
          (record) => ({
            year: record.year,
            totalInbound:
              record.totalInbound ?? null,
            totalOutbound:
              record.totalOutbound ?? null,
            netMigration:
              record.netMigration ?? null,
          })
        ) ?? [],
    },
  };
}

function compactMetro(place) {
  return {
    identity: place.identity,
    population: place.population,
    economics: place.economics,
    education: place.education,
    housing: place.housing,
    transportation: place.transportation,

    migration: {
      year:
        place.migration?.year ?? null,

      totalInbound:
        place.migration?.totalInbound ?? null,

      totalOutbound:
        place.migration?.totalOutbound ?? null,

      netMigration:
        place.migration?.netMigration ?? null,

      topInbound: topMetroFlows(
        place.migration?.inbound
      ),

      topOutbound: topMetroFlows(
        place.migration?.outbound
      ),
    },
  };
}

export function buildAiContext(comparisonContext) {
  if (!comparisonContext) {
    return null;
  }

  const {
    geographyType,
    places,
    personalization,
  } = comparisonContext;

  if (geographyType === "state") {
    return {
      geographyType,
      places: places.map(compactState),
      personalization,
    };
  }

  if (geographyType === "metro") {
    return {
      geographyType,
      places: places.map(compactMetro),
      personalization,
    };
  }

  return comparisonContext;
}
