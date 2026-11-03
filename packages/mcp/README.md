# @rowan-ui/mcp

Stdio [MCP](https://modelcontextprotocol.io) server for [Rowan](https://2351labs.github.io/rowan/). It answers questions about Rowan custom elements from a catalog bundled in this package. It does not fetch the docs site, and it does not add anything to a component bundle.

Rowan stays vanilla Web Components. Import a component from its package subpath to register it. There is no framework runtime.

## Run

```bash
npx -y @rowan-ui/mcp
```

Cursor (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "rowan": {
      "command": "npx",
      "args": ["-y", "@rowan-ui/mcp"]
    }
  }
}
```

Claude Code (`.mcp.json`):

```json
{
  "mcpServers": {
    "rowan": {
      "command": "npx",
      "args": ["-y", "@rowan-ui/mcp"]
    }
  }
}
```

VS Code / GitHub Copilot (`.vscode/mcp.json`):

```json
{
  "servers": {
    "rowan": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@rowan-ui/mcp"]
    }
  }
}
```

The same context is also published as text:

- https://2351labs.github.io/rowan/llms.txt
- https://2351labs.github.io/rowan/llms-full.txt

## Tools

| Tool                | What it returns                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `list_components`   | Every tag, its import subpath, and a one-line description                                                       |
| `get_component`     | Attributes, properties, events, slots, CSS parts, CSS properties, and methods from the Custom Elements Manifest |
| `search_components` | Components matching a tag, title, description, or API name                                                      |
| `get_example`       | A working HTML or React snippet, plus excerpts from the docs and Storybook stories                              |
| `get_theming`       | Theme imports, `data-theme` values, and CSS tokens                                                              |

`get_component` accepts a tag (`rowan-button`), a slug (`button`), a class (`RowanButton`), or an import path.

## Data

`data/catalog.json` is generated in the Rowan repo:

```bash
node packages/mcp/scripts/build-catalog.mjs
```

Regenerate it when component APIs, token CSS, docs examples, or stories change. The server reads that file from disk at startup.
