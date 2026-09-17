import { useEffect, useRef, useState } from "react";
import { useRowanElement } from "@rowan-ui/core/react";

export function SaveButton() {
  const buttonRef = useRef(null);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    void import("@rowan-ui/core/button");
  }, []);

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
