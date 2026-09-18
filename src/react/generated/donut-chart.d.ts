import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDonutChart as RowanDonutChartElement } from "../../donut-chart/donut-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDonutChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanDonutChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanDonutChartElement>
>;
