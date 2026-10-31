# Rowan Admin

Lumen is a sample wholesale operations console built with Rowan custom elements. It is a starter you can copy: app shell, dashboard, server-backed tables, a record page, settings, an offline map, and static auth screens. There is no framework and no network API. Orders, customers, and chart figures come from one fixture module.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/2351Labs/rowan/tree/main/templates/admin)

StackBlitz installs the published `@rowan-ui/core`, `@rowan-ui/icons`, and `@rowan-ui/maplibre` packages. The commands below, run from a checkout of this repository, use the local workspace copies.

The shell uses `rowan-app-layout`, `rowan-side-nav`, and a command palette (`Ctrl+K` or `⌘K`). Light and dark themes swap Rowan token sheets.

## Run it

From the Rowan repo, after `npm ci`:

```bash
npm run dev --workspace=@rowan-ui/admin-template
```

Open http://127.0.0.1:5174/ . Routes are hashes, so a static file server does not need a fallback:

| Route                  | Screen                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| `#/`                   | Overview: KPIs, trend, area, bar, and donut charts, recent orders |
| `#/orders`             | Orders table                                                      |
| `#/orders/ord-4801`    | Order detail                                                      |
| `#/customers`          | Customers table                                                   |
| `#/customers/cus-1001` | Account detail                                                    |
| `#/map`                | Fulfillment map                                                   |
| `#/settings`           | Workspace settings                                                |
| `#/sign-in`            | Sign in (static)                                                  |
| `#/sign-up`            | Create account (static)                                           |
| `#/forgot-password`    | Reset password (static)                                           |

Build and preview the production bundle:

```bash
npm run build --workspace=@rowan-ui/admin-template
npm run preview --workspace=@rowan-ui/admin-template
```

Output is `templates/admin/dist/`. Asset URLs are relative, so the same build can be hosted at a site root or at `/rowan/admin/`.

## What to try

- Overview loads through `rowan-data-state`. Change the date range to filter every chart from the same orders. "Fail next refresh" shows the error state. A range with no orders shows the empty state.
- Orders and customers call a local `getRows` with about 300ms of latency. Sort headers, the pager, the search box, the status select, and the filter builder all go through that call. "Fail next load" shows the table error row and Retry.
- Drag a column edge to resize. Drag a header to reorder. The column picker hides columns. Double-click a row, or press Enter on it, to open the record.
- Edit a status, assignee, note, or email in the cell. Blank required values and a bad email stay in the editor.
- Select rows for the bulk bar. Copy puts TSV on the clipboard. CSV and Excel download the filtered set, not only the current page.
- Order shipping and account profile are real forms: Rowan fields participate in the form, and the validation summary lists what failed. Auth screens validate too, then explain that nothing was submitted.
- The map uses an application-owned MapLibre style with a solid background and no tile URL. The location list and table still work if the map view cannot start. Turn layers off to hide warehouses, showrooms, or the delayed dock.

Refresh the browser to restore the generated orders. Settings and the theme choice stay in `localStorage` until you reset them from Settings.

## Theme it

`src/main.js` imports the default tokens plus the light and dark sheets:

```js
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";
```

The header control and Settings write `data-theme="light"` or `data-theme="dark"` on `<html>`. Components read semantic tokens (`--rowan-color-bg`, `--rowan-color-accent`, `--rowan-color-surface`, and the rest), so the shell does not recolor itself by hand.

To shift the brand, override those semantic tokens after the Rowan sheets. In `src/styles.css`:

```css
:root,
[data-theme="light"] {
  --rowan-color-accent: #0e6e7c;
  --rowan-color-accent-contrast: #ffffff;
}
```

Built-in alternatives (`lagoon`, `ember`, `slate`, `midnight`) ship as `@rowan-ui/core/tokens/<name>`. Import the sheet and set `data-theme` to that name. Chart series colors follow the chart tokens; leave `color` off the series so a theme can restyle them.

`src/styles.css` is only layout: page grid, header, and auth frame. Prefer a Rowan token over a new hex value so dark mode stays coherent.

## Make it yours

| File              | Change                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `src/fixtures.js` | Companies, catalog, and the seeded order generator                                                                                       |
| `src/api.js`      | Latency and filtering for the fake service. Replace `queryOrders` / `queryCustomers` with a real endpoint that returns `{ rows, total }` |
| `src/pages/`      | Screens. Tables go through `src/tables.js`                                                                                               |
| `src/shell.js`    | Navigation, command palette, notifications                                                                                               |
| `src/main.js`     | Routes                                                                                                                                   |

Auth is intentionally not a gate. Wire it to your session later; the console routes stay reachable for the demo.

Copying the template out of this repo: point the dependencies at published versions instead of the workspace, and keep Vite.

```json
{
  "dependencies": {
    "@rowan-ui/core": "^0.22.0",
    "@rowan-ui/icons": "^0.22.0",
    "@rowan-ui/maplibre": "^0.22.0",
    "maplibre-gl": "^5.24.0"
  },
  "devDependencies": {
    "vite": "^5.4.10"
  }
}
```

Give the map a real style by setting `map.mapStyle` to a MapLibre style document and `map.attribution` to that provider's credit. The component does not choose a tile host for you.

## Scripts

```bash
npm run dev --workspace=@rowan-ui/admin-template
npm run build --workspace=@rowan-ui/admin-template
npm run preview --workspace=@rowan-ui/admin-template
npm run smoke --workspace=@rowan-ui/admin-template
```

`smoke` expects `dist/` and opens every route in Chromium, failing on console errors.
