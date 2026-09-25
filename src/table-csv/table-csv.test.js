import { expect } from "@esm-bundle/chai";

import { createTableCsv, visibleColumns } from "./table-csv.js";

const COLUMNS = [
  { id: "name", header: "Name" },
  { id: "team", header: "Team", hidden: true },
  { id: "score", header: "Score", type: "number" },
];

const ROWS = [
  { id: "1", name: "Ada", team: "Ops", score: 12 },
  { id: "2", name: "Alan, Turing", team: "Platform", score: 9 },
];

describe("createTableCsv", () => {
  it("omits hidden columns and escapes RFC 4180 fields", () => {
    expect(visibleColumns(COLUMNS).map((column) => column.id)).to.deep.equal(["name", "score"]);
    expect(visibleColumns(COLUMNS, ["score"]).map((column) => column.id)).to.deep.equal([
      "name",
      "team",
    ]);

    expect(createTableCsv(COLUMNS, ROWS)).to.equal('Name,Score\r\nAda,12\r\n"Alan, Turing",9');
  });

  it("includes hidden columns when asked and uses format/accessor", () => {
    const columns = [
      {
        id: "fill",
        header: "Fill",
        format: (value) => (value?.value == null ? "" : `${value.value}%`),
      },
      {
        id: "label",
        header: "Label",
        accessor: (row) => row.meta.label,
      },
    ];
    const rows = [{ fill: { value: 82, target: 90 }, meta: { label: "North" } }];

    expect(createTableCsv(columns, rows, { includeHidden: true })).to.equal(
      "Fill,Label\r\n82%,North",
    );
  });

  it("returns a header-only document for empty rows", () => {
    expect(createTableCsv([{ id: "name", header: "Name" }], [])).to.equal("Name");
    expect(createTableCsv(null, null)).to.equal("");
  });
});
