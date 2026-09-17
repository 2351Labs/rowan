import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import "../button/button.js";
import "../table/table.js";
import "../text-field/text-field.js";
import { useRowanElement } from "./index.js";

if (!customElements.get("rowan-react-story")) {
  customElements.define(
    "rowan-react-story",
    class extends HTMLElement {
      connectedCallback() {
        this._root = createRoot(this);
        this._root.render(this.story);
      }

      disconnectedCallback() {
        this._root?.unmount();
        this._root = null;
      }
    },
  );
}

function renderReact(story) {
  const host = document.createElement("rowan-react-story");
  host.story = story;
  return host;
}

function ButtonExample() {
  const buttonRef = useRef(null);
  const [clicks, setClicks] = useState(0);

  useRowanElement(buttonRef, {
    events: {
      "rowan-click": () => setClicks((count) => count + 1),
    },
  });

  return (
    <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
      <rowan-button ref={buttonRef}>Save</rowan-button>
      <p>
        Clicked {clicks} time{clicks === 1 ? "" : "s"}.
      </p>
    </div>
  );
}

function TextFieldExample() {
  const fieldRef = useRef(null);
  const [name, setName] = useState("");

  useRowanElement(fieldRef, {
    events: {
      "rowan-change": (event) => {
        setName(event.detail.value);
      },
    },
  });

  return (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "20rem" }}>
      <rowan-text-field ref={fieldRef} label="Workspace name" name="workspace" />
      <p>{name ? `Committed value: ${name}` : "Blur or press Enter to commit."}</p>
    </div>
  );
}

const TABLE_CONFIG = {
  rowId: "id",
  selectable: "multiple",
  caption: "Members",
  columns: [{ id: "name", header: "Name" }]
  rows: [
    { id: "1", name: "Ada" },
    { id: "2", name: "Alan" },
    { id: "3", name: "Grace" },
  ],
};

function TableExample() {
  const tableRef = useRef(null);
  const [selected, setSelected] = useState([]);

  useRowanElement(tableRef, {
    properties: { config: TABLE_CONFIG, selected },
    events: {
      "rowan-select": (event) => {
        setSelected(event.detail.selected);
      },
    },
  });

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <rowan-table ref={tableRef} caption="Members" />
      <p>{selected.length ? `Selected: ${selected.join(", ")}` : "Select one or more rows."}</p>
    </div>
  );
}

export default {
  title: "Integrations/React",
  tags: ["autodocs"],
    docs: {
      description: {
        component:
          "Rowan stays a Web Component library. These stories mount React with `useRowanElement()` from `@rowan-ui/core/react`. Import registration modules in the story (or a client effect). Pass objects, arrays, and events through the hook; use JSX for scalar attributes.",
      },
    },
  },
};

export const Button = {
  render: () => renderReact(<ButtonExample />),
};

export const TextField = {
  render: () => renderReact(<TextFieldExample />),
};

export const Table = {
  name: "Table with useRowanElement",
  render: () => renderReact(<TableExample />),
};
