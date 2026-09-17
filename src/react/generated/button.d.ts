import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanButton as RowanButtonElement } from "../../button/button.js";

export const RowanButton: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanButtonElement>
>;
