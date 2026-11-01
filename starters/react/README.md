# Rowan React starter

The same Harbor dashboard as the Vite starter, rendered with the generated React wrappers. Vite compiles JSX with the automatic runtime (`jsx: "automatic"`), so the file does not import `React`. `@rowan-ui/core` and `@rowan-ui/icons` come from npm.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/2351Labs/rowan/tree/main/starters/react)

Chart series, KPI values, and table columns are element properties. The starter assigns them after the custom elements upgrade.

![Harbor dashboard in the light theme](./screenshots/light.png)

![Harbor dashboard in the dark theme](./screenshots/dark.png)

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5176/ . Inside the Rowan repo, `npm run dev --workspace=@rowan-ui/starter-react` uses the local workspace copy. StackBlitz installs the published package.
