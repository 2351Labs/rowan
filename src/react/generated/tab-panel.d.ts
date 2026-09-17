import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTabPanel as RowanTabPanelElement } from "../../tab-panel/tab-panel.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTabPanel: ForwardRefExoticComponent<
  RowanWrapperProps<RowanTabPanelElement, {}> & RefAttributes<RowanTabPanelElement>
>;
