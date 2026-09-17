import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRichTextEditor as RowanRichTextEditorElement } from "../../rich-text-editor/rich-text-editor.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanRichTextEditor: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanRichTextEditorElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanRichTextEditorElement>
>;
