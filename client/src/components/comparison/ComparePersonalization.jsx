import { useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

import Modal from "../ui/Modal.jsx";

import "../../styles/components/comparison/ComparePersonalization.css";

const comparisonReasons = [
  { value: "moving", label: "Moving" },
  { value: "work", label: "Work / career" },
  { value: "school", label: "School / education" },
  { value: "family", label: "Family" },
  { value: "travel", label: "Travel / visiting" },
  { value: "exploring", label: "Just exploring" },
  { value: "other", label: "Other" },
];

const comparisonPriorities = [
  { value: "affordability", label: "Affordability" },
  { value: "housing", label: "Housing" },
  { value: "jobs-income", label: "Jobs & income" },
  { value: "transportation", label: "Transportation" },
  { value: "climate", label: "Climate" },
  { value: "safety", label: "Safety" },
  { value: "education", label: "Education" },
  { value: "population-growth", label: "Population & growth" },
  { value: "lifestyle", label: "Lifestyle" },
];

const climatePreferences = [
  { value: "warmer", label: "Warmer" },
  { value: "cooler", label: "Cooler" },
  { value: "four-seasons", label: "Four seasons" },
  { value: "no-preference", label: "No preference" },
];

export default function ComparePersonalization({
  reason,
  priorities,
  preferences,
  onReasonChange,
  onPrioritiesChange,
  onPreferencesChange,
}) {
  const [showClimatePreferences, setShowClimatePreferences] = useState(false);
  const [showOtherReason, setShowOtherReason] = useState(false);
  const [otherReasonDraft, setOtherReasonDraft] = useState(
    preferences.otherReason ?? "",
  );

  function handleReasonClick(reasonValue) {
    if (reasonValue === "other") {
      if (reason !== "other") {
        onReasonChange("other");
      }

      setOtherReasonDraft(preferences.otherReason ?? "");
      setShowOtherReason(true);
      return;
    }

    onReasonChange(reason === reasonValue ? null : reasonValue);
  }

  function handlePriorityClick(priority) {
    const isSelected = priorities.includes(priority);

    if (priority === "climate") {
      if (!isSelected) {
        onPrioritiesChange([...priorities, priority]);
      }

      setShowClimatePreferences(true);
      return;
    }

    if (isSelected) {
      onPrioritiesChange(
        priorities.filter((currentPriority) => currentPriority !== priority),
      );
      return;
    }

    onPrioritiesChange([...priorities, priority]);
  }

  function removeClimatePriority(event) {
    event.stopPropagation();

    onPrioritiesChange(
      priorities.filter((priority) => priority !== "climate"),
    );

    onPreferencesChange({
      ...preferences,
      climate: null,
    });
  }

  function saveOtherReason() {
    onPreferencesChange({
      ...preferences,
      otherReason: otherReasonDraft.trim(),
    });

    setShowOtherReason(false);
  }

  return (
    <>
      <div className="compare-personalization">
        <div className="compare-personalization__group">
          <div className="compare-personalization__group-heading">
            <h3>Why are you comparing?</h3>
            <span>Optional</span>
          </div>

          <div className="compare-personalization__options">
            {comparisonReasons.map((option) => {
              const isSelected = reason === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`compare-personalization__option ${
                    isSelected
                      ? "compare-personalization__option--selected"
                      : ""
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => handleReasonClick(option.value)}
                >
                  {isSelected && <FaCheck />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="compare-personalization__group">
          <div className="compare-personalization__group-heading">
            <h3>What matters most to you?</h3>
            <span>Optional</span>
          </div>

          <div className="compare-personalization__options">
            {comparisonPriorities.map((option) => {
              const isSelected = priorities.includes(option.value);
              const isClimate = option.value === "climate";

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`compare-personalization__option ${
                    isSelected
                      ? "compare-personalization__option--selected"
                      : ""
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => handlePriorityClick(option.value)}
                >
                  {isSelected && <FaCheck />}

                  <span>
                    {option.label}
                    {isClimate &&
                      isSelected &&
                      preferences.climate &&
                      preferences.climate !== "no-preference" &&
                      ` · ${
                        climatePreferences.find(
                          (item) => item.value === preferences.climate,
                        )?.label
                      }`}
                  </span>

                  {isClimate && isSelected && (
                    <span
                      className="compare-personalization__remove"
                      role="button"
                      tabIndex={0}
                      aria-label="Remove climate priority"
                      onClick={removeClimatePriority}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          removeClimatePriority(event);
                        }
                      }}
                    >
                      <FaXmark />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showClimatePreferences}
        title="Climate preference"
        description="What kind of climate would you prefer?"
        onClose={() => setShowClimatePreferences(false)}
      >
        <div className="compare-personalization__climate-options">
          {climatePreferences.map((option) => {
            const isSelected = preferences.climate === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`compare-personalization__climate-option ${
                  isSelected
                    ? "compare-personalization__climate-option--selected"
                    : ""
                }`}
                aria-pressed={isSelected}
                onClick={() =>
                  onPreferencesChange({
                    ...preferences,
                    climate: option.value,
                  })
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button
          className="compare-personalization__modal-done"
          type="button"
          onClick={() => setShowClimatePreferences(false)}
        >
          Done
        </button>
      </Modal>

      <Modal
        isOpen={showOtherReason}
        title="What are you comparing for?"
        description="Add a little context if none of the options quite fit."
        onClose={() => setShowOtherReason(false)}
      >
        <label
          className="compare-personalization__other-label"
          htmlFor="compare-other-reason"
        >
          Your reason
        </label>

        <textarea
          id="compare-other-reason"
          className="compare-personalization__other-input"
          value={otherReasonDraft}
          maxLength={200}
          rows={3}
          placeholder="For example, I'm looking for somewhere to retire..."
          onChange={(event) => setOtherReasonDraft(event.target.value)}
        />

        <div className="compare-personalization__character-count">
          {otherReasonDraft.length}/200
        </div>

        <button
          className="compare-personalization__modal-done"
          type="button"
          onClick={saveOtherReason}
        >
          Done
        </button>
      </Modal>
    </>
  );
}
