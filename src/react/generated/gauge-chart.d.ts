import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanGaugeChart as RowanGaugeChartElement } from "../../gauge-chart/gauge-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanGaugeChart: ForwardRefExoticComponent<
  RowanWrapperProps<RowanGaugeChartElement, {}> & RefAttributes<RowanGaugeChartElement>
>;
