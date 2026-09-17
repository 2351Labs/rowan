import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRichTextEditor as RowanRichTextEditorElement } from "../../rich-text-editor/rich-text-editor.js";

export const RowanRichTextEditor: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanRichTextEditorElement>
>;
