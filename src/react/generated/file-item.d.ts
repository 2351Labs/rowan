import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFileItem as RowanFileItemElement } from "../../file-item/file-item.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanFileItem: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanFileItemElement,
    {
      onRowanRemove?: (event: CustomEvent) => void;
      onRowanRetry?: (event: CustomEvent) => void;
      onRowanCancel?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanFileItemElement>
>;
