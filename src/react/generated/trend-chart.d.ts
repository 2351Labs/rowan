import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTrendChart as RowanTrendChartElement } from "../../trend-chart/trend-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTrendChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanTrendChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanTrendChartElement>
>;
