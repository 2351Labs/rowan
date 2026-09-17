import { expect } from "@esm-bundle/chai";

import { fileMatchesAccept, partitionAcceptedFiles } from "./file-accept.js";

describe("file accept matching", () => {
  const csv = new File(["sheet"], "report.csv", { type: "text/csv" });
  const png = new File(["img"], "photo.png", { type: "image/png" });
  const exe = new File(["bin"], "setup.exe", { type: "application/x-msdownload" });

  it("allows every file when accept is empty", () => {
    expect(fileMatchesAccept(csv, "")).to.equal(true);
    expect(fileMatchesAccept(exe, "  ")).to.equal(true);
  });

  it("matches extensions case-insensitively", () => {
    expect(fileMatchesAccept(csv, ".CSV,.PDF")).to.equal(true);
    expect(fileMatchesAccept(exe, ".csv")).to.equal(false);
  });

  it("matches MIME types and type/* wildcards", () => {
    expect(fileMatchesAccept(csv, "text/csv")).to.equal(true);
    expect(fileMatchesAccept(png, "image/*")).to.equal(true);
    expect(fileMatchesAccept(csv, "image/*")).to.equal(false);
  });

  it("partitions accepted and rejected files", () => {
    expect(partitionAcceptedFiles([exe, csv, png], ".csv,image/*")).to.deep.equal({
      accepted: [csv, png],
      rejected: [exe],
    });
  });
});
