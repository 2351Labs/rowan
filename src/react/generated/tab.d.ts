import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTab as RowanTabElement } from "../../tab/tab.js";

export const RowanTab: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanTabElement>
>;
