import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanPagination as RowanPaginationElement } from "../../pagination/pagination.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanPagination: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanPaginationElement,
    {
      onRowanPageChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanPaginationElement>
>;
