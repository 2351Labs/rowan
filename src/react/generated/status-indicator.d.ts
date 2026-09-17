import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanStatusIndicator as RowanStatusIndicatorElement } from "../../status-indicator/status-indicator.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanStatusIndicator: ForwardRefExoticComponent<
  RowanWrapperProps<RowanStatusIndicatorElement, {}> & RefAttributes<RowanStatusIndicatorElement>
>;
