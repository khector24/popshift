export const ACS_DATA_YEAR = 2024;

export const CITY_ACS_VARIABLES = {
  socioeconomics: {
    medianHouseholdIncome: "DP03_0062E",
    povertyRate: "DP03_0128PE",
    unemploymentRate: "DP03_0009PE",
    highSchoolOrHigher: "DP02_0067PE",
    bachelorsOrHigher: "DP02_0068PE",
  },

  housing: {
    medianRent: "DP04_0134E",
    medianHomeValue: "DP04_0089E",
    ownerShare: "DP04_0046PE",
    renterShare: "DP04_0047PE",
  },

  transportation: {
    meanCommuteMinutes: "DP03_0025E",
    driveShare: "DP03_0019PE",
    carpoolShare: "DP03_0020PE",
    transitShare: "DP03_0021PE",
    walkShare: "DP03_0022PE",
    workFromHomeShare: "DP03_0024PE",
  },

  demographics: {
    under18Share: "DP05_0019PE",

    age25To34Share: "DP05_0010PE",
    age35To44Share: "DP05_0011PE",

    age45To54Share: "DP05_0012PE",
    age55To59Share: "DP05_0013PE",
    age60To64Share: "DP05_0014PE",

    age65PlusShare: "DP05_0024PE",

    whiteShare: "DP05_0037PE",
    blackShare: "DP05_0045PE",
    asianShare: "DP05_0061PE",
    otherRaceShare: "DP05_0074PE",
    hispanicLatinoShare: "DP05_0090PE",
  },
};
