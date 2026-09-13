import { createIcon } from "@rowan-ui/icons";
import { ArrowRight } from "@rowan-ui/icons/icons/arrow-right";

const arrow: SVGSVGElement = ArrowRight({
  label: "Continue",
  size: "1.25rem",
  strokeWidth: 1.5,
});

const custom: SVGSVGElement = createIcon({
  name: "custom-check",
  nodes: [["path", { d: "m5 12 4 4L19 6" }]],
});

void arrow;
void custom;