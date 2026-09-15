# Storybook URL Migration

## 0.1.0 Taxonomy Navigation

Rowan Storybook stories are organized under stable product categories. This changes the generated
Storybook ID because its ID is derived from the story `title` and named export. The named export
suffix is unchanged by this migration.

Rowan does not ship runtime redirects for prior Storybook IDs. Update externally shared URLs to
the current category path when upgrading. Use Storybook's copy-link control or the generated
`storybook-static/index.json` to confirm a specific current ID after a build.

| Legacy URL                                      | Current URL                                                       |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| `?path=/story/components-button--playground`    | `?path=/story/components-actions-feedback-button--playground`     |
| `?path=/story/components-accordion--playground` | `?path=/story/components-navigation-layout-accordion--playground` |
| `?path=/story/forms-calendar--default`          | `?path=/story/components-forms-input-calendar--default`           |
| `?path=/story/components-table--pagination`     | `?path=/story/components-data-display-table--pagination`          |
| `?path=/docs/components-avatar--docs`           | `?path=/docs/components-data-display-avatar--docs`                |

For a component previously titled `Components/<component>`, insert its current category between
`Components` and the component name. Legacy `Forms/<component>` titles now use
`Components/Forms & Input/<component>`. Existing `Foundations/*`, `Integrations/*`, and
`Workflows/*` titles keep their root category.

The category segment is now one of the following:

- `Components/Actions & Feedback`
- `Components/Forms & Input`
- `Components/Files & Uploads`
- `Components/Overlays & Menus`
- `Components/Navigation & Layout`
- `Components/Data Display`
- `Workflows`
- `Foundations`
- `Integrations`

Static documentation links use a separate, durable hash format. A page remains `#<page-id>`;
a section is `#<page-id>:<section-id>`, such as
`#toaster:toaster-demo`. Existing page-only hashes continue to resolve.
