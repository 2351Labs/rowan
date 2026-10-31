import apiReference from "./generated/api-reference.json";

export const API_REFERENCES = apiReference.components;

const BY_TAG = new Map(API_REFERENCES.map((component) => [component.tagName, component]));

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function codeBlock(code, language = "html") {
  return `<pre class="code-block" data-language="${language}"><code>${escapeHtml(code)}</code></pre>`;
}

function cell(value) {
  const text = String(value ?? "").trim();
  return text ? escapeHtml(text) : "—";
}

function codeCell(value) {
  const text = String(value ?? "").trim();
  return text ? `<code>${escapeHtml(text)}</code>` : "—";
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function table(headers, rows) {
  const head = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const body =
    rows.length > 0
      ? rows
          .map((row) => `<tr>${row.map((column) => `<td>${column}</td>`).join("")}</tr>`)
          .join("")
      : `<tr><td colspan="${headers.length}">None.</td></tr>`;
  return `<div class="docs-api-scroll"><table class="docs-api-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function renderApiReference(tagName) {
  const component = BY_TAG.get(tagName);
  if (!component) return "";

  const attributes = table(
    ["Attribute", "Type", "Default", "Reflects", "Description"],
    component.attributes.map((attribute) => [
      codeCell(attribute.name),
      codeCell(attribute.type),
      codeCell(attribute.default),
      yesNo(attribute.reflects),
      cell(attribute.description),
    ]),
  );
  const properties = table(
    ["Property", "Type", "Default", "Reflects", "Readonly", "Description"],
    component.properties.map((property) => [
      codeCell(property.name),
      codeCell(property.type),
      codeCell(property.default),
      yesNo(property.reflects),
      yesNo(property.readonly),
      cell(property.description),
    ]),
  );
  const events = table(
    ["Event", "Detail", "Description"],
    component.events.map((event) => [
      codeCell(event.name),
      cell(event.detail),
      cell(event.description),
    ]),
  );
  const slots = table(
    ["Slot", "Description"],
    component.slots.map((slot) => [codeCell(slot.name), cell(slot.description)]),
  );
  const parts = table(
    ["Part", "Description"],
    component.cssParts.map((part) => [codeCell(part.name), cell(part.description)]),
  );
  const cssProperties = table(
    ["Property", "Description"],
    component.cssProperties.map((property) => [codeCell(property.name), cell(property.description)]),
  );
  const methods = table(
    ["Method", "Parameters", "Description"],
    component.methods.map((method) => [
      codeCell(method.name),
      codeCell(method.parameters.join(", ")),
      cell(
        [method.description, method.inherited ? `Inherited from ${method.inherited}.` : ""]
          .filter(Boolean)
          .join(" "),
      ),
    ]),
  );
  const reactProps = table(
    ["Prop", "Maps to"],
    component.react.props.map((name) => [codeCell(name), cell("Element property")]),
  );
  const reactEvents = table(
    ["Event prop", "Event"],
    component.react.eventProps.map((prop) => [codeCell(prop.name), codeCell(prop.event)]),
  );

  return `
    <section class="doc-section" data-doc-section id="api-reference" data-api-tag="${escapeHtml(component.tagName)}">
      <h2>API Reference</h2>
      <p>${cell(component.description)}</p>
      <h3>Usage</h3>
      ${codeBlock(component.usage, "html")}
      <p>React wrapper: <code>${escapeHtml(component.react.component)}</code> from <code>@rowan-ui/core/react</code>.</p>
      <h3>Attributes</h3>
      ${attributes}
      <h3>Properties</h3>
      ${properties}
      <h3>Events</h3>
      ${events}
      <h3>Slots</h3>
      ${slots}
      <h3>CSS parts</h3>
      ${parts}
      <h3>CSS custom properties</h3>
      ${cssProperties}
      <h3>Methods</h3>
      ${methods}
      <h3>React props</h3>
      ${reactProps}
      <h3>React event props</h3>
      ${reactEvents}
    </section>
  `;
}
