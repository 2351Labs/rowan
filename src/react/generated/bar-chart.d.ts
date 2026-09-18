import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanBarChart as RowanBarChartElement } from "../../bar-chart/bar-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanBarChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanBarChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanBarChartElement>
>;
