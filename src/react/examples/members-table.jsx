import { useEffect, useRef, useState } from "react";
import { useRowanElement } from "@rowan-ui/core/react";

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
  const tableRef = useRef(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    void import("@rowan-ui/core/table");
  }, []);

  useRowanElement(tableRef, {
    properties: { config, selected },
    events: {
      "rowan-select": (event) => {
        setSelected(event.detail.selected);
      },
    },
  });

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <rowan-table ref={tableRef} />
      <p>{selected.length ? `Selected: ${selected.join(", ")}` : "Select one or more rows."}</p>
    </div>
  );
}
