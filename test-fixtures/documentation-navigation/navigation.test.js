import { expect } from "@esm-bundle/chai";
import {
  formatDocumentationRoute,
  parseDocumentationRoute,
} from "../../documentation/navigation.js";
import {
  compareStorybookEntries,
  createComponentNavigationSections,
  getComponentCategoryLabel,
  matchesDocumentationNavigationItem,
} from "../../documentation/taxonomy.js";

describe("documentation navigation routes", () => {
  const pageIds = new Set(["getting-started", "toaster", "trend-chart"]);

  it("preserves a known page and section hash for reloads", () => {
    expect(
      parseDocumentationRoute("#toaster:toaster-demo", pageIds, "getting-started"),
    ).to.deep.equal({
      pageId: "toaster",
      sectionId: "toaster-demo",
    });
    expect(formatDocumentationRoute("toaster", "toaster-demo")).to.equal("#toaster:toaster-demo");
  });

  it("falls back from unknown pages without applying their section", () => {
    expect(
      parseDocumentationRoute("#removed-page:overview", pageIds, "getting-started"),
    ).to.deep.equal({
      pageId: "getting-started",
      sectionId: "",
    });
  });

  it("gives unknown component routes one Other navigation home", () => {
    const sections = createComponentNavigationSections(
      [
        { id: "button", group: "Components", title: "Rowan Button" },
        { id: "future-widget", group: "Components", title: "Rowan Future Widget" },
        { id: "future-widget", group: "Components", title: "Rowan Duplicate Widget" },
        { id: "components", group: "Components", title: "Rowan Component Gallery" },
      ],
      (page) => page.title.replace(/^Rowan\s+/, ""),
      new Set(["rowan-button", "rowan-future-widget"]),
    );

    expect(getComponentCategoryLabel("rowan-future-widget")).to.equal("Other");
    expect(sections.find((section) => section.label === "Other")?.items).to.deep.equal([
      { pageId: "future-widget", label: "Future Widget" },
    ]);
    expect(sections.flatMap((section) => section.items).map((item) => item.pageId)).to.deep.equal([
      "button",
      "future-widget",
    ]);
  });

  it("finds navigation entries through their category labels", () => {
    const page = {
      group: "Components",
      title: "Rowan Table",
      summary: "Config-driven data display.",
      tags: ["grid"],
      keywords: ["columns"],
    };

    expect(
      matchesDocumentationNavigationItem({ label: "Table" }, page, "Data Display", "data display"),
    ).to.equal(true);
    expect(
      matchesDocumentationNavigationItem({ label: "Table" }, page, "Data Display", "forms"),
    ).to.equal(false);
  });

  it("sorts Storybook categories from the shared taxonomy", () => {
    const entries = [
      { id: "table", title: "Components/Data Display/Table", name: "Playground", type: "story" },
      {
        id: "button",
        title: "Components/Actions & Feedback/Button",
        name: "Playground",
        type: "story",
      },
      {
        id: "calendar",
        title: "Components/Forms & Input/Calendar",
        name: "Default",
        type: "story",
      },
    ];

    expect(entries.sort(compareStorybookEntries).map((entry) => entry.id)).to.deep.equal([
      "button",
      "calendar",
      "table",
    ]);
  });
});
