import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanBulkActionsBar as RowanBulkActionsBarElement } from "../../bulk-actions-bar/bulk-actions-bar.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanBulkActionsBar: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanBulkActionsBarElement,
    {
      onRowanBulkAction?: (event: CustomEvent) => void;
      onRowanClearSelection?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanBulkActionsBarElement>
>;
