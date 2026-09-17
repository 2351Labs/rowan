import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDropzone as RowanDropzoneElement } from "../../dropzone/dropzone.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDropzone: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanDropzoneElement,
    {
      onRowanFilesAdd?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanDropzoneElement>
>;
