import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanAlert as RowanAlertElement } from "../../alert/alert.js";

export const RowanAlert: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanAlertElement>
>;
