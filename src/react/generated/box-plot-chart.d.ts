import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanBoxPlotChart as RowanBoxPlotChartElement } from "../../box-plot-chart/box-plot-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanBoxPlotChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanBoxPlotChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanBoxPlotChartElement>
>;
