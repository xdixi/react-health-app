import type { DayDataKeys } from "../types";

const setPositionButtonInTextarea = (
  key: Exclude<DayDataKeys, "dayRating">,
  width: number
): { left: string } => {
  switch (key) {
    case "pressureAndPulse":
      return { left: `${width - 23}px` };
    case "wellBeing":
      return { left: `${width - 23}px` };
    case "pills":
      return { left: `${width - 23}px` };
    default:
      return { left: `${width - 23}px` };
  }
};

export { setPositionButtonInTextarea };
