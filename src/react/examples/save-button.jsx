import { useState } from "react";
import { RowanButton } from "@rowan-ui/core/react/button";

export function SaveButton() {
  const [clicks, setClicks] = useState(0);

  return (
    <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
      <RowanButton onRowanClick={() => setClicks((count) => count + 1)}>Save</RowanButton>
      <p>
        Clicked {clicks} time{clicks === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
