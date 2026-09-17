import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDialog as RowanDialogElement } from "../../dialog/dialog.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDialog: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanDialogElement,
    {
      onRowanClose?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanDialogElement>
>;
