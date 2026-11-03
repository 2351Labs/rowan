import packageJson from "../package.json";
import mcpPackageJson from "../packages/mcp/package.json";

const ROWAN_VERSION = packageJson.version;
const MCP_VERSION = mcpPackageJson.version;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function codeBlock(code, language = "js") {
  return `<pre class="code-block" data-language="${language}"><code>${escapeHtml(code)}</code></pre>`;
}

const CURSOR_SNIPPET = `{
  "mcpServers": {
    "rowan": {
      "command": "npx",
      "args": ["-y", "@rowan-ui/mcp"]
    }
  }
}`;

const CLAUDE_SNIPPET = `{
  "mcpServers": {
    "rowan": {
      "command": "npx",
      "args": ["-y", "@rowan-ui/mcp"]
    }
  }
}`;

const VSCODE_SNIPPET = `{
  "servers": {
    "rowan": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@rowan-ui/mcp"]
    }
  }
}`;

const IMPORT_SNIPPET = `npm install @rowan-ui/core@${ROWAN_VERSION}

import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/button";`;

export const AI_TOOLS_PAGE = {
  id: "ai-tools",
  group: "Overview",
  title: "Use Rowan with AI tools",
  summary:
    "Point Cursor, Claude Code, or VS Code at llms.txt or the Rowan MCP server so generated code uses real component APIs.",
  tags: ["ai", "mcp", "cursor", "claude", "copilot"],
  keywords: [
    "ai",
    "mcp",
    "cursor",
    "claude",
    "claude code",
    "copilot",
    "vscode",
    "vs code",
    "llms.txt",
    "llms-full",
  ],
  content: () => `
      <section class="doc-section" data-doc-section id="ai-overview">
        <h2>Context the agent can read</h2>
        <p>Rowan stays a set of native custom elements. An agent needs the import subpath, the public attributes, properties, events, slots, and parts, and the token names. Two generated files carry that, from the Custom Elements Manifest and the docs:</p>
        <ul>
          <li><a href="https://2351labs.github.io/rowan/llms.txt">llms.txt</a> is the compact index: install, the import subpath for each component, theming, and a one-block API summary.</li>
          <li><a href="https://2351labs.github.io/rowan/llms-full.txt">llms-full.txt</a> adds descriptions, methods, CSS properties, token lists, and copy-paste HTML and React examples.</li>
        </ul>
        <p>The same text ships in the <code>@rowan-ui/core@${ROWAN_VERSION}</code> package as <code>llms.txt</code> and <code>llms-full.txt</code>. <code>@rowan-ui/mcp@${MCP_VERSION}</code> is a stdio MCP server with the catalog bundled inside it. The server does not fetch this site.</p>
        ${codeBlock(IMPORT_SNIPPET, "bash")}
        <p><code>-y</code> on <code>npx</code> skips the install prompt. The command the tools run is <code>npx -y @rowan-ui/mcp</code>.</p>
      </section>

      <section class="doc-section" data-doc-section id="ai-cursor">
        <h2>Cursor</h2>
        <p>Save this as <code>.cursor/mcp.json</code> in the project, or add the same command in Cursor&rsquo;s MCP settings.</p>
        ${codeBlock(CURSOR_SNIPPET, "json")}
      </section>

      <section class="doc-section" data-doc-section id="ai-claude">
        <h2>Claude Code</h2>
        <p>Save this as <code>.mcp.json</code> in the project. Claude Code starts the server when the session opens.</p>
        ${codeBlock(CLAUDE_SNIPPET, "json")}
        ${codeBlock("claude mcp add rowan -- npx -y @rowan-ui/mcp", "bash")}
      </section>

      <section class="doc-section" data-doc-section id="ai-vscode">
        <h2>VS Code</h2>
        <p>GitHub Copilot in VS Code reads <code>.vscode/mcp.json</code>.</p>
        ${codeBlock(VSCODE_SNIPPET, "json")}
      </section>

      <section class="doc-section" data-doc-section id="ai-tools-list">
        <h2>What the server exposes</h2>
        <ul>
          <li><code>list_components</code> lists every tag and its import subpath.</li>
          <li><code>get_component</code> returns attributes, properties, events, slots, CSS parts, CSS properties, and methods for one component.</li>
          <li><code>search_components</code> matches a tag, title, description, or API name.</li>
          <li><code>get_example</code> returns a working HTML or React snippet, plus excerpts taken from these docs and the Storybook stories.</li>
          <li><code>get_theming</code> returns theme imports, <code>data-theme</code> values, and the CSS tokens.</li>
        </ul>
        <p>Pass <code>rowan-button</code>, <code>button</code>, or <code>RowanButton</code> to <code>get_component</code> and <code>get_example</code>. Import <code>@rowan-ui/core/button</code> to register <code>&lt;rowan-button&gt;</code>. <code>&lt;rowan-icon&gt;</code> comes from <code>@rowan-ui/icons/elements/&lt;name&gt;</code>, and the map comes from <code>@rowan-ui/maplibre/map</code>.</p>
      </section>
    `,
};
