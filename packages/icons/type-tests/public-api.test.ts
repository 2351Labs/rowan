import { createIcon } from "@rowan-ui/icons";
import { ArrowRight } from "@rowan-ui/icons/icons/arrow-right";
import InfinityIcon, { Infinity as InfinityNamed } from "@rowan-ui/icons/icons/infinity";

const arrow: SVGSVGElement = ArrowRight({
  label: "Continue",
  size: "1.25rem",
  strokeWidth: 1.5,
});

const custom: SVGSVGElement = createIcon({
  name: "custom-check",
  nodes: [["path", { d: "m5 12 4 4L19 6" }]],
});
const infinityNamed: SVGSVGElement = InfinityNamed({ label: "Unlimited" });
const infinityDefault: SVGSVGElement = InfinityIcon({ label: "Unlimited" });

void arrow;
void custom;
void infinityNamed;
void infinityDefault;