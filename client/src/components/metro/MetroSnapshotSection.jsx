import {
  FaWallet,
  FaPeopleRoof,
  FaBuilding,
  FaHouse,
  FaPercent,
  FaCarSide,
  FaTrainSubway,
  FaHouseLaptop,
  FaClock,
} from "react-icons/fa6";

import MetroSnapshotCard from "./MetroSnapshotCard.jsx";

import "../../styles/components/metro/MetroSnapshotSection.css";

function percentContext(value, average, averageText, positiveWhen = "higher") {
  const difference = ((value - average) / average) * 100;
  const isAbove = difference >= 0;
  const isPositive = positiveWhen === "higher" ? isAbove : !isAbove;

  return {
    tone: isPositive ? "positive" : "negative",
    direction: isAbove ? "up" : "down",
    value: `${Math.abs(difference).toFixed(0)}%`,
    text: `${isAbove ? "above" : "below"} U.S. metro avg (${averageText})`,
  };
}

function pointContext(value, average, averageText, positiveWhen = "higher") {
  const difference = value - average;
  const isAbove = difference >= 0;
  const isPositive = positiveWhen === "higher" ? isAbove : !isAbove;

  return {
    tone: isPositive ? "positive" : "negative",
    direction: isAbove ? "up" : "down",
    value: `${Math.abs(difference).toFixed(1)} pp`,
    text: `${isAbove ? "above" : "below"} U.S. metro avg (${averageText})`,
  };
}

export default function MetroSnapshotSection({ metro }) {
  const economicItems = [
    {
      icon: FaWallet,
      iconClass: "green",
      label: "Median Household Income",
      value: `$${metro.economics.medianHouseholdIncome.toLocaleString()}`,
      context: percentContext(
        metro.economics.medianHouseholdIncome,
        metro.nationalAverages.economics.medianHouseholdIncome,
        `$${metro.nationalAverages.economics.medianHouseholdIncome.toLocaleString()}`,
        "higher",
      ),
    },
    {
      icon: FaPeopleRoof,
      iconClass: "orange",
      label: "Poverty Rate",
      value: `${metro.economics.povertyRate}%`,
      context: pointContext(
        metro.economics.povertyRate,
        metro.nationalAverages.economics.povertyRate,
        `${metro.nationalAverages.economics.povertyRate}%`,
        "lower",
      ),
    },
    {
      icon: FaBuilding,
      iconClass: "purple",
      label: "Median Gross Rent",
      value: `$${metro.housing.medianGrossRent.toLocaleString()} / mo`,
      context: percentContext(
        metro.housing.medianGrossRent,
        metro.nationalAverages.housing.medianGrossRent,
        `$${metro.nationalAverages.housing.medianGrossRent.toLocaleString()}`,
        "lower",
      ),
    },
    {
      icon: FaHouse,
      iconClass: "blue",
      label: "Median Home Value",
      value: `$${metro.housing.medianHomeValue.toLocaleString()}`,
      context: percentContext(
        metro.housing.medianHomeValue,
        metro.nationalAverages.housing.medianHomeValue,
        `$${metro.nationalAverages.housing.medianHomeValue.toLocaleString()}`,
        "lower",
      ),
    },
  ];

  const housingItems = [
    {
      icon: FaBuilding,
      iconClass: "purple",
      label: "Median Rent",
      value: `$${metro.housing.medianGrossRent.toLocaleString()} / mo`,
      context: percentContext(
        metro.housing.medianGrossRent,
        metro.nationalAverages.housing.medianGrossRent,
        `$${metro.nationalAverages.housing.medianGrossRent.toLocaleString()}`,
        "lower",
      ),
    },
    {
      icon: FaHouse,
      iconClass: "blue",
      label: "Median Home Value",
      value: `$${metro.housing.medianHomeValue.toLocaleString()}`,
      context: percentContext(
        metro.housing.medianHomeValue,
        metro.nationalAverages.housing.medianHomeValue,
        `$${metro.nationalAverages.housing.medianHomeValue.toLocaleString()}`,
        "lower",
      ),
    },
    {
      icon: FaPercent,
      iconClass: "orange",
      label: "Rent as % of Income",
      value: `${metro.housing.rentAsPercentOfIncome}%`,
      context: pointContext(
        metro.housing.rentAsPercentOfIncome,
        metro.nationalAverages.housing.rentAsPercentOfIncome,
        `${metro.nationalAverages.housing.rentAsPercentOfIncome}%`,
        "lower",
      ),
    },
    {
      icon: FaPercent,
      iconClass: "purple",
      label: "Home Value / Income",
      value: `${metro.housing.homeValueToIncome.toFixed(1)}×`,
      context: pointContext(
        metro.housing.homeValueToIncome,
        metro.nationalAverages.housing.homeValueToIncome,
        `${metro.nationalAverages.housing.homeValueToIncome.toFixed(1)}×`,
        "lower",
      ),
    },
  ];

  const transportationItems = [
    {
      icon: FaCarSide,
      iconClass: "blue",
      label: "Drive Alone",
      value: `${metro.transportation.driveAlone}%`,
      context: pointContext(
        metro.transportation.driveAlone,
        metro.nationalAverages.transportation.driveAlone,
        `${metro.nationalAverages.transportation.driveAlone}%`,
        "lower",
      ),
    },
    {
      icon: FaTrainSubway,
      iconClass: "blue",
      label: "Public Transit",
      value: `${metro.transportation.publicTransit}%`,
      context: pointContext(
        metro.transportation.publicTransit,
        metro.nationalAverages.transportation.publicTransit,
        `${metro.nationalAverages.transportation.publicTransit}%`,
        "higher",
      ),
    },
    {
      icon: FaHouseLaptop,
      iconClass: "green",
      label: "Work From Home",
      value: `${metro.transportation.workFromHome}%`,
      context: pointContext(
        metro.transportation.workFromHome,
        metro.nationalAverages.transportation.workFromHome,
        `${metro.nationalAverages.transportation.workFromHome}%`,
        "higher",
      ),
    },
    {
      icon: FaClock,
      iconClass: "purple",
      label: "Avg. Commute Time",
      value: `${metro.transportation.averageCommuteMinutes.toFixed(1)} min`,
      context: pointContext(
        metro.transportation.averageCommuteMinutes,
        metro.nationalAverages.transportation.averageCommuteMinutes,
        `${metro.nationalAverages.transportation.averageCommuteMinutes.toFixed(1)} min`,
        "lower",
      ),
    },
  ];

  return (
    <section className="metro-snapshot-section">
      <MetroSnapshotCard
        title="Economic Snapshot"
        subtitle={`${metro.metroACSYear} ACS 5-Year Estimates`}
        items={economicItems}
      />

      <MetroSnapshotCard
        title="Housing & Affordability"
        subtitle={`${metro.metroACSYear} ACS 5-Year Estimates`}
        items={housingItems}
      />

      <MetroSnapshotCard
        title="Transportation Snapshot"
        subtitle={`${metro.metroACSYear} ACS 5-Year Estimates`}
        items={transportationItems}
      />
    </section>
  );
}
