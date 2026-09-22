import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanBulletChart as RowanBulletChartElement } from "../../bullet-chart/bullet-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanBulletChart: ForwardRefExoticComponent<
  RowanWrapperProps<RowanBulletChartElement, {}> & RefAttributes<RowanBulletChartElement>
>;
