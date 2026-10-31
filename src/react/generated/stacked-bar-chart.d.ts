import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanStackedBarChart as RowanStackedBarChartElement } from "../../stacked-bar-chart/stacked-bar-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanStackedBarChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanStackedBarChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
      onRowanPointClick?: (event: CustomEvent) => void;
      onRowanSelectionChange?: (event: CustomEvent) => void;
      onRowanSeriesToggle?: (event: CustomEvent) => void;
      onRowanZoom?: (event: CustomEvent) => void;
      onRowanSync?: (event: CustomEvent) => void;
      onRowanBrush?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanStackedBarChartElement>
>;
