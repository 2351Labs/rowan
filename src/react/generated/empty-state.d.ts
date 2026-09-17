import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanEmptyState as RowanEmptyStateElement } from "../../empty-state/empty-state.js";

export const RowanEmptyState: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanEmptyStateElement>
>;
