import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCalendar as RowanCalendarElement } from "../../calendar/calendar.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanCalendar: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanCalendarElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanCalendarElement>
>;
