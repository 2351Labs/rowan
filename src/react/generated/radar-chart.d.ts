import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRadarChart as RowanRadarChartElement } from "../../radar-chart/radar-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanRadarChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanRadarChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanRadarChartElement>
>;
