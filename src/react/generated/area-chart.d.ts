import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanAreaChart as RowanAreaChartElement } from "../../area-chart/area-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanAreaChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanAreaChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanAreaChartElement>
>;
