import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDropdown as RowanDropdownElement } from "../../dropdown/dropdown.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDropdown: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanDropdownElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanDropdownElement>
>;
