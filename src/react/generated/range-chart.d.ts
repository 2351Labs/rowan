import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRangeChart as RowanRangeChartElement } from "../../range-chart/range-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanRangeChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanRangeChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanRangeChartElement>
>;
