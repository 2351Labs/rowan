import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanStackedAreaChart as RowanStackedAreaChartElement } from "../../stacked-area-chart/stacked-area-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanStackedAreaChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanStackedAreaChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
      onRowanPointClick?: (event: CustomEvent) => void;
      onRowanSelectionChange?: (event: CustomEvent) => void;
      onRowanSeriesToggle?: (event: CustomEvent) => void;
      onRowanZoom?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanStackedAreaChartElement>
>;
