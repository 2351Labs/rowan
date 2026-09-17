import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSelect as RowanSelectElement } from "../../select/select.js";

export const RowanSelect: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanSelectElement>
>;
