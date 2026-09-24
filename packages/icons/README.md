# @rowan-ui/icons

`@rowan-ui/icons` is Rowan's optional SVG icon package. It has no dependency on
`@rowan-ui/core` and never asks core components to look up an icon by a string
name.

It currently ships 2,098 individually importable icons generated from Lucide
Static 1.45.0.

## Install

```sh
npm install @rowan-ui/icons
```

For `rowan-icon-button` names and other core slots, install icons next to core:

```sh
npm install @rowan-ui/core@^0.11.0 @rowan-ui/icons@^0.11.0
```

Import icons by their individual ESM path for the narrowest bundle boundary:

```js
import { ArrowRight } from "@rowan-ui/icons/icons/arrow-right";

const button = document.querySelector("rowan-icon-button");
button.label = "Continue";
button.append(ArrowRight());
```

Each icon module imports only the shared SVG factory and its own geometry. The
`@rowan-ui/icons/icons` barrel is available for convenience, but direct imports
are the preferred production path when bundle size matters.

## Declarative HTML

For HTML-first applications, import the per-icon element module for each icon used.
It registers `rowan-icon` and exactly that icon name, so there is no full-catalog
runtime registry or core dependency:

```js
import "@rowan-ui/core/icon-button";
import "@rowan-ui/icons/elements/calendar-days";
```

```html
<rowan-icon-button icon="calendar-days" label="Schedule" title="Schedule"></rowan-icon-button>
```

`icon` and `name` use the icon module's kebab-case name. `rowan-icon` remains
available for slots in other Rowan components and accepts `size`, `stroke-width`,
`label`, and `tone` (`none` | `info` | `success` | `warning` | `danger`).
`tone` sets `color` from Rowan status tokens; omit it to inherit. Omit `label`
when the icon is decorative, including inside a labeled `rowan-icon-button`.

## React

The SVG factory and `rowan-icon` tag do not require `@rowan-ui/core`. The generated
wrapper does: it uses the same `createRowanComponent` helper as core.

```tsx
import "@rowan-ui/icons/elements/calendar-days";
import { RowanIcon } from "@rowan-ui/icons/react/icon";

<RowanIcon name="calendar-days" label="Schedule" />;
```

Import the per-icon element module so the name is registered. The wrapper is a
client binding, not a Server Component.

## Accessibility

Icons are decorative by default, with `aria-hidden="true"` and
`focusable="false"`. This is the correct default when an adjacent label or a
`rowan-icon-button` `label` already communicates the action.

Use a `label` only when the icon itself conveys meaningful information:

```js
import { CircleCheck } from "@rowan-ui/icons/icons/circle-check";

const confirmation = CircleCheck({
  label: "Synchronization completed",
  size: 24,
});
```

A labeled icon receives `role="img"` and its accessible name from `label`. Do
not duplicate a nearby visible label with an icon label.

## Styling

Icons use a `24 x 24` view box, `currentColor`, round line caps, and a default
stroke width of `2`. Set `size`, `strokeWidth`, or `className` when creating an
icon, then style it using ordinary CSS.

## Source and licensing

The generated icon geometry is derived from [Lucide Icons](https://lucide.dev/),
specifically the `lucide-static` package. Lucide is licensed under the ISC
License. Rowan's factory and package code are MIT-licensed. See [NOTICE](./NOTICE)
for source attribution and third-party license text.

Core Rowan components remain icon-agnostic and accept icons through their
existing slots. The declarative entry modules register only explicitly imported
icons; they do not add an all-icons registry to the core package.
