# Rowan Vue starter

The same one-page dashboard, using Rowan custom elements in a Vue 3 template. `vite.config.js` sets `compilerOptions.isCustomElement` so tags that start with `rowan-` stay custom elements. Value and delta are properties, so the sample assigns them after mount. `@rowan-ui/core` comes from npm.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/2351Labs/rowan/tree/main/starters/vue)

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5177/ . Inside the Rowan repo, `npm run dev --workspace=@rowan-ui/starter-vue` uses the local workspace copy. StackBlitz installs the published package.
