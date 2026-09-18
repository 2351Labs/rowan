import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanKpiCard as RowanKpiCardElement } from "../../kpi-card/kpi-card.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanKpiCard: ForwardRefExoticComponent<
  RowanWrapperProps<RowanKpiCardElement, {}> & RefAttributes<RowanKpiCardElement>
>;
