import { useState } from "react";
import { RowanTable } from "@rowan-ui/core/react/table";

const config = {
  rowId: "id",
  selectable: "multiple",
  caption: "Members",
  columns: [{ id: "name", header: "Name" }],
  rows: [
    { id: "1", name: "Ada" },
    { id: "2", name: "Alan" },
    { id: "3", name: "Grace" },
  ],
};

export function MembersTable() {
  const [selected, setSelected] = useState([]);

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <RowanTable
        config={config}
        selected={selected}
        onRowanSelect={(event) => setSelected(event.detail.selected)}
      />
      <p>{selected.length ? `Selected: ${selected.join(", ")}` : "Select one or more rows."}</p>
    </div>
  );
}
