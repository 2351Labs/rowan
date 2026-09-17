import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFileUpload as RowanFileUploadElement } from "../../file-upload/file-upload.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanFileUpload: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanFileUploadElement,
    {
      onRowanFilesAdd?: (event: CustomEvent) => void;
      onRowanFileRemove?: (event: CustomEvent) => void;
      onRowanFileRetry?: (event: CustomEvent) => void;
      onRowanFileCancel?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanFileUploadElement>
>;
