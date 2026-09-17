import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSplitPane as RowanSplitPaneElement } from "../../split-pane/split-pane.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSplitPane: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanSplitPaneElement,
    {
      onRowanResize?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanSplitPaneElement>
>;
