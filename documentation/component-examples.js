/**
 * Curated docs demos. The API reference generator copies `usage` and refuses
 * an empty tag when a component has no curated example and no real snippet.
 * `page: false` updates the reference without replacing a hand-written page.
 */

const YARD_MEDIA = "north-yard.svg";

export const COMPONENT_EXAMPLES = [
  {
    id: "accordion",
    tagName: "rowan-accordion",
    title: "Accordion",
    heading: "Release notes",
    summary: "Expandable disclosure for notes, policies, and change history.",
    tags: ["navigation", "disclosure"],
    keywords: ["rowan-accordion", "accordion", "summary", "open"],
    intro:
      "Use <code>summary</code> for the header and the default slot for the panel. <code>open</code> reflects the expanded state and <code>rowan-change</code> reports toggles.",
    demo: `
      <rowan-accordion open data-docs-demo-host>
        <span slot="summary">October release</span>
        <p>Keyboard focus, contrast, and table editing shipped this month.</p>
      </rowan-accordion>
      <rowan-accordion summary="Release notes">
        <p>Minor accessibility and performance updates.</p>
      </rowan-accordion>
    `,
    usage: `<rowan-accordion open>
  <span slot="summary">October release</span>
  <p>Keyboard focus, contrast, and table editing shipped this month.</p>
</rowan-accordion>

<rowan-accordion summary="Release notes">
  <p>Minor accessibility and performance updates.</p>
</rowan-accordion>`,
  },
  {
    id: "avatar",
    tagName: "rowan-avatar",
    title: "Avatar",
    heading: "People on the yard roster",
    summary: "Circular avatar that shows a photo or falls back to initials.",
    tags: ["data display", "identity"],
    keywords: ["rowan-avatar", "avatar", "initials", "src"],
    intro:
      "Set <code>name</code> for the accessible name and initials. <code>src</code> and <code>alt</code> show a photo; a missing image falls back to initials. <code>size</code> is <code>sm</code>, <code>md</code>, or <code>lg</code>.",
    demo: `
      <div class="docs-demo-variants">
        <div class="docs-demo-stack">
          <rowan-avatar data-docs-demo-host data-sample-media="yardWorker" name="Ava Pine" alt="Ava Pine" size="lg" locale="en-US"></rowan-avatar>
          <span class="docs-demo-caption">Ava Pine</span>
        </div>
        <div class="docs-demo-stack">
          <rowan-avatar name="North Yard" size="md" locale="en-US"></rowan-avatar>
          <span class="docs-demo-caption">Initials</span>
        </div>
        <div class="docs-demo-stack">
          <rowan-avatar name="Sam Okonkwo" size="sm" locale="en-US"></rowan-avatar>
          <span class="docs-demo-caption">Small</span>
        </div>
      </div>
    `,
    usage: `<rowan-avatar name="Ava Pine" src="yard-worker.svg" alt="Ava Pine" size="lg" locale="en-US"></rowan-avatar>
<rowan-avatar name="North Yard" size="md"></rowan-avatar>`,
  },
  {
    id: "badge",
    tagName: "rowan-badge",
    title: "Badge",
    heading: "Status on a shipment",
    summary: "Compact status label with tone and size.",
    tags: ["feedback", "status"],
    keywords: ["rowan-badge", "badge", "tone", "status"],
    intro:
      "<code>tone</code> is <code>info</code>, <code>success</code>, <code>warning</code>, or <code>danger</code>. <code>size</code> is <code>sm</code>, <code>md</code>, or <code>lg</code>. The default slot is the label.",
    demo: `
      <div class="docs-demo-variants">
        <rowan-badge data-docs-demo-host tone="success">In yard</rowan-badge>
        <rowan-badge tone="warning" size="sm">Needs review</rowan-badge>
        <rowan-badge tone="danger">Hold</rowan-badge>
        <rowan-badge tone="info" size="lg">Dock 4</rowan-badge>
      </div>
    `,
    usage: `<rowan-badge tone="success">In yard</rowan-badge>
<rowan-badge tone="warning" size="sm">Needs review</rowan-badge>
<rowan-badge tone="danger">Hold</rowan-badge>`,
  },
  {
    id: "breadcrumb",
    tagName: "rowan-breadcrumb",
    title: "Breadcrumb",
    heading: "Where this shipment sits",
    summary: "Breadcrumb navigation for the current record.",
    tags: ["navigation"],
    keywords: ["rowan-breadcrumb", "breadcrumb"],
    intro:
      "Put the trail in the default slot. The current page is a text node with <code>aria-current=&quot;page&quot;</code>. Separators are your own elements.",
    demo: `
      <rowan-breadcrumb data-docs-demo-host>
        <a href="#getting-started">Operations</a>
        <span aria-hidden="true">/</span>
        <a href="#table">Yards</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">North yard</span>
      </rowan-breadcrumb>
    `,
    usage: `<rowan-breadcrumb>
  <a href="/operations">Operations</a>
  <span aria-hidden="true">/</span>
  <a href="/yards">Yards</a>
  <span aria-hidden="true">/</span>
  <span aria-current="page">North yard</span>
</rowan-breadcrumb>`,
  },
  {
    id: "card",
    tagName: "rowan-card",
    title: "Card",
    heading: "A yard record",
    summary: "Surface for a record, with media, header, title, body, footer, and actions.",
    tags: ["data display", "layout"],
    keywords: ["rowan-card", "card", "media", "actions"],
    intro:
      "Fill the slots a dashboard card actually uses: <code>media</code>, <code>header</code>, <code>title</code>, the default body, <code>footer</code>, and <code>actions</code>. There is no elevation attribute; the border and padding are the surface.",
    demo: `
      <div class="docs-card-grid">
        <rowan-card data-docs-demo-host>
          <img slot="media" data-sample-media="northYard" alt="North yard loading docks at dusk" />
          <p slot="header">Trail note</p>
          <h3 slot="title" class="docs-demo-title">Evergreen Trail</h3>
          <p>A quiet route through old-growth cedar groves with two scenic overlooks.</p>
          <ul>
            <li>Permit required on weekends</li>
            <li>4.2 miles, two overlooks</li>
            <li>148 visitors this week</li>
          </ul>
          <small slot="footer">Updated 2h ago</small>
          <rowan-button slot="actions" variant="secondary" size="sm">Share</rowan-button>
          <rowan-button slot="actions" size="sm">View details</rowan-button>
        </rowan-card>
        <rowan-card>
          <p slot="header">North yard · today</p>
          <h3 slot="title" class="docs-demo-title">Dock utilization</h3>
          <ul>
            <li>Fill rate 82% versus a 90% target</li>
            <li>3 trailers waiting at dock 2</li>
            <li>One hold on a damaged pallet</li>
          </ul>
          <small slot="footer">Source: warehouse events</small>
          <rowan-button slot="actions" variant="secondary" size="sm">Open queue</rowan-button>
        </rowan-card>
      </div>
    `,
    usage: `<rowan-card>
  <img slot="media" src="${YARD_MEDIA}" alt="North yard loading docks at dusk" />
  <p slot="header">Trail note</p>
  <h3 slot="title">Evergreen Trail</h3>
  <p>A quiet route through old-growth cedar groves with two scenic overlooks.</p>
  <ul>
    <li>Permit required on weekends</li>
    <li>4.2 miles, two overlooks</li>
  </ul>
  <small slot="footer">Updated 2h ago</small>
  <rowan-button slot="actions" variant="secondary">Share</rowan-button>
  <rowan-button slot="actions">View details</rowan-button>
</rowan-card>`,
  },
  {
    id: "checkbox",
    tagName: "rowan-checkbox",
    title: "Checkbox",
    heading: "Choose what the handoff includes",
    summary: "Form-associated checkbox with checked, indeterminate, and disabled states.",
    tags: ["forms", "selection"],
    keywords: ["rowan-checkbox", "checkbox", "indeterminate"],
    intro:
      "The default slot is the visible label. <code>name</code> and <code>value</code> participate in the form. <code>checked</code>, <code>disabled</code>, <code>required</code>, and <code>indeterminate</code> reflect. Changes emit <code>rowan-change</code>.",
    demo: `
      <div class="docs-field-grid">
        <rowan-checkbox data-docs-demo-host name="notify" value="updates" checked>Email the dock lead when a trailer arrives</rowan-checkbox>
        <rowan-checkbox id="docs-checkbox-all" name="select-all" value="all">Select all open incidents</rowan-checkbox>
        <rowan-checkbox name="archive" value="archive" disabled>Archive closed holds</rowan-checkbox>
      </div>
    `,
    usage: `<rowan-checkbox name="notify" value="updates" checked>
  Email the dock lead when a trailer arrives
</rowan-checkbox>

<rowan-checkbox id="select-all" name="select-all" value="all">
  Select all open incidents
</rowan-checkbox>

<script type="module">
  document.querySelector("#select-all").indeterminate = true;
</script>`,
    setup(root) {
      const box = root.querySelector("#docs-checkbox-all");
      if (box) box.indeterminate = true;
    },
  },
  {
    id: "chip",
    tagName: "rowan-chip",
    title: "Chip",
    heading: "Filters on the yard board",
    summary: "Compact pill for metadata, with optional prefix and suffix.",
    tags: ["feedback", "metadata"],
    keywords: ["rowan-chip", "chip", "prefix", "suffix"],
    intro:
      "<code>tone</code> and <code>size</code> match the badge scale. The default slot is the label. <code>prefix</code> and <code>suffix</code> sit on either side.",
    demo: `
      <div class="docs-demo-variants">
        <rowan-chip data-docs-demo-host tone="success">
          <span slot="prefix">EN</span>
          Platform
          <span slot="suffix">12</span>
        </rowan-chip>
        <rowan-chip tone="warning" size="sm">Hold</rowan-chip>
        <rowan-chip tone="info">Dock 4</rowan-chip>
        <rowan-chip tone="danger" size="lg">Overdue</rowan-chip>
      </div>
    `,
    usage: `<rowan-chip tone="success">
  <span slot="prefix">EN</span>
  Platform
  <span slot="suffix">12</span>
</rowan-chip>
<rowan-chip tone="warning" size="sm">Hold</rowan-chip>`,
  },
  {
    id: "combobox",
    tagName: "rowan-combobox",
    title: "Combobox",
    heading: "Pick a city",
    summary: "Filterable text field with a suggestion list.",
    tags: ["forms", "selection"],
    keywords: ["rowan-combobox", "combobox", "options"],
    intro:
      "<code>label</code>, <code>placeholder</code>, <code>name</code>, <code>value</code>, <code>locale</code>, <code>required</code>, and <code>disabled</code> are attributes. Suggestions are the <code>options</code> property. Committing a value emits <code>rowan-change</code>.",
    demo: `
      <div class="docs-field-grid">
        <rowan-combobox id="docs-combobox" data-docs-demo-host name="city" label="City" placeholder="Search city" value="Portland" locale="en-US" required></rowan-combobox>
      </div>
    `,
    usage: `<rowan-combobox id="city" name="city" label="City" placeholder="Search city" value="Portland" locale="en-US" required></rowan-combobox>

<script type="module">
  const city = document.querySelector("#city");
  city.options = ["Portland", "Seattle", "Boise", "Bend", "Spokane"];
</script>`,
    setup(root) {
      const combobox = root.querySelector("#docs-combobox");
      if (!combobox) return;
      combobox.options = ["Portland", "Seattle", "Boise", "Bend", "Spokane"];
    },
  },
  {
    id: "command-item",
    tagName: "rowan-command-item",
    title: "Command Item",
    heading: "Commands in the palette",
    summary: "One action row inside a command palette.",
    tags: ["overlays", "commands"],
    keywords: ["rowan-command-item", "command", "shortcut"],
    intro:
      "Set <code>value</code>, <code>keywords</code>, and <code>group</code> for search. The default slot is the label. <code>prefix</code>, <code>description</code>, and <code>shortcut</code> are slots; the same description and shortcut can also be attributes.",
    demo: `
      <div class="docs-menu-frame">
        <rowan-command-item data-docs-demo-host value="open-settings" keywords="settings preferences" group="Workspace" tabindex="0">
          <span slot="prefix">⌘</span>
          Open settings
          <span slot="description">Update workspace preferences</span>
          <span slot="shortcut">G S</span>
        </rowan-command-item>
        <rowan-command-item value="archive-yard" description="Close the north yard for the night" shortcut="A Y" keywords="archive yard" group="Yards" disabled tabindex="0">
          Archive north yard
        </rowan-command-item>
      </div>
    `,
    usage: `<rowan-command-item value="open-settings" keywords="settings preferences" group="Workspace" tabindex="0">
  <span slot="prefix">⌘</span>
  Open settings
  <span slot="description">Update workspace preferences</span>
  <span slot="shortcut">G S</span>
</rowan-command-item>`,
  },
  {
    id: "data-state",
    tagName: "rowan-data-state",
    title: "Data State",
    heading: "Fill rate, in four states",
    summary: "Ready, loading, empty, and error chrome around application-owned data.",
    tags: ["feedback", "async"],
    keywords: ["rowan-data-state", "loading", "empty", "error"],
    intro:
      "<code>state</code> is <code>ready</code>, <code>loading</code>, <code>empty</code>, or <code>error</code>. The component does not fetch. Project the ready body into the default slot, and optional <code>loading</code>, <code>empty</code>, <code>error</code>, and <code>actions</code> slots.",
    demo: `
      <div class="docs-demo-variants">
        <rowan-button size="sm" data-state-demo="ready">Ready</rowan-button>
        <rowan-button size="sm" variant="secondary" data-state-demo="loading">Loading</rowan-button>
        <rowan-button size="sm" variant="secondary" data-state-demo="empty">Empty</rowan-button>
        <rowan-button size="sm" variant="secondary" data-state-demo="error">Error</rowan-button>
      </div>
      <rowan-data-state id="docs-data-state" data-docs-demo-host state="ready">
        <p>Fill rate is 82% versus a target of 90%.</p>
        <div slot="loading">
          <rowan-spinner label="Loading fill rate"></rowan-spinner>
          <rowan-skeleton height="2.5rem"></rowan-skeleton>
        </div>
        <rowan-empty-state slot="empty">
          <span slot="title">No fill-rate samples</span>
          <p>Connect a source to populate this panel.</p>
        </rowan-empty-state>
        <p slot="error">The fill-rate query failed.</p>
        <rowan-button slot="actions" size="sm">Retry</rowan-button>
      </rowan-data-state>
    `,
    usage: `<rowan-data-state id="fill-rate" state="ready">
  <p>Fill rate is 82% versus a target of 90%.</p>
  <div slot="loading">
    <rowan-spinner label="Loading fill rate"></rowan-spinner>
  </div>
  <rowan-empty-state slot="empty">
    <span slot="title">No fill-rate samples</span>
    <p>Connect a source to populate this panel.</p>
  </rowan-empty-state>
  <p slot="error">The fill-rate query failed.</p>
  <rowan-button slot="actions">Retry</rowan-button>
</rowan-data-state>`,
    setup(root) {
      const host = root.querySelector("#docs-data-state");
      if (!host) return;
      for (const button of root.querySelectorAll("[data-state-demo]")) {
        button.addEventListener("click", () => {
          host.state = button.getAttribute("data-state-demo");
        });
      }
    },
  },
  {
    id: "divider",
    tagName: "rowan-divider",
    title: "Divider",
    heading: "Separate yard notes",
    summary: "Horizontal or vertical rule between related content.",
    tags: ["layout"],
    keywords: ["rowan-divider", "divider", "separator"],
    intro: "<code>orientation</code> is <code>horizontal</code> or <code>vertical</code>. Give a vertical divider a block size.",
    demo: `
      <div>
        <p>North yard is receiving until 18:00.</p>
        <rowan-divider data-docs-demo-host></rowan-divider>
        <p>South dock stays on the river schedule.</p>
      </div>
      <div class="docs-split-inline">
        <span>Left</span>
        <rowan-divider orientation="vertical" style="block-size: 1.5rem"></rowan-divider>
        <span>Right</span>
      </div>
    `,
    usage: `<p>North yard is receiving until 18:00.</p>
<rowan-divider></rowan-divider>
<p>South dock stays on the river schedule.</p>

<div style="display:flex;align-items:center;gap:0.75rem">
  <span>Left</span>
  <rowan-divider orientation="vertical" style="block-size:1.5rem"></rowan-divider>
  <span>Right</span>
</div>`,
  },
  {
    id: "drawer",
    tagName: "rowan-drawer",
    title: "Drawer",
    heading: "Trail notes in a side panel",
    summary: "Side panel for a focused task, anchored to the start or end edge.",
    tags: ["overlays"],
    keywords: ["rowan-drawer", "drawer", "side"],
    intro:
      "<code>side</code> is <code>start</code> or <code>end</code>. Set <code>open</code> to show the panel. The <code>title</code> slot names it, and the default slot is the body. Closing emits <code>rowan-change</code>.",
    demo: `
      <div class="docs-demo-variants">
        <rowan-button id="docs-drawer-open" size="sm">Open trail notes</rowan-button>
      </div>
      <rowan-drawer id="docs-drawer" data-docs-demo-host side="end">
        <strong slot="title">Evergreen Trail</strong>
        <p>A quiet route through old-growth cedar groves with two scenic overlooks. Updated 2h ago.</p>
      </rowan-drawer>
    `,
    usage: `<rowan-button id="open-notes">Open trail notes</rowan-button>
<rowan-drawer id="trail-notes" side="end">
  <strong slot="title">Evergreen Trail</strong>
  <p>A quiet route through old-growth cedar groves with two scenic overlooks.</p>
</rowan-drawer>

<script type="module">
  const drawer = document.querySelector("#trail-notes");
  document.querySelector("#open-notes").addEventListener("click", () => {
    drawer.open = true;
  });
</script>`,
    setup(root) {
      const drawer = root.querySelector("#docs-drawer");
      const button = root.querySelector("#docs-drawer-open");
      button?.addEventListener("click", () => {
        if (drawer) drawer.open = true;
      });
    },
  },
  {
    id: "dropdown",
    tagName: "rowan-dropdown",
    title: "Dropdown",
    heading: "Row actions",
    summary: "Button that opens a menu of actions.",
    tags: ["overlays", "menus"],
    keywords: ["rowan-dropdown", "dropdown", "menu"],
    intro:
      "<code>label</code> names the fallback trigger. Put a <code>rowan-menu</code> in the default slot, or replace the trigger with the <code>trigger</code> slot. <code>open</code> reflects, and <code>rowan-change</code> fires when it toggles.",
    demo: `
      <rowan-dropdown data-docs-demo-host label="Actions">
        <rowan-menu>
          <rowan-menu-item value="edit">Edit</rowan-menu-item>
          <rowan-menu-item value="archive">Archive</rowan-menu-item>
        </rowan-menu>
      </rowan-dropdown>
      <rowan-dropdown label="Account">
        <button slot="trigger" type="button" aria-label="Account">MK</button>
        <rowan-menu>
          <rowan-menu-item value="profile">Profile</rowan-menu-item>
          <rowan-menu-item value="sign-out">Sign out</rowan-menu-item>
        </rowan-menu>
      </rowan-dropdown>
    `,
    usage: `<rowan-dropdown label="Actions">
  <rowan-menu>
    <rowan-menu-item value="edit">Edit</rowan-menu-item>
    <rowan-menu-item value="archive">Archive</rowan-menu-item>
  </rowan-menu>
</rowan-dropdown>`,
  },
  {
    id: "empty-state",
    tagName: "rowan-empty-state",
    title: "Empty State",
    heading: "Nothing saved yet",
    summary: "Empty message with an illustration, title, body, and action.",
    tags: ["feedback", "empty"],
    keywords: ["rowan-empty-state", "empty", "illustration"],
    intro:
      "Use the <code>icon</code>, <code>title</code>, default, and <code>actions</code> slots. The illustration is content you provide; the component does not fetch or invent one.",
    demo: `
      <rowan-empty-state data-docs-demo-host>
        <img slot="icon" class="docs-empty-art" data-sample-media="emptyCrates" alt="" />
        <span slot="title">No saved trails</span>
        <p>Create your first trail plan to get started.</p>
        <rowan-button slot="actions" size="sm">Create trail</rowan-button>
      </rowan-empty-state>
    `,
    usage: `<rowan-empty-state>
  <img slot="icon" src="empty-crates.svg" alt="" width="72" height="72" />
  <span slot="title">No saved trails</span>
  <p>Create your first trail plan to get started.</p>
  <rowan-button slot="actions">Create trail</rowan-button>
</rowan-empty-state>`,
  },
  {
    id: "icon",
    tagName: "rowan-icon",
    title: "Icon",
    heading: "Named icons",
    summary: "An SVG icon registered by an icons package import.",
    tags: ["icons"],
    keywords: ["rowan-icon", "icon", "name"],
    intro:
      "Import <code>@rowan-ui/icons/elements/&lt;name&gt;</code>, then set <code>name</code>. <code>label</code> names it, <code>size</code> is a pixel length, and <code>tone</code> is <code>none</code>, <code>info</code>, <code>success</code>, <code>warning</code>, or <code>danger</code>.",
    demo: `
      <div class="docs-icon-row">
        <div class="docs-demo-stack">
          <rowan-icon data-docs-demo-host name="calendar-days" label="Schedule" size="28"></rowan-icon>
          <span class="docs-demo-caption">Schedule</span>
        </div>
        <div class="docs-demo-stack">
          <rowan-icon name="search" label="Search" size="28"></rowan-icon>
          <span class="docs-demo-caption">Search</span>
        </div>
        <div class="docs-demo-stack">
          <rowan-icon name="circle-check" label="Ready" size="28" tone="success"></rowan-icon>
          <span class="docs-demo-caption">Ready</span>
        </div>
        <div class="docs-demo-stack">
          <rowan-icon name="settings-2" label="Settings" size="28"></rowan-icon>
          <span class="docs-demo-caption">Settings</span>
        </div>
      </div>
    `,
    usage: `<script type="module">
  import "@rowan-ui/icons/elements/calendar-days";
</script>

<rowan-icon name="calendar-days" label="Schedule" size="28"></rowan-icon>`,
  },
  {
    id: "icon-button",
    tagName: "rowan-icon-button",
    title: "Icon Button",
    heading: "Icon actions",
    summary: "Icon-only button with variant, size, and an accessible name.",
    tags: ["actions"],
    keywords: ["rowan-icon-button", "icon button", "variant"],
    intro:
      "<code>label</code> is the accessible name. <code>icon</code> is a name registered by <code>@rowan-ui/icons/elements/*</code>, or put an SVG in the default slot. <code>variant</code> is <code>primary</code>, <code>secondary</code>, <code>ghost</code>, or <code>danger</code>. <code>size</code> is <code>sm</code>, <code>md</code>, or <code>lg</code>. Activation emits <code>rowan-click</code>.",
    demo: `
      <div class="docs-demo-variants">
        <rowan-icon-button data-docs-demo-host icon="calendar-days" label="Schedule"></rowan-icon-button>
        <rowan-icon-button icon="search" label="Search" variant="primary"></rowan-icon-button>
        <rowan-icon-button icon="settings-2" label="Open settings" variant="secondary"></rowan-icon-button>
        <rowan-icon-button icon="x" label="Close" variant="danger"></rowan-icon-button>
        <rowan-icon-button icon="menu" label="Open navigation" size="lg" disabled></rowan-icon-button>
      </div>
    `,
    usage: `<script type="module">
  import "@rowan-ui/icons/elements/calendar-days";
  import "@rowan-ui/icons/elements/search";
</script>

<rowan-icon-button icon="calendar-days" label="Schedule"></rowan-icon-button>
<rowan-icon-button icon="search" label="Search" variant="primary"></rowan-icon-button>
<rowan-icon-button icon="x" label="Close" variant="danger"></rowan-icon-button>`,
  },
  {
    id: "link",
    tagName: "rowan-link",
    title: "Link",
    heading: "Jump to the trail record",
    summary: "Text link that reports activation.",
    tags: ["actions", "navigation"],
    keywords: ["rowan-link", "link", "href"],
    intro:
      "The default slot is the link text. <code>href</code> and <code>target</code> behave like an anchor. <code>external</code> marks an outside destination. <code>disabled</code> blocks activation. Clicks emit <code>rowan-click</code>.",
    demo: `
      <div class="docs-demo-variants">
        <rowan-link data-docs-demo-host href="#card">Read trail details</rowan-link>
        <rowan-link href="https://example.test/yards/north" external target="_blank">North yard map</rowan-link>
        <rowan-link href="#card" disabled>Unavailable</rowan-link>
      </div>
    `,
    usage: `<rowan-link href="/trails/evergreen">Read trail details</rowan-link>
<rowan-link href="https://example.test/yards/north" external target="_blank">North yard map</rowan-link>`,
  },
  {
    id: "menu",
    tagName: "rowan-menu",
    title: "Menu",
    heading: "Actions for a trailer",
    summary: "Menu of actions. Selecting an item emits rowan-change.",
    tags: ["overlays", "menus"],
    keywords: ["rowan-menu", "menu", "menu item"],
    intro: "Put <code>rowan-menu-item</code> elements in the default slot. The menu reports the chosen value on <code>rowan-change</code>.",
    demo: `
      <div class="docs-menu-frame">
        <rowan-menu data-docs-demo-host>
          <rowan-menu-item value="edit">Edit</rowan-menu-item>
          <rowan-menu-item value="duplicate">Duplicate</rowan-menu-item>
          <rowan-menu-item value="archive">Archive</rowan-menu-item>
        </rowan-menu>
      </div>
    `,
    usage: `<rowan-menu>
  <rowan-menu-item value="edit">Edit</rowan-menu-item>
  <rowan-menu-item value="duplicate">Duplicate</rowan-menu-item>
  <rowan-menu-item value="archive">Archive</rowan-menu-item>
</rowan-menu>`,
  },
  {
    id: "menu-item",
    tagName: "rowan-menu-item",
    title: "Menu Item",
    heading: "One action in a menu",
    summary: "Selectable row inside a menu.",
    tags: ["overlays", "menus"],
    keywords: ["rowan-menu-item", "menu item"],
    intro:
      "The default slot is the label. <code>value</code> is what the parent menu reports. <code>disabled</code> removes it from activation. Give a standalone item <code>tabindex=&quot;0&quot;</code>.",
    demo: `
      <div class="docs-menu-frame">
        <rowan-menu>
          <rowan-menu-item data-docs-demo-host value="edit" tabindex="0">Edit trailer</rowan-menu-item>
          <rowan-menu-item value="hold">Place on hold</rowan-menu-item>
          <rowan-menu-item value="archive" disabled>Archive</rowan-menu-item>
        </rowan-menu>
      </div>
    `,
    usage: `<rowan-menu-item value="edit" tabindex="0">Edit trailer</rowan-menu-item>`,
  },
  {
    id: "pagination",
    tagName: "rowan-pagination",
    title: "Pagination",
    heading: "Pages of trailers",
    summary: "Previous and next controls for a paged list.",
    tags: ["navigation"],
    keywords: ["rowan-pagination", "pagination", "page"],
    intro:
      "<code>page</code> and <code>total-pages</code> are 1-based. The default slot replaces the status text. <code>rowan-page-change</code> reports <code>detail.page</code> (1-based) and <code>detail.index</code> (0-based).",
    demo: `
      <rowan-pagination data-docs-demo-host page="2" total-pages="8">Showing trailers 11–20</rowan-pagination>
    `,
    usage: `<rowan-pagination page="2" total-pages="8">Showing trailers 11–20</rowan-pagination>`,
  },
  {
    id: "popover",
    tagName: "rowan-popover",
    title: "Popover",
    heading: "Dock filters",
    summary: "Popover anchored to a trigger.",
    tags: ["overlays"],
    keywords: ["rowan-popover", "popover", "trigger"],
    intro:
      "The <code>trigger</code> slot is the button. The default slot is the panel. <code>label</code> names the panel. <code>trigger</code> is <code>click</code> or <code>manual</code>. <code>open</code> reflects, and <code>rowan-change</code> fires when it toggles.",
    demo: `
      <rowan-popover data-docs-demo-host label="Dock filters" trigger="click">
        <rowan-button slot="trigger" size="sm" variant="secondary">Dock filters</rowan-button>
        <p>Show trailers waiting at dock 2. The host owns the filter model.</p>
      </rowan-popover>
    `,
    usage: `<rowan-popover label="Dock filters" trigger="click">
  <rowan-button slot="trigger" variant="secondary">Dock filters</rowan-button>
  <p>Show trailers waiting at dock 2.</p>
</rowan-popover>`,
  },
  {
    id: "progress",
    tagName: "rowan-progress",
    title: "Progress",
    heading: "Dock utilization",
    summary: "Determinate progress bar with a label and value.",
    tags: ["feedback", "status"],
    keywords: ["rowan-progress", "progress", "value"],
    intro:
      "<code>value</code> and <code>max</code> set the bar. <code>label</code> names it. <code>hide-meta</code> hides the numeric readout. <code>locale</code> formats the numbers.",
    demo: `
      <div class="docs-field-grid">
        <rowan-progress data-docs-demo-host label="Dock utilization" value="72" max="100" locale="en-US"></rowan-progress>
        <rowan-progress label="Quota" value="42" max="100" hide-meta></rowan-progress>
      </div>
    `,
    usage: `<rowan-progress label="Dock utilization" value="72" max="100" locale="en-US"></rowan-progress>`,
  },
  {
    id: "radio",
    tagName: "rowan-radio",
    title: "Radio",
    heading: "One role",
    summary: "A single radio option with form association.",
    tags: ["forms", "selection"],
    keywords: ["rowan-radio", "radio"],
    intro:
      "Group radios with the same <code>name</code>. The default slot is the visible label, and <code>label</code> is the accessible name when you need one that differs. <code>value</code>, <code>checked</code>, <code>disabled</code>, and <code>required</code> reflect. Changes emit <code>rowan-change</code>.",
    demo: `
      <div class="docs-field-grid">
        <rowan-radio data-docs-demo-host name="role" value="editor" label="Role" checked>Editor</rowan-radio>
        <rowan-radio name="role" value="admin" label="Role">Admin</rowan-radio>
        <rowan-radio name="role" value="viewer" label="Role" disabled>Viewer</rowan-radio>
      </div>
    `,
    usage: `<rowan-radio name="role" value="editor" label="Role" checked>Editor</rowan-radio>
<rowan-radio name="role" value="admin" label="Role">Admin</rowan-radio>`,
  },
  {
    id: "radio-group",
    tagName: "rowan-radio-group",
    title: "Radio Group",
    heading: "Who can see this queue",
    summary: "Group controller for a set of radio options.",
    tags: ["forms", "selection"],
    keywords: ["rowan-radio-group", "radio group"],
    intro:
      "Put <code>rowan-radio</code> children in the default slot. <code>value</code> selects one of them. <code>name</code>, <code>disabled</code>, and <code>required</code> apply to the group. Changes emit <code>rowan-change</code>.",
    demo: `
      <rowan-radio-group data-docs-demo-host name="audience" value="team">
        <rowan-radio value="team">Team</rowan-radio>
        <rowan-radio value="department">Department</rowan-radio>
        <rowan-radio value="company">Company</rowan-radio>
      </rowan-radio-group>
    `,
    usage: `<rowan-radio-group name="audience" value="team">
  <rowan-radio value="team">Team</rowan-radio>
  <rowan-radio value="department">Department</rowan-radio>
  <rowan-radio value="company">Company</rowan-radio>
</rowan-radio-group>`,
  },
  {
    id: "select",
    tagName: "rowan-select",
    title: "Select",
    heading: "Assign a role",
    summary: "Select control whose options are a property.",
    tags: ["forms", "selection"],
    keywords: ["rowan-select", "select", "options"],
    intro:
      "<code>label</code>, <code>placeholder</code>, <code>name</code>, <code>value</code>, <code>required</code>, and <code>disabled</code> are attributes. <code>options</code> is property-only. Changes emit <code>rowan-change</code>.",
    demo: `
      <div class="docs-field-grid">
        <rowan-select id="docs-select" data-docs-demo-host name="role" label="Role" placeholder="Choose role" value="editor" required></rowan-select>
      </div>
    `,
    usage: `<rowan-select id="role" name="role" label="Role" placeholder="Choose role" value="editor" required></rowan-select>

<script type="module">
  document.querySelector("#role").options = [
    { value: "viewer", label: "Viewer" },
    { value: "editor", label: "Editor" },
    { value: "admin", label: "Admin" },
  ];
</script>`,
    setup(root) {
      const select = root.querySelector("#docs-select");
      if (!select) return;
      select.options = [
        { value: "viewer", label: "Viewer" },
        { value: "editor", label: "Editor" },
        { value: "admin", label: "Admin" },
      ];
    },
  },
  {
    id: "skeleton",
    tagName: "rowan-skeleton",
    title: "Skeleton",
    heading: "Roster still loading",
    summary: "Placeholder blocks while a roster is loading.",
    tags: ["feedback", "loading"],
    keywords: ["rowan-skeleton", "skeleton", "shape"],
    intro:
      "<code>shape</code> is <code>text</code>, <code>rect</code>, or <code>circle</code>. <code>width</code> and <code>height</code> size it. <code>animated</code> turns the shimmer on.",
    demo: `
      <div class="docs-field-grid">
        <p class="docs-demo-caption">Loading the yard roster</p>
        <rowan-skeleton data-docs-demo-host shape="circle" width="2.5rem" height="2.5rem" animated></rowan-skeleton>
        <rowan-skeleton shape="text" width="14rem" animated></rowan-skeleton>
        <rowan-skeleton shape="text" width="10rem" animated></rowan-skeleton>
        <rowan-skeleton shape="rect" width="100%" height="4.5rem" animated></rowan-skeleton>
      </div>
    `,
    usage: `<rowan-skeleton shape="circle" width="2.5rem" height="2.5rem" animated></rowan-skeleton>
<rowan-skeleton shape="text" width="14rem" animated></rowan-skeleton>
<rowan-skeleton shape="rect" width="100%" height="4.5rem" animated></rowan-skeleton>`,
  },
  {
    id: "source-meta",
    tagName: "rowan-source-meta",
    title: "Source Meta",
    heading: "Where the number came from",
    summary: "Provenance line for a KPI, chart, or table.",
    tags: ["data display", "provenance"],
    keywords: ["rowan-source-meta", "source", "as-of"],
    intro:
      "<code>source</code> and <code>as-of</code> are the text. The <code>source</code> and <code>as-of</code> slots replace those attributes when you need richer content. This component does not fetch.",
    demo: `
      <rowan-source-meta data-docs-demo-host source="Warehouse events" as-of="2026-09-23 14:02 UTC"></rowan-source-meta>
      <rowan-source-meta>
        <span slot="source">Warehouse events</span>
        <span slot="as-of">2026-09-23 14:02 UTC</span>
      </rowan-source-meta>
    `,
    usage: `<rowan-source-meta source="Warehouse events" as-of="2026-09-23 14:02 UTC"></rowan-source-meta>

<rowan-source-meta>
  <span slot="source">Warehouse events</span>
  <span slot="as-of">2026-09-23 14:02 UTC</span>
</rowan-source-meta>`,
  },
  {
    id: "spinner",
    tagName: "rowan-spinner",
    title: "Spinner",
    heading: "Waiting on the yard count",
    summary: "Inline spinner with an accessible label and three sizes.",
    tags: ["feedback", "loading"],
    keywords: ["rowan-spinner", "spinner", "loading"],
    intro: "<code>label</code> is the accessible name. <code>size</code> is <code>sm</code>, <code>md</code>, or <code>lg</code>.",
    demo: `
      <div class="docs-demo-variants">
        <rowan-spinner data-docs-demo-host label="Loading trail counts"></rowan-spinner>
        <rowan-spinner size="sm" label="Loading"></rowan-spinner>
        <rowan-spinner size="lg" label="Loading the yard roster"></rowan-spinner>
        <span>Loading trail counts</span>
      </div>
    `,
    usage: `<rowan-spinner label="Loading trail counts"></rowan-spinner>
<rowan-spinner size="sm" label="Loading"></rowan-spinner>
<rowan-spinner size="lg" label="Loading the yard roster"></rowan-spinner>`,
  },
  {
    id: "switch",
    tagName: "rowan-switch",
    title: "Switch",
    heading: "Scheduling availability",
    summary: "Toggle switch with form association.",
    tags: ["forms"],
    keywords: ["rowan-switch", "switch", "checked"],
    intro:
      "The default slot is the visible label. <code>label</code> names the control. <code>checked</code>, <code>disabled</code>, <code>required</code>, <code>name</code>, and <code>value</code> reflect. Toggles emit <code>rowan-change</code>.",
    demo: `
      <div class="docs-field-grid">
        <rowan-switch data-docs-demo-host name="availability" value="on" label="Availability" checked>Available for scheduling</rowan-switch>
        <rowan-switch name="after-hours" value="on" label="After hours" disabled>After-hours receiving</rowan-switch>
      </div>
    `,
    usage: `<rowan-switch name="availability" value="on" label="Availability" checked>
  Available for scheduling
</rowan-switch>`,
  },
  {
    id: "tab",
    tagName: "rowan-tab",
    title: "Tab",
    heading: "One tab in a set",
    summary: "The tab button used inside rowan-tabs.",
    tags: ["navigation"],
    keywords: ["rowan-tab", "tab"],
    intro:
      "Give each tab a <code>value</code> that matches its panel. The default slot is the label. <code>active</code> reflects the selected tab. Use it inside <code>rowan-tabs</code>.",
    demo: `
      <rowan-tabs value="overview">
        <rowan-tab data-docs-demo-host value="overview">Overview</rowan-tab>
        <rowan-tab value="activity">Activity</rowan-tab>
        <rowan-tab-panel value="overview">Fill rate is 82% versus a target of 90%.</rowan-tab-panel>
        <rowan-tab-panel value="activity">3 trailers arrived since 14:00.</rowan-tab-panel>
      </rowan-tabs>
    `,
    usage: `<rowan-tabs value="overview">
  <rowan-tab value="overview">Overview</rowan-tab>
  <rowan-tab value="activity">Activity</rowan-tab>
  <rowan-tab-panel value="overview">Fill rate is 82% versus a target of 90%.</rowan-tab-panel>
  <rowan-tab-panel value="activity">3 trailers arrived since 14:00.</rowan-tab-panel>
</rowan-tabs>`,
  },
  {
    id: "tab-panel",
    tagName: "rowan-tab-panel",
    title: "Tab Panel",
    heading: "The panel for the active tab",
    summary: "Content panel paired with a tab value.",
    tags: ["navigation"],
    keywords: ["rowan-tab-panel", "tab panel"],
    intro:
      "Match <code>value</code> to a <code>rowan-tab</code>. The default slot is the panel content. <code>active</code> reflects visibility. Place panels inside <code>rowan-tabs</code>.",
    demo: `
      <rowan-tabs value="overview">
        <rowan-tab value="overview">Overview</rowan-tab>
        <rowan-tab value="settings">Settings</rowan-tab>
        <rowan-tab-panel data-docs-demo-host value="overview">
          <p>North yard is receiving until 18:00. Fill rate is 82%.</p>
        </rowan-tab-panel>
        <rowan-tab-panel value="settings">
          <p>Weekend permits are required on Evergreen Trail.</p>
        </rowan-tab-panel>
      </rowan-tabs>
    `,
    usage: `<rowan-tab-panel value="overview">
  <p>North yard is receiving until 18:00. Fill rate is 82%.</p>
</rowan-tab-panel>`,
  },
  {
    id: "tabs",
    tagName: "rowan-tabs",
    title: "Tabs",
    heading: "Yard overview",
    summary: "Tabs controller for tab and tab-panel children.",
    tags: ["navigation"],
    keywords: ["rowan-tabs", "tabs"],
    intro:
      "<code>value</code> selects the active tab. Children are <code>rowan-tab</code> and <code>rowan-tab-panel</code> elements in the default slot, paired by <code>value</code>. Changes emit <code>rowan-change</code>.",
    demo: `
      <rowan-tabs data-docs-demo-host value="overview">
        <rowan-tab value="overview">Overview</rowan-tab>
        <rowan-tab value="settings">Settings</rowan-tab>
        <rowan-tab-panel value="overview">Overview content for the north yard.</rowan-tab-panel>
        <rowan-tab-panel value="settings">Settings content for receiving hours.</rowan-tab-panel>
      </rowan-tabs>
    `,
    usage: `<rowan-tabs value="overview">
  <rowan-tab value="overview">Overview</rowan-tab>
  <rowan-tab value="settings">Settings</rowan-tab>
  <rowan-tab-panel value="overview">Overview content.</rowan-tab-panel>
  <rowan-tab-panel value="settings">Settings content.</rowan-tab-panel>
</rowan-tabs>`,
  },
  {
    id: "text-field",
    tagName: "rowan-text-field",
    title: "Text Field",
    heading: "Name the trailer",
    summary: "Single-line text field with form association.",
    tags: ["forms"],
    keywords: ["rowan-text-field", "text field", "input"],
    intro:
      "<code>label</code>, <code>name</code>, <code>value</code>, <code>placeholder</code>, <code>type</code>, <code>pattern</code>, <code>autocomplete</code>, <code>required</code>, <code>disabled</code>, and <code>invalid</code> are attributes. <code>type</code> is <code>text</code>, <code>email</code>, <code>password</code>, <code>search</code>, <code>url</code>, or <code>tel</code>. Commits emit <code>rowan-change</code>.",
    demo: `
      <div class="docs-field-grid">
        <rowan-text-field data-docs-demo-host name="trailer" label="Trailer" type="text" placeholder="TR-1042" value="TR-1042" required></rowan-text-field>
        <rowan-text-field name="query" label="Find a yard" type="search" placeholder="North yard"></rowan-text-field>
        <rowan-text-field name="email" label="Lead email" type="email" placeholder="ava@example.test" autocomplete="email"></rowan-text-field>
      </div>
    `,
    usage: `<rowan-text-field name="trailer" label="Trailer" type="text" placeholder="TR-1042" value="TR-1042" required></rowan-text-field>`,
  },
  {
    id: "textarea",
    tagName: "rowan-textarea",
    title: "Textarea",
    heading: "Notes on the hold",
    summary: "Multi-line text field with form association.",
    tags: ["forms"],
    keywords: ["rowan-textarea", "textarea", "notes"],
    intro:
      "<code>label</code>, <code>name</code>, <code>value</code>, <code>placeholder</code>, <code>rows</code>, <code>required</code>, <code>disabled</code>, and <code>invalid</code> are attributes. Commits emit <code>rowan-change</code>.",
    demo: `
      <div class="docs-field-grid">
        <rowan-textarea data-docs-demo-host name="notes" label="Notes" rows="4" placeholder="Add project notes" required>Damaged pallet on trailer TR-1042. Hold until the dock lead confirms.</rowan-textarea>
        <rowan-textarea name="reason" label="Hold reason" rows="3" invalid placeholder="Why is this on hold?"></rowan-textarea>
      </div>
    `,
    usage: `<rowan-textarea name="notes" label="Notes" rows="4" placeholder="Add project notes" required>Damaged pallet on trailer TR-1042.</rowan-textarea>`,
  },
  {
    id: "tooltip",
    tagName: "rowan-tooltip",
    title: "Tooltip",
    heading: "Hint on an action",
    summary: "Tooltip text for a trigger in the default slot.",
    tags: ["overlays"],
    keywords: ["rowan-tooltip", "tooltip"],
    intro:
      "<code>text</code> is the tooltip. The default slot is the trigger. Hover, focus, or <code>open</code> shows it. Escape closes it.",
    demo: `
      <rowan-tooltip data-docs-demo-host text="Save to favorites">
        <rowan-button variant="secondary" size="sm">Save trail</rowan-button>
      </rowan-tooltip>
    `,
    usage: `<rowan-tooltip text="Save to favorites">
  <rowan-button variant="secondary">Save trail</rowan-button>
</rowan-tooltip>`,
  },
  {
    id: "tree-item",
    tagName: "rowan-tree-item",
    title: "Tree Item",
    heading: "A branch in the docs tree",
    summary: "One node in a tree, with nested children.",
    tags: ["navigation"],
    keywords: ["rowan-tree-item", "tree item"],
    intro:
      "The default slot is the label. <code>prefix</code> sits before it, and <code>children</code> holds nested items. <code>value</code>, <code>expanded</code>, <code>selected</code>, <code>disabled</code>, and <code>level</code> describe the node.",
    demo: `
      <rowan-tree-item data-docs-demo-host value="guides" expanded selected level="1" tabindex="0">
        <span slot="prefix">▸</span>
        Guides
        <rowan-tree-item slot="children" value="getting-started" level="2">Getting started</rowan-tree-item>
      </rowan-tree-item>
    `,
    usage: `<rowan-tree-item value="guides" expanded selected level="1" tabindex="0">
  <span slot="prefix">▸</span>
  Guides
  <rowan-tree-item slot="children" value="getting-started" level="2">Getting started</rowan-tree-item>
</rowan-tree-item>`,
  },
  {
    id: "image",
    tagName: "rowan-image",
    title: "Image",
    page: false,
    usage: `<rowan-image
  src="${YARD_MEDIA}"
  alt="North yard loading docks at dusk"
  href="https://example.test/cameras/north-yard"
  fit="cover"
  loading="eager"
>
  <rowan-badge slot="overlay" tone="warning">Needs review</rowan-badge>
  <span slot="caption">North yard · live still</span>
</rowan-image>

<rowan-image src="missing-camera.jpg" alt="South dock camera offline">
  <span slot="fallback">Still unavailable</span>
  <span slot="caption">Fallback when the still fails</span>
</rowan-image>`,
  },
];

export const COMPONENT_EXAMPLE_BY_TAG = new Map(
  COMPONENT_EXAMPLES.map((example) => [example.tagName, example]),
);
