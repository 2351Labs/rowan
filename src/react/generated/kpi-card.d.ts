import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanKpiCard as RowanKpiCardElement } from "../../kpi-card/kpi-card.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanKpiCard: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanKpiCardElement,
    {
      onRowanPointClick?: (event: CustomEvent) => void;
      onRowanSelectionChange?: (event: CustomEvent) => void;
      onRowanSeriesToggle?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanKpiCardElement>
>;
