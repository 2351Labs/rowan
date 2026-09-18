import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRowDetailsPanel as RowanRowDetailsPanelElement } from "../../row-details-panel/row-details-panel.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanRowDetailsPanel: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanRowDetailsPanelElement,
    {
      onRowanClose?: (event: CustomEvent) => void;
      onRowanNavigate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanRowDetailsPanelElement>
>;
