
// Utility functions for sites

// Get voltage options based on phase
export const getVoltageOptions = (phase: string) => {
  if (phase === "Monophasé") {
    return [{ value: "120/240", label: "120/240V" }];
  } else if (phase === "Triphasé") {
    return [
      { value: "120/208", label: "120/208V" },
      { value: "347/600", label: "347/600V" }
    ];
  }
  return [];
};

// Class options for sites
export const classOptions = ["1", "2", "3", "4", "4C", "4R", "5", "6"];
