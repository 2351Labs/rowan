import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanToast as RowanToastElement } from "../../toast/toast.js";

export const RowanToast: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanToastElement>
>;
