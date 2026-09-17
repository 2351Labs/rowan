import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanConfirmDialog as RowanConfirmDialogElement } from "../../confirm-dialog/confirm-dialog.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanConfirmDialog: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanConfirmDialogElement,
    {
      onRowanConfirm?: (event: CustomEvent) => void;
      onRowanCancel?: (event: CustomEvent) => void;
      onRowanClose?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanConfirmDialogElement>
>;
