import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanWaterfallChart as RowanWaterfallChartElement } from "../../waterfall-chart/waterfall-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanWaterfallChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanWaterfallChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
      onRowanPointClick?: (event: CustomEvent) => void;
      onRowanSelectionChange?: (event: CustomEvent) => void;
      onRowanSeriesToggle?: (event: CustomEvent) => void;
      onRowanZoom?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanWaterfallChartElement>
>;
