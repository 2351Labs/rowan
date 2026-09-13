import { rmSync } from "node:fs";

rmSync(new URL("../types", import.meta.url), { force: true, recursive: true });