import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTextarea as RowanTextareaElement } from "../../textarea/textarea.js";

export const RowanTextarea: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanTextareaElement>
>;
