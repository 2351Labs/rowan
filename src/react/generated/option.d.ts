import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanOption as RowanOptionElement } from "../../option/option.js";

export const RowanOption: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanOptionElement>
>;
