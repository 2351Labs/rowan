import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTable as RowanTableElement } from "../../table/table.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTable: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanTableElement,
    {
      onRowanSort?: (event: CustomEvent) => void;
      onRowanSortChange?: (event: CustomEvent) => void;
      onRowanColumnFilter?: (event: CustomEvent) => void;
      onRowanSelect?: (event: CustomEvent) => void;
      onRowanCellChange?: (event: CustomEvent) => void;
      onRowanCellAction?: (event: CustomEvent) => void;
      onRowanCellBind?: (event: CustomEvent) => void;
      onRowanPageChange?: (event: CustomEvent) => void;
      onRowanRowActivate?: (event: CustomEvent) => void;
      onRowanGroupToggle?: (event: CustomEvent) => void;
      onRowanColumnResize?: (event: CustomEvent) => void;
      onRowanColumnReorder?: (event: CustomEvent) => void;
      onRowanEditStart?: (event: CustomEvent) => void;
      onRowanEditValidate?: (event: CustomEvent) => void;
      onRowanEditCommit?: (event: CustomEvent) => void;
      onRowanEditCancel?: (event: CustomEvent) => void;
      onRowanRowEditCommit?: (event: CustomEvent) => void;
      onRowanRowEditCancel?: (event: CustomEvent) => void;
      onRowanDataRequest?: (event: CustomEvent) => void;
      onRowanDataLoad?: (event: CustomEvent) => void;
      onRowanDataError?: (event: CustomEvent) => void;
      onRowanCopy?: (event: CustomEvent) => void;
      onRowanExport?: (event: CustomEvent) => void;
      onRowanPaste?: (event: CustomEvent) => void;
      onRowanPasteResult?: (event: CustomEvent) => void;
      onRowanTreeToggle?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanTableElement>
>;
