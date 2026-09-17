import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTree as RowanTreeElement } from "../../tree/tree.js";

export const RowanTree: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanTreeElement>
>;
