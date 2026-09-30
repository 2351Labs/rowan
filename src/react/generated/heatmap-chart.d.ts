import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanHeatmapChart as RowanHeatmapChartElement } from "../../heatmap-chart/heatmap-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanHeatmapChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanHeatmapChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanHeatmapChartElement>
>;
