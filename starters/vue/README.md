# Rowan Vue starter

The same Harbor dashboard, using Rowan custom elements in a Vue 3 template. `vite.config.js` sets `compilerOptions.isCustomElement` so tags that start with `rowan-` stay custom elements. Values, deltas, chart series, and table columns are properties, so the sample assigns them after `customElements.whenDefined`. `@rowan-ui/core` and `@rowan-ui/icons` come from npm.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/2351Labs/rowan/tree/main/starters/vue)

![Harbor dashboard in the light theme](./screenshots/light.png)

![Harbor dashboard in the dark theme](./screenshots/dark.png)

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5177/ . Inside the Rowan repo, `npm run dev --workspace=@rowan-ui/starter-vue` uses the local workspace copy. StackBlitz installs the published package.
