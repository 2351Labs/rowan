import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanStackedBarChart as RowanStackedBarChartElement } from "../../stacked-bar-chart/stacked-bar-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanStackedBarChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanStackedBarChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanStackedBarChartElement>
>;
