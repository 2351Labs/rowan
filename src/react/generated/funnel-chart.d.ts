import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFunnelChart as RowanFunnelChartElement } from "../../funnel-chart/funnel-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanFunnelChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanFunnelChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanFunnelChartElement>
>;
