import { useEffect, useRef, useState } from "react";
import { useRowanElement } from "@rowan-ui/core/react";

export function WorkspaceField() {
  const fieldRef = useRef(null);
  const [name, setName] = useState("");

  useEffect(() => {
    void import("@rowan-ui/core/text-field");
  }, []);

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
      <p>{name ? `Committed value: ${name}` : "Blur the field to commit."}</p>
    </div>
  );
}
