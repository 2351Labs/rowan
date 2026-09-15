# @rowan-ui/icons

`@rowan-ui/icons` is Rowan's optional SVG icon package. It has no dependency on
`@rowan-ui/core`, registers no custom elements, and never asks core components to
look up an icon by a string name.

It currently ships 2,098 individually importable icons generated from Lucide
Static 1.45.0.

## Install

```sh
npm install @rowan-ui/icons
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

The package intentionally contains no runtime name-to-icon registry. Core Rowan
components remain icon-agnostic and accept icons through their existing slots.
