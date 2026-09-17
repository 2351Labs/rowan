import { useState } from "react";
import { RowanTextField } from "@rowan-ui/core/react/text-field";

export function WorkspaceField() {
  const [name, setName] = useState("");

  return (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "20rem" }}>
      <RowanTextField
        label="Workspace name"
        name="workspace"
        onRowanChange={(event) => setName(event.detail.value)}
      />
      <p>{name ? `Committed value: ${name}` : "Blur the field to commit."}</p>
    </div>
  );
}
