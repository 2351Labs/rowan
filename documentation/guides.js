const CHECKED = "31 October 2026";

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

function sources(items) {
  const rows = items
    .map(
      (item) => `
        <li><a href="${item.href}">${item.label}</a></li>
      `,
    )
    .join("");
  return `
    <section class="doc-section" data-doc-section id="sources">
      <h2>Sources</h2>
      <p>Last checked ${CHECKED}. Pages move. If a link and this summary disagree, the linked page is the one to trust.</p>
      <ul>${rows}</ul>
    </section>
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
  {
    id: "mit-features",
    group: "Overview",
    title: "Free in Rowan",
    summary:
      "Features this repository ships under MIT, next to what AG Grid, AG Charts, MUI X, and Web Awesome document as commercial.",
    tags: ["license", "mit", "comparison"],
    keywords: ["ag grid", "mui", "web awesome", "enterprise", "license", "excel", "heatmap"],
    content: () => `
      <section class="doc-section" data-doc-section id="mit-how-to-read">
        <h2>How to read this</h2>
        <p>Rowan in this repository is MIT-licensed. The other columns only say what those projects publish about plan gates. A blank is not a claim that the feature is missing. It means the pages checked on ${CHECKED} did not name it.</p>
        <p>Prices below are the figures on those pages that day, not a quote.</p>
      </section>
      <section class="doc-section" data-doc-section id="mit-table">
        <h2>Feature gates</h2>
        <div class="docs-compatibility-table-wrap">
          <table class="docs-compatibility-table">
            <caption>MIT in Rowan, and the plan named on each vendor's public docs. Last checked ${CHECKED}.</caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Rowan</th>
                <th scope="col">AG Grid</th>
                <th scope="col">AG Charts</th>
                <th scope="col">MUI X</th>
                <th scope="col">Web Awesome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Row grouping and subtotals</th>
                <td>MIT. <code>rowan-table</code> has <code>groupBy</code> and <code>subtotals</code>.</td>
                <td>Enterprise. The pricing comparison marks Row Grouping and Aggregation as Enterprise.</td>
                <td>Not a grid. Not applicable.</td>
                <td>Premium. The licensing page names row grouping. The aggregation guide says Data Grid Premium provides sum, average, min, max, and size.</td>
                <td>Not itemized. The Pro page lists data grids among Pro components.</td>
              </tr>
              <tr>
                <th scope="row">Sparklines</th>
                <td>MIT. <code>rowan-sparkline</code> and <code>rowan-column-sparkline</code>.</td>
                <td>Enterprise. The pricing comparison marks Sparklines as Enterprise, and Integrated Charts as Enterprise Bundle.</td>
                <td>Not listed as a series on the AG Charts comparison. Integrated Charts are an Enterprise Bundle feature of the grid.</td>
                <td>Not stated on the licensing page.</td>
                <td>Not stated. The Pro page lists charts among Pro components.</td>
              </tr>
              <tr>
                <th scope="row">Excel export</th>
                <td>MIT. <code>rowan-table</code> exports CSV and Excel.</td>
                <td>Enterprise. CSV export is marked Community. Excel export and PDF export are marked Enterprise.</td>
                <td>Not a grid. Not applicable.</td>
                <td>Premium. The licensing page names Excel exporting as a Premium Data Grid feature.</td>
                <td>Not stated.</td>
              </tr>
              <tr>
                <th scope="row">Clipboard</th>
                <td>MIT. The table copies rows and can paste TSV into editable cells.</td>
                <td>Enterprise. Clipboard Operations are marked Enterprise.</td>
                <td>Not a grid. Not applicable.</td>
                <td>The Premium Data Grid introduction says the demo supports copying and pasting with Excel. The licensing page does not list clipboard as its own item.</td>
                <td>Not stated.</td>
              </tr>
              <tr>
                <th scope="row">Server-loaded rows</th>
                <td>MIT. <code>data-mode="server"</code> asks <code>dataSource.getRows</code> for a page.</td>
                <td>The community-vs-enterprise page lists Server-Side Row Model under Enterprise. The pricing comparison marks basic server-side sorting, filtering, selection, and pagination as Community, and server-side grouping, pivoting, tree data, master detail, and transactions as Enterprise.</td>
                <td>Not a grid. Not applicable.</td>
                <td>Not stated on the licensing page.</td>
                <td>Not stated.</td>
              </tr>
              <tr>
                <th scope="row">Inline cell editing</th>
                <td>MIT. <code>edit-mode</code> is <code>cell</code> or <code>row</code>.</td>
                <td>Community for the text, number, date, checkbox, large text, and select editors. Batch editing is marked Enterprise.</td>
                <td>Not a grid. Not applicable.</td>
                <td>Community. The Data Grid page lists editing among the features in the MIT package.</td>
                <td>Not stated.</td>
              </tr>
              <tr>
                <th scope="row">Heatmap</th>
                <td>MIT. <code>rowan-heatmap-chart</code>.</td>
                <td>Not a chart product. Not applicable.</td>
                <td>Enterprise. The series table marks Heatmap as Enterprise.</td>
                <td>The heatmap guide imports <code>Heatmap</code> from <code>@mui/x-charts</code>. The same page also shows <code>HeatmapPremium</code> for the WebGL renderer. It does not say the basic heatmap requires Pro.</td>
                <td>Not stated. The Pro page lists charts among Pro components.</td>
              </tr>
              <tr>
                <th scope="row">Waterfall</th>
                <td>MIT. <code>rowan-waterfall-chart</code>.</td>
                <td>Not a chart product. Not applicable.</td>
                <td>Enterprise. The series table marks Waterfall as Enterprise.</td>
                <td>Not stated on the licensing page or the heatmap guide.</td>
                <td>Not stated.</td>
              </tr>
              <tr>
                <th scope="row">Box plot</th>
                <td>MIT. <code>rowan-box-plot-chart</code>.</td>
                <td>Not a chart product. Not applicable.</td>
                <td>Enterprise. The series table marks Box Plot as Enterprise.</td>
                <td>Not stated on the pages checked.</td>
                <td>Not stated.</td>
              </tr>
              <tr>
                <th scope="row">Gauge</th>
                <td>MIT. <code>rowan-gauge-chart</code>.</td>
                <td>Not a chart product. Not applicable.</td>
                <td>Enterprise. Radial Gauge and Linear Gauge are marked Enterprise.</td>
                <td>Not stated on the pages checked.</td>
                <td>Not stated.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      ${sources([
        {
          href: "https://github.com/2351Labs/rowan/blob/main/LICENSE",
          label: "Rowan license (MIT)",
        },
        {
          href: "https://www.ag-grid.com/license-pricing/",
          label: "AG Grid and AG Charts feature comparison",
        },
        {
          href: "https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise/",
          label: "AG Grid Community vs Enterprise",
        },
        {
          href: "https://www.ag-grid.com/charts/react/community-vs-enterprise/",
          label: "AG Charts Community vs Enterprise",
        },
        {
          href: "https://mui.com/x/introduction/licensing/",
          label: "MUI X licensing",
        },
        {
          href: "https://mui.com/x/react-data-grid/",
          label: "MUI X React Data Grid",
        },
        {
          href: "https://mui.com/x/react-data-grid/aggregation/",
          label: "MUI X Data Grid aggregation",
        },
        {
          href: "https://mui.com/x/react-charts/heatmap/",
          label: "MUI X heatmap chart",
        },
        {
          href: "https://webawesome.com/license",
          label: "Web Awesome Core license",
        },
        {
          href: "https://webawesome.com/pro",
          label: "Web Awesome Pro",
        },
      ])}
    `,
  },
  {
    id: "library-comparison",
    group: "Overview",
    title: "Rowan and other libraries",
    summary:
      "Framework, license, grid, charts, templates, and accessibility, from each project's public docs.",
    tags: ["comparison", "ag-grid", "mui", "tremor", "web-awesome"],
    keywords: ["ag grid", "mui x", "web awesome", "tremor", "comparison", "license"],
    content: () => `
      <section class="doc-section" data-doc-section id="compare-how-to-read">
        <h2>How to read this</h2>
        <p>This is a snapshot of public docs on ${CHECKED}. It is not a benchmark and not a recommendation to avoid another library. Where a page did not say something, the cell says so.</p>
      </section>
      <section class="doc-section" data-doc-section id="compare-table">
        <h2>At a glance</h2>
        <div class="docs-compatibility-table-wrap">
          <table class="docs-compatibility-table">
            <caption>Public descriptions of Rowan, AG Grid, MUI X, Web Awesome, and Tremor. Last checked ${CHECKED}.</caption>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Rowan</th>
                <th scope="col">AG Grid / AG Charts</th>
                <th scope="col">MUI X</th>
                <th scope="col">Web Awesome</th>
                <th scope="col">Tremor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Framework</th>
                <td>Custom elements. React wrappers are generated. Vue, Angular, and Svelte use the elements.</td>
                <td>AG Grid's community page lists vanilla JavaScript plus React, Angular, and Vue.</td>
                <td>React. The Data Grid, charts, date pickers, tree view, and scheduler docs are React packages.</td>
                <td>Web Awesome Pro's component section calls the library framework-agnostic web components.</td>
                <td>React, with Tailwind CSS and Radix UI, as stated on tremor.so and the GitHub repository.</td>
              </tr>
              <tr>
                <th scope="row">License</th>
                <td>MIT for <code>@rowan-ui/core</code>, icons, and maplibre.</td>
                <td>Community is MIT, including production. Enterprise uses a commercial EULA. The charts enterprise page listed $499 per developer for AG Charts Enterprise and $1,498 per developer for the Grid + Charts bundle, each a perpetual licence with one year of support and updates.</td>
                <td>Community packages are MIT. Pro and Premium are commercial. The pricing page listed Pro at $299, Premium at $599, and Enterprise at $1,399 per developer. A 2026 MUI post describes further licensing changes from 8 April 2026, including single-app and multi-app options.</td>
                <td>Core is MIT. Pro is a paid per-seat annual subscription. The purchase page showed custom pricing rather than one public number. Support docs say a perpetual licence keeps the last Pro version from the subscription.</td>
                <td>Apache License 2.0 for the Tremor repository. The license file also notes MIT-licensed pieces from Radix and related projects. <code>@tremor/react</code> on npm is also Apache-2.0.</td>
              </tr>
              <tr>
                <th scope="row">Grid</th>
                <td><code>rowan-table</code> includes sorting, client and server data, grouping, subtotals, inline edit, clipboard, and CSV or Excel export under MIT. See the feature table for the vendor plan names.</td>
                <td>Community includes core sorting, filtering, pagination, basic cell editors, and CSV export. Row grouping, aggregation, Excel export, clipboard, and sparklines are marked Enterprise.</td>
                <td>The MIT Data Grid includes editing, sorting, filtering, and pagination. Pro adds multi-filtering, multi-sorting, column resizing, and column pinning. Premium adds row grouping and Excel export.</td>
                <td>Core does not advertise a data grid on the Pro page. That page lists data grids as Pro components. It does not itemize grouping, Excel export, or clipboard.</td>
                <td>Docs include a Table built from semantic table elements. They do not describe row grouping, server data, inline editing, or Excel export.</td>
              </tr>
              <tr>
                <th scope="row">Charts</th>
                <td>MIT charts include trend, bar, area, donut, heatmap, waterfall, box plot, and gauge, among others.</td>
                <td>AG Charts Community marks bar, line, area, scatter, bubble, pie, doughnut, and combination as Community. Heatmap, waterfall, box plot, and gauges are marked Enterprise. Zoom, navigator, and annotations are marked Enterprise.</td>
                <td>Community includes <code>@mui/x-charts</code>. Pro is described as adding advanced charts. The heatmap guide uses the Community import and also shows a Premium WebGL renderer. Waterfall, box plot, and gauge were not named on the pages checked.</td>
                <td>The Pro page lists charts as Pro components. It does not name heatmap, waterfall, box plot, or gauge.</td>
                <td>The site describes open-source chart components built with Recharts. A plan gate for chart types was not published.</td>
              </tr>
              <tr>
                <th scope="row">Admin shell and templates</th>
                <td>This repository includes <a href="#starters">templates/admin</a>, a vanilla operations console, plus the three dashboard starters.</td>
                <td>The pages checked describe the grid and charts. They do not describe an application shell or admin template.</td>
                <td>The pages checked describe components and licenses. They do not describe an admin template.</td>
                <td>Pro lists design patterns and a Figma kit. An application shell was not described on the pages checked.</td>
                <td>tremor.so links a dashboard template. The components are copy-and-paste React source, not a runnable admin app in this comparison.</td>
              </tr>
              <tr>
                <th scope="row">Accessibility</th>
                <td>Components expose labels, keyboard behavior, and ARIA where the docs and stories specify them. This page does not claim an external audit.</td>
                <td>The community page lists accessibility support as ARIA and keyboard navigation. The pricing comparison marks Accessibility for both the grid and the charts in Community.</td>
                <td>An accessibility report for MUI X was not on the licensing page. Material UI publishes a draft conformance report for 12 Core components against WCAG 2.2 A and AA. That report says it does not cover the Data Grid, and that it is a self-assessment without assistive-technology testing.</td>
                <td>The Pro page says the components are accessible. It does not publish a conformance level on that page.</td>
                <td>tremor.so says the components are accessible by design and that inputs support keyboard navigation. It does not publish a conformance level on the homepage.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      ${sources([
        {
          href: "https://github.com/2351Labs/rowan/blob/main/LICENSE",
          label: "Rowan license (MIT)",
        },
        {
          href: "https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise/",
          label: "AG Grid Community vs Enterprise",
        },
        {
          href: "https://www.ag-grid.com/license-pricing/",
          label: "AG Grid and AG Charts pricing comparison",
        },
        {
          href: "https://www.ag-grid.com/charts/enterprise-charts/",
          label: "AG Charts Enterprise (listed prices)",
        },
        {
          href: "https://mui.com/x/introduction/licensing/",
          label: "MUI X licensing",
        },
        {
          href: "https://mui.com/pricing/",
          label: "MUI pricing",
        },
        {
          href: "https://mui.com/blog/2026-mui-x-price-changes/",
          label: "MUI X pricing changes in 2026",
        },
        {
          href: "https://mui.com/material-ui/getting-started/accessibility/",
          label: "Material UI accessibility conformance report",
        },
        {
          href: "https://webawesome.com/license",
          label: "Web Awesome Core license",
        },
        {
          href: "https://webawesome.com/pro",
          label: "Web Awesome Pro",
        },
        {
          href: "https://webawesome.com/purchase",
          label: "Web Awesome purchase",
        },
        {
          href: "https://webawesome.com/support",
          label: "Web Awesome support (Core vs Pro, billing)",
        },
        {
          href: "https://tremor.so/",
          label: "Tremor homepage",
        },
        {
          href: "https://github.com/tremorlabs/tremor",
          label: "Tremor repository and Apache-2.0 license",
        },
        {
          href: "https://www.tremor.so/docs/ui/table",
          label: "Tremor Table",
        },
        {
          href: "https://www.npmjs.com/package/@tremor/react",
          label: "@tremor/react on npm",
        },
      ])}
    `,
  },
];
