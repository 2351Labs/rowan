/**
 * Stdio MCP server. Tool results come from the bundled catalog.
 * stdout is reserved for the protocol; this module does not write to it.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadCatalog, toolHandlers } from "./tools.js";

const packageJson = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf8"),
);

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function callResult(result) {
  return {
    isError: Boolean(result.isError),
    content: [{ type: "text", text: result.text }],
  };
}

export function createRowanServer(catalog = loadCatalog()) {
  const server = new McpServer({
    name: "rowan",
    version: packageJson.version,
  });

  server.registerTool(
    "list_components",
    {
      title: "List Rowan components",
      description:
        "List every Rowan custom element with its package subpath import and a one-line description. Data is bundled in this package. There is no network call.",
      inputSchema: {},
      annotations: READ_ONLY,
    },
    async () => callResult(toolHandlers.list_components(catalog)),
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a Rowan component API",
      description:
        "Return the full public API for one component from the Custom Elements Manifest: attributes, properties, events, slots, CSS parts, CSS properties, and methods, plus the import subpath.",
      inputSchema: {
        component: z
          .string()
          .describe("Tag, slug, class, or import. Examples: rowan-button, button, RowanButton."),
      },
      annotations: READ_ONLY,
    },
    async (args) => callResult(toolHandlers.get_component(catalog, args)),
  );

  server.registerTool(
    "search_components",
    {
      title: "Search Rowan components",
      description:
        "Search components by tag, title, description, attribute, event, slot, or CSS part.",
      inputSchema: {
        query: z.string().describe("Words to match, for example date, dialog, or rowan-click."),
        limit: z.number().int().min(1).max(25).optional().describe("Maximum matches. Default 8."),
      },
      annotations: READ_ONLY,
    },
    async (args) => callResult(toolHandlers.search_components(catalog, args)),
  );

  server.registerTool(
    "get_example",
    {
      title: "Get a Rowan example",
      description:
        "Return a working HTML and/or React snippet for one component, plus excerpts copied from the Rowan docs and Storybook stories. Snippets import the component subpath and tokens.",
      inputSchema: {
        component: z.string().describe("Tag, slug, class, or import."),
        framework: z
          .enum(["html", "react"])
          .optional()
          .describe('Omit to return HTML and React. Otherwise "html" or "react".'),
      },
      annotations: READ_ONLY,
    },
    async (args) => callResult(toolHandlers.get_example(catalog, args)),
  );

  server.registerTool(
    "get_theming",
    {
      title: "Get Rowan theming and tokens",
      description:
        "Return theme imports, data-theme values, and CSS tokens. CSS is the runtime source of truth. There is no JavaScript theme provider.",
      inputSchema: {
        theme: z
          .string()
          .optional()
          .describe("Shipped theme: light, dark, lagoon, ember, slate, or midnight."),
        layer: z
          .enum(["overview", "semantic", "primitive", "component", "all"])
          .optional()
          .describe("Token layer to include. Default overview, which includes semantic tokens."),
      },
      annotations: READ_ONLY,
    },
    async (args) => callResult(toolHandlers.get_theming(catalog, args)),
  );

  return server;
}
