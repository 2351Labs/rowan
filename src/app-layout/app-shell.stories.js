import "./app-layout.js";
import "../side-nav/side-nav.js";
import "../side-nav-item/side-nav-item.js";
import "../side-nav-section/side-nav-section.js";
import "../command-palette/command-palette.js";
import "../command-item/command-item.js";
import "../icon-button/icon-button.js";
import "../dropdown/dropdown.js";
import "../menu/menu.js";
import "../menu-item/menu-item.js";
import "../button/button.js";
import "@rowan-ui/icons/elements/search";
import "@rowan-ui/icons/elements/layout-dashboard";
import "@rowan-ui/icons/elements/boxes";
import "@rowan-ui/icons/elements/building";
import "@rowan-ui/icons/elements/droplet";
import "@rowan-ui/icons/elements/user";
import { createEventScriptParameters } from "../storybook/event-script.js";

const DESTINATIONS = [
  {
    section: "Invexus",
    value: "/invexus",
    href: "/invexus",
    label: "Overview",
    icon: "layout-dashboard",
  },
  {
    section: "Invexus",
    value: "/invexus/assets",
    href: "/invexus/assets",
    label: "Assets",
    icon: "boxes",
  },
  {
    section: "PTMS",
    value: "/ptms",
    href: "/ptms",
    label: "Overview",
    icon: "building",
  },
  {
    section: "OFM",
    value: "/ofm",
    href: "/ofm",
    label: "Overview",
    icon: "droplet",
  },
];

const PAGES = {
  "/invexus": {
    title: "Invexus overview",
    body: "Current path is a catalog item. Hosts call navigate(detail.value) after preventDefault().",
  },
  "/invexus/assets": {
    title: "Invexus assets",
    body: "Same destination list drives the side nav and the command palette.",
  },
  "/ptms": {
    title: "PTMS overview",
    body: "Keep href on items so open-in-new-tab and no-JS still work.",
  },
  "/ofm": {
    title: "OFM overview",
    body: "Omitting href and routing only from rowan-change is also valid.",
  },
};

function createPrefixIcon(name) {
  const icon = document.createElement("rowan-icon");
  icon.slot = "prefix";
  icon.name = name;
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function createNavItem(destination) {
  const item = document.createElement("rowan-side-nav-item");
  item.value = destination.value;
  item.href = destination.href;
  item.label = destination.label;
  item.append(createPrefixIcon(destination.icon), document.createTextNode(destination.label));
  return item;
}

function createSideNav() {
  const nav = document.createElement("rowan-side-nav");
  nav.label = "Product navigation";
  nav.value = "/invexus";

  const sections = new Map();
  for (const destination of DESTINATIONS) {
    let section = sections.get(destination.section);
    if (!section) {
      section = document.createElement("rowan-side-nav-section");
      section.label = destination.section;
      sections.set(destination.section, section);
      nav.append(section);
    }
    section.append(createNavItem(destination));
  }

  return nav;
}

function createPalette() {
  const palette = document.createElement("rowan-command-palette");
  palette.label = "Jump to";
  palette.hotkey = "mod+k";
  palette.placeholder = "Jump to a destination";
  palette.emptyLabel = "No destinations match.";

  for (const destination of DESTINATIONS) {
    const item = document.createElement("rowan-command-item");
    item.value = destination.value;
    item.label = destination.label;
    item.group = destination.section;
    item.append(createPrefixIcon(destination.icon));
    palette.append(item);
  }

  return palette;
}

function createHeader(onOpenPalette) {
  const header = document.createElement("div");
  header.slot = "header";
  header.style.alignItems = "center";
  header.style.display = "flex";
  header.style.gap = "var(--rowan-space-2)";
  header.style.inlineSize = "100%";

  const brand = document.createElement("strong");
  brand.textContent = "Operations Console";
  brand.style.marginInlineEnd = "auto";

  const search = document.createElement("rowan-icon-button");
  search.icon = "search";
  search.label = "Jump to";
  search.variant = "ghost";
  search.addEventListener("rowan-click", () => onOpenPalette());

  const account = document.createElement("rowan-dropdown");
  account.label = "Account";
  const trigger = document.createElement("rowan-icon-button");
  trigger.slot = "trigger";
  trigger.icon = "user";
  trigger.label = "Account";
  trigger.variant = "ghost";
  const menu = document.createElement("rowan-menu");
  const profile = document.createElement("rowan-menu-item");
  profile.value = "profile";
  profile.textContent = "Profile";
  menu.append(profile);
  account.append(trigger, menu);

  header.append(brand, search, account);
  return header;
}

export default {
  title: "Workflows/App shell",
};

export const ProductShell = {
  parameters: createEventScriptParameters({
    steps: [
      "Activate a side-nav item. The story calls preventDefault() on rowan-change and routes in the host.",
      "Open Jump to (search or Mod+K) and pick the same destination.",
      "Use Simulate unknown path. The nav value is empty; the last item is not revived.",
      "At a compact width, open the drawer, then close it with the backdrop or Escape. The closed rail must not peek.",
    ],
    events: ["rowan-change", "rowan-command"],
  }),
  render: () => {
    const known = new Set(DESTINATIONS.map((item) => item.value));
    let path = "/invexus";

    const wrapper = document.createElement("div");
    const layout = document.createElement("rowan-app-layout");
    layout.navigationLabel = "Product navigation";
    layout.style.setProperty("--rowan-app-layout-min-block-size", "36rem");
    layout.style.blockSize = "36rem";
    layout.style.border = "1px solid var(--rowan-color-border)";
    layout.style.borderRadius = "var(--rowan-radius-md)";
    layout.style.overflow = "hidden";

    const nav = createSideNav();
    nav.slot = "navigation";

    const palette = createPalette();
    const header = createHeader(() => palette.show());

    const page = document.createElement("section");
    const heading = document.createElement("h2");
    heading.style.margin = "0 0 var(--rowan-space-2)";
    const copy = document.createElement("p");
    copy.style.color = "var(--rowan-color-muted)";
    copy.style.maxInlineSize = "48rem";
    const eventLine = document.createElement("p");
    eventLine.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    eventLine.style.fontSize = "0.8125rem";
    const unknown = document.createElement("rowan-button");
    unknown.variant = "secondary";
    unknown.size = "sm";
    unknown.textContent = "Simulate unknown path";
    page.append(heading, copy, eventLine, unknown);

    function renderPage(detail) {
      const pageCopy = PAGES[path];
      heading.textContent = pageCopy ? pageCopy.title : "Not in the catalog";
      copy.textContent = pageCopy
        ? pageCopy.body
        : "value is empty. Unauthorized and 404 pages must not revive the last active item.";
      eventLine.textContent = detail
        ? `event.detail.value = ${JSON.stringify(detail.value)}`
        : `nav.value = ${JSON.stringify(path)}`;
    }

    function go(nextPath, detail) {
      path = known.has(nextPath) ? nextPath : "";
      nav.value = path;
      renderPage(detail);
    }

    nav.addEventListener("rowan-change", (event) => {
      event.preventDefault();
      go(event.detail.value, event.detail);
    });

    palette.addEventListener("rowan-command", (event) => {
      go(event.detail.value, event.detail);
    });

    unknown.addEventListener("rowan-click", () => {
      go("/unauthorized");
    });

    renderPage();
    layout.append(header, nav, page);
    wrapper.append(layout, palette);
    return wrapper;
  },
};
