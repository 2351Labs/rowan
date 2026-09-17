import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanEmptyState as RowanEmptyStateElement } from "../../empty-state/empty-state.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanEmptyState: ForwardRefExoticComponent<
  RowanWrapperProps<RowanEmptyStateElement, {}> & RefAttributes<RowanEmptyStateElement>
>;
