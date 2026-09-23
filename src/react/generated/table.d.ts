import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTable as RowanTableElement } from "../../table/table.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTable: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanTableElement,
    {
      onRowanSort?: (event: CustomEvent) => void;
      onRowanSelect?: (event: CustomEvent) => void;
      onRowanCellChange?: (event: CustomEvent) => void;
      onRowanCellAction?: (event: CustomEvent) => void;
      onRowanCellBind?: (event: CustomEvent) => void;
      onRowanPageChange?: (event: CustomEvent) => void;
      onRowanRowActivate?: (event: CustomEvent) => void;
      onRowanGroupToggle?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanTableElement>
>;
