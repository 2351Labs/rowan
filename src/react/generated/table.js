/**
 * @generated from custom-elements.json
 */
import "../../table/table.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanTable = createRowanComponent({
  tagName: "rowan-table",
  displayName: "RowanTable",
  events: {
    onRowanSort: "rowan-sort",
    onRowanSelect: "rowan-select",
    onRowanCellChange: "rowan-cell-change",
    onRowanCellAction: "rowan-cell-action",
    onRowanCellBind: "rowan-cell-bind",
    onRowanPageChange: "rowan-page-change",
    onRowanRowActivate: "rowan-row-activate",
    onRowanGroupToggle: "rowan-group-toggle",
    onRowanColumnResize: "rowan-column-resize",
    onRowanColumnReorder: "rowan-column-reorder",
    onRowanEditStart: "rowan-edit-start",
    onRowanEditValidate: "rowan-edit-validate",
    onRowanEditCommit: "rowan-edit-commit",
    onRowanEditCancel: "rowan-edit-cancel",
    onRowanRowEditCommit: "rowan-row-edit-commit",
    onRowanRowEditCancel: "rowan-row-edit-cancel",
  },
});
