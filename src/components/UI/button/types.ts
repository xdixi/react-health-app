import calendar from "@assets/icons/calendar/calendar.png";
import confirm from "@assets/icons/buttons/agree.png";

export const ButtonIcons = {
  calendar,
  confirm,
} as const;

export type ButtonIconKey = keyof typeof ButtonIcons;
