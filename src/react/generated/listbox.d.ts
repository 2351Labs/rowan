import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanListbox as RowanListboxElement } from "../../listbox/listbox.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanListbox: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanListboxElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanListboxElement>
>;
