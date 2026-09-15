import { readFile, writeFile } from "node:fs/promises";

const nullableSetters = [
  {
    file: new URL("../types/rating/rating.d.ts", import.meta.url),
    setter: "value",
    valueType: 'number | "" | null | undefined',
  },
  {
    file: new URL("../types/table/table.d.ts", import.meta.url),
    setter: "config",
    valueType: "RowanTableConfig | null | undefined",
  },
  {
    file: new URL("../types/trend-chart/trend-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: 'import("./model.js").RowanTrendChartConfig | null | undefined',
  },
];

for (const { file, setter, valueType } of nullableSetters) {
  const declaration = await readFile(file, "utf8");
  const setterPattern = new RegExp(`(set ${setter}\\([^:]+: )[^;]+(\\);)`);

  if (!setterPattern.test(declaration)) {
    throw new Error(`Could not find ${setter} setter in ${file.pathname}.`);
  }

  await writeFile(file, declaration.replace(setterPattern, `$1${valueType}$2`));
}