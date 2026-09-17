import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTable as RowanTableElement } from "../../table/table.js";

export const RowanTable: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanTableElement>
>;
