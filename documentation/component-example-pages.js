import "@rowan-ui/icons/elements/calendar-days";
import "@rowan-ui/icons/elements/circle-check";
import "@rowan-ui/icons/elements/menu";
import "@rowan-ui/icons/elements/search";
import "@rowan-ui/icons/elements/settings-2";
import "@rowan-ui/icons/elements/x";
import { renderApiReference } from "./api-reference-view.js";
import { COMPONENT_EXAMPLES } from "./component-examples.js";
import { hydrateSampleMedia } from "./sample-media.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function codeBlock(code, language = "html") {
  return `<pre class="code-block" data-language="${language}"><code>${escapeHtml(code)}</code></pre>`;
}

export const COMPONENT_EXAMPLE_PAGES = COMPONENT_EXAMPLES.filter((example) => example.page !== false).map(
  (example) => ({
    id: example.id,
    group: "Components",
    title: `Rowan ${example.title}`,
    summary: example.summary,
    tags: example.tags,
    keywords: example.keywords,
    content: () => `
      <section class="doc-section" data-doc-section id="${example.id}-usage">
        <h2>${escapeHtml(example.heading)}</h2>
        <p>${example.intro}</p>
        <div class="docs-component-demo" data-docs-primary-demo>
          ${example.demo}
        </div>
      </section>
      <section class="doc-section" data-doc-section id="${example.id}-snippet">
        <h2>Basic example</h2>
        ${codeBlock(example.usage, "html")}
      </section>
      ${renderApiReference(example.tagName)}
    `,
    afterRender(mainEl) {
      hydrateSampleMedia(mainEl);
      example.setup?.(mainEl);
    },
  }),
);
