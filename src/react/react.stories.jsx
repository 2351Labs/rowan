import { createRoot } from "react-dom/client";

import { MembersTable } from "./examples/members-table.jsx";
import membersTableSource from "./examples/members-table.jsx?raw";
import { SaveButton } from "./examples/save-button.jsx";
import saveButtonSource from "./examples/save-button.jsx?raw";
import { WorkspaceField } from "./examples/workspace-field.jsx";
import workspaceFieldSource from "./examples/workspace-field.jsx?raw";

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

function renderReact(story, source) {
  const host = document.createElement("div");
  host.style.display = "grid";
  host.style.gap = "1rem";

  const live = document.createElement("rowan-react-story");
  live.story = story;

  const heading = document.createElement("p");
  heading.style.margin = "0";
  heading.style.fontWeight = "600";
  heading.textContent = "Application source";

  const pre = document.createElement("pre");
  pre.style.margin = "0";
  pre.style.padding = "1rem";
  pre.style.overflow = "auto";
  pre.style.fontSize = "0.8125rem";
  pre.style.lineHeight = "1.45";
  pre.style.border = "1px solid currentColor";
  pre.style.borderRadius = "0.5rem";
  pre.textContent = String(source ?? "").trim();

  host.append(live, heading, pre);
  return host;
}

function reactSource(code) {
  return {
    docs: {
      source: {
        type: "code",
        language: "jsx",
        code,
      },
    },
  };
}

export default {
  title: "Integrations/React",
  parameters: {
    docs: {
      description: {
        component:
          "Generated wrappers are the React default (`RowanButton`, `onRowanClick`). Raw tags and `useRowanElement` remain. See Integrations → Using Rowan from React.",
      },
    },
  },
};

export const Button = {
  render: () => renderReact(<SaveButton />, saveButtonSource),
  parameters: reactSource(saveButtonSource),
};

export const TextField = {
  render: () => renderReact(<WorkspaceField />, workspaceFieldSource),
  parameters: reactSource(workspaceFieldSource),
};

export const Table = {
  name: "Table with RowanTable",
  render: () => renderReact(<MembersTable />, membersTableSource),
  parameters: reactSource(membersTableSource),
};
