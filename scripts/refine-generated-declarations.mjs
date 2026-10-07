import { readFile, readdir, writeFile } from "node:fs/promises";

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
  {
    file: new URL("../types/area-chart/area-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: 'import("../trend-chart/model.js").RowanTrendChartConfig | null | undefined',
  },
  {
    file: new URL("../types/stacked-bar-chart/stacked-bar-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: 'import("../chart/model.js").RowanChartConfig | null | undefined',
  },
  {
    file: new URL("../types/stacked-area-chart/stacked-area-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: "RowanStackedAreaChartConfig | null | undefined",
  },
  {
    file: new URL("../types/funnel-chart/funnel-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: "RowanFunnelChartConfig | null | undefined",
  },
  {
    file: new URL("../types/radar-chart/radar-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: "RowanRadarChartConfig | null | undefined",
  },
  {
    file: new URL("../types/range-chart/range-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: "RowanRangeChartConfig | null | undefined",
  },
  {
    file: new URL("../types/box-plot-chart/box-plot-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: "RowanBoxPlotChartConfig | null | undefined",
  },
  {
    file: new URL("../types/heatmap-chart/heatmap-chart.d.ts", import.meta.url),
    setter: "config",
    valueType: "RowanHeatmapChartConfig | null | undefined",
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

async function declarationFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const file = new URL(entry.name, directory);
    if (entry.isDirectory()) {
      files.push(...(await declarationFiles(new URL(`${entry.name}/`, directory))));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".d.ts")) files.push(file);
  }

  return files;
}

const messageSetterPattern =
  /(\/\*\* @param \{(Rowan[A-Za-z0-9]+Messages) \| null \| undefined\} value \*\/\s+set messages\(value: )\2(\);)/g;
const generatedTypesDirectory = new URL("../types/", import.meta.url);

for (const file of await declarationFiles(generatedTypesDirectory)) {
  const declaration = await readFile(file, "utf8");
  const refined = declaration.replace(messageSetterPattern, "$1$2 | null | undefined$3");

  if (refined !== declaration) await writeFile(file, refined);
}
