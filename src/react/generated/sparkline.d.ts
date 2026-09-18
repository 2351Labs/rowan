import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSparkline as RowanSparklineElement } from "../../sparkline/sparkline.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSparkline: ForwardRefExoticComponent<
  RowanWrapperProps<RowanSparklineElement, {}> & RefAttributes<RowanSparklineElement>
>;
