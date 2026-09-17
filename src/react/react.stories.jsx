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

function renderReact(story) {
  const host = document.createElement("rowan-react-story");
  host.story = story;
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
          "Copy the story source. Register each element in a client `useEffect`, put scalars in JSX, and pass objects, arrays, and events through `useRowanElement()`.",
      },
    },
  },
};

export const Button = {
  render: () => renderReact(<SaveButton />),
  parameters: reactSource(saveButtonSource),
};

export const TextField = {
  render: () => renderReact(<WorkspaceField />),
  parameters: reactSource(workspaceFieldSource),
};

export const Table = {
  name: "Table with useRowanElement",
  render: () => renderReact(<MembersTable />),
  parameters: reactSource(membersTableSource),
};
