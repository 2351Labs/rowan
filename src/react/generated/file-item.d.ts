import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFileItem as RowanFileItemElement } from "../../file-item/file-item.js";

export const RowanFileItem: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanFileItemElement>
>;
