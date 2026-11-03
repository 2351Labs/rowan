#!/usr/bin/env node
/**
 * npx @rowan-ui/mcp
 * Speaks MCP over stdin/stdout. Logs go to stderr.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRowanServer } from "./server.js";

try {
  const server = createRowanServer();
  await server.connect(new StdioServerTransport());
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
