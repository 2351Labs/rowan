import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanScatterChart as RowanScatterChartElement } from "../../scatter-chart/scatter-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanScatterChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanScatterChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanScatterChartElement>
>;
