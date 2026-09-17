import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDialog as RowanDialogElement } from "../../dialog/dialog.js";

export const RowanDialog: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanDialogElement>
>;
