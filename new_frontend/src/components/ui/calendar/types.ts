
import * as React from "react";
import { DayPicker, DayClickEventHandler } from "react-day-picker";

// Extend the DayPicker props
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  showAllStandby?: boolean;
};

export interface CalendarNote {
  id: string;
  date: Date;
  content: string;
  userId: string;
  color: string;
}
