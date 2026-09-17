import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCommandItem as RowanCommandItemElement } from "../../command-item/command-item.js";

export const RowanCommandItem: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanCommandItemElement>
>;
