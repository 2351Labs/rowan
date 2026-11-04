const STACKBLITZ = {
  admin: "https://stackblitz.com/github/2351Labs/rowan/tree/main/templates/admin",
  vite: "https://stackblitz.com/github/2351Labs/rowan/tree/main/starters/vite",
  react: "https://stackblitz.com/github/2351Labs/rowan/tree/main/starters/react",
  vue: "https://stackblitz.com/github/2351Labs/rowan/tree/main/starters/vue",
};

const BADGE = "https://developer.stackblitz.com/img/open_in_stackblitz.svg";

function badge(href, label) {
  return `
    <a href="${href}">
      <img class="stackblitz-badge" alt="Open ${label} in StackBlitz" src="${BADGE}" height="32" />
    </a>
  `;
}

export const GUIDE_PAGES = [
  {
    id: "starters",
    group: "Overview",
    title: "Starters",
    summary: "Open the admin template or a small Vite, React, or Vue dashboard in StackBlitz.",
    tags: ["stackblitz", "vite", "react", "vue", "starter"],
    keywords: ["stackblitz", "starter", "vite", "react", "vue", "dashboard", "template"],
    content: () => `
      <section class="doc-section" data-doc-section id="starters-open">
        <h2>Open in StackBlitz</h2>
        <p>Each project is a folder in this repository with its own <code>package.json</code>. StackBlitz installs <code>@rowan-ui/core</code> from npm. A checkout of the Rowan repo links the local workspace instead, so you can try changes before they are published.</p>
        <div class="stackblitz-row">
          ${badge(STACKBLITZ.admin, "the admin template")}
          ${badge(STACKBLITZ.vite, "the Vite starter")}
          ${badge(STACKBLITZ.react, "the React starter")}
          ${badge(STACKBLITZ.vue, "the Vue starter")}
        </div>
      </section>
      <section class="doc-section" data-doc-section id="starters-admin">
        <h2>Admin template</h2>
        <p><a href="${STACKBLITZ.admin}">templates/admin</a> is the Lumen operations console: shell, overview, server tables, a record page, settings, an offline map, and static auth. It also uses <code>@rowan-ui/icons</code> and <code>@rowan-ui/maplibre</code>.</p>
      </section>
      <section class="doc-section" data-doc-section id="starters-dashboards">
        <h2>Small dashboards</h2>
        <p>The three starters show the same sample week: KPI cards, one trend chart, and a table. Nothing is fetched.</p>
        <ul>
          <li><a href="${STACKBLITZ.vite}">Vite</a> registers the custom elements and sets properties in <code>src/main.js</code>.</li>
          <li><a href="${STACKBLITZ.react}">React</a> uses the generated wrappers <code>RowanKpiCard</code>, <code>RowanTrendChart</code>, and <code>RowanTable</code>.</li>
          <li><a href="${STACKBLITZ.vue}">Vue 3</a> uses the tags directly. <code>compilerOptions.isCustomElement</code> keeps every <code>rowan-</code> tag as a custom element. Value and delta are properties, so the sample assigns them after mount.</li>
        </ul>
      </section>
    `,
  },
];
