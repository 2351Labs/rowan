/**
 * Wait until a component's shadow styles are reflected in computed style.
 *
 * Adopted stylesheets, and the `<style>` fallback, can be attached while
 * WebKit still reports unstyled computed values for several frames under
 * suite load. Seeing `cssRules` or waiting for one animation frame is not
 * enough: custom elements stay `display: inline` until the component sheet
 * wins.
 */

const DEADLINE_MS = 1200;

// Absolute positioning blockifies `inline-*` display, so the computed value
// can differ from the declared one. See CSS Display 3, "blockify".
const BLOCKIFIED_DISPLAY = new Map([
  ["inline", "block"],
  ["inline-block", "block"],
  ["inline-table", "table"],
  ["inline-flex", "flex"],
  ["inline-grid", "grid"],
  ["run-in", "block"],
  ["table-caption", "block"],
  ["table-cell", "block"],
  ["table-row", "block"],
  ["table-row-group", "block"],
  ["table-header-group", "block"],
  ["table-footer-group", "block"],
  ["table-column", "block"],
  ["table-column-group", "block"],
]);

// Displays that are not the user-agent initial value for the elements Rowan
// renders (`block` for divs, `inline` for spans).
const DISTINCTIVE_DISPLAY = new Set([
  "contents",
  "flex",
  "grid",
  "inline-block",
  "inline-flex",
  "inline-grid",
  "inline-table",
  "table",
  "table-cell",
  "table-row",
]);

function nextFrame() {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    requestAnimationFrame(finish);
    // A stalled animation frame must not consume the whole file timeout.
    setTimeout(finish, 48);
  });
}

function shadowSheets(root) {
  const sheets = [];
  const adopted = root.adoptedStyleSheets;
  if (adopted) {
    for (let index = 0; index < adopted.length; index += 1) sheets.push(adopted[index]);
  }
  const nodes = root.querySelectorAll("style, link[rel='stylesheet']");
  for (let index = 0; index < nodes.length; index += 1) {
    if (nodes[index].sheet) sheets.push(nodes[index].sheet);
  }
  return sheets;
}

function collectStyleRules(rules, into) {
  if (!rules) return;
  for (let index = 0; index < rules.length; index += 1) {
    const rule = rules[index];
    if (rule.type === CSSRule.STYLE_RULE) {
      into.push(rule);
      continue;
    }
    const mediaMatches =
      rule.type === CSSRule.MEDIA_RULE && rule.cssRules && matchMedia(rule.media.mediaText).matches;
    if (mediaMatches) collectStyleRules(rule.cssRules, into);
  }
}

function styleRules(root) {
  const rules = [];
  for (const sheet of shadowSheets(root)) {
    try {
      collectStyleRules(sheet.cssRules, rules);
    } catch {
      // A cross-origin sheet cannot be read. Ignore it.
    }
  }
  return rules;
}

function hostSelectorMatches(element, selector) {
  const text = selector.trim();
  if (text === ":host") return true;
  const wrapped = text.match(/^:host\((.*)\)$/);
  if (!wrapped) return false;
  try {
    return element.matches(wrapped[1].trim());
  } catch {
    return false;
  }
}

/**
 * Winning host `display`. `inline` is ignored because that is also the
 * user-agent value. `display: none` on a `[hidden]` host is ignored because
 * the user agent already computes that.
 */
function winningHostDisplay(element, rules) {
  const hidden = element.hasAttribute("hidden");
  let found = "";
  let rank = -1;
  for (const rule of rules) {
    if (!rule.selectorText) continue;
    const declared = rule.style.getPropertyValue("display").trim();
    if (!declared || declared === "inline") continue;
    if (declared === "none" && hidden) continue;
    for (const selector of rule.selectorText.split(",")) {
      const text = selector.trim();
      if (!text.startsWith(":host") || !hostSelectorMatches(element, text)) continue;
      const rankNow = text === ":host" ? 1 : 2;
      if (rankNow < rank) continue;
      rank = rankNow;
      found = declared;
    }
  }
  return found;
}

function inlineStyleHidesHostDisplay(element) {
  if (element.style.display) return true;
  const position = element.style.position;
  return position === "absolute" || position === "fixed" || position === "sticky";
}

function hostDisplayMatches(element, expected) {
  if (!expected || inlineStyleHidesHostDisplay(element)) return false;
  const actual = getComputedStyle(element).display;
  return actual === expected || BLOCKIFIED_DISPLAY.get(expected) === actual;
}

function hostCustomProperty(rules) {
  let found = null;
  for (const rule of rules) {
    if (!rule.selectorText) continue;
    const onHost = rule.selectorText.split(",").some((selector) => selector.trim() === ":host");
    if (!onHost) continue;
    for (let index = 0; index < rule.style.length; index += 1) {
      const name = rule.style.item(index);
      if (!name.startsWith("--")) continue;
      const value = rule.style.getPropertyValue(name).trim();
      if (!value || /var\(|color-mix\(|env\(/.test(value)) continue;
      found = { name, value };
    }
  }
  return found;
}

/**
 * A descendant whose `display` is not a user-agent initial value.
 * Returns true when one matches, false when candidates exist but none match,
 * and null when the sheet has no such candidate in the tree yet.
 */
function descendantStylesApplied(element, rules) {
  let sawTarget = false;
  for (const rule of rules) {
    if (!rule.selectorText) continue;
    const declared = rule.style.getPropertyValue("display").trim();
    if (!DISTINCTIVE_DISPLAY.has(declared)) continue;
    for (const selector of rule.selectorText.split(",")) {
      const text = selector.trim();
      if (!/^(\.|[a-z])[a-zA-Z0-9_-]*$/.test(text)) continue;
      const target = element.shadowRoot.querySelector(text);
      if (!target) continue;
      sawTarget = true;
      if (getComputedStyle(target).display === declared) return true;
    }
  }
  return sawTarget ? false : null;
}

function stylesAreApplied(element) {
  const root = element.shadowRoot;
  if (!root) return false;
  const rules = styleRules(root);
  if (rules.length === 0) return false;

  if (hostDisplayMatches(element, winningHostDisplay(element, rules))) return true;

  const descendant = descendantStylesApplied(element, rules);
  if (descendant !== null) return descendant;

  const property = hostCustomProperty(rules);
  if (!property) return false;
  return getComputedStyle(element).getPropertyValue(property.name).trim() === property.value;
}

/**
 * Resolves when `element`'s adopted stylesheets or shadow `<style>` fallback
 * show up in getComputedStyle. Throws if that does not happen.
 *
 * @param {Element} element
 */
export async function stylesApplied(element) {
  if (!(element instanceof Element)) {
    throw new TypeError("stylesApplied() expects an Element.");
  }

  const deadline = performance.now() + DEADLINE_MS;
  do {
    if (stylesAreApplied(element)) {
      // A frame after the computed value matches lets layout reads in the
      // caller observe the same applied styles. Returning before that frame
      // leaves later animation-frame waits stuck under suite load.
      await nextFrame();
      return;
    }
    await nextFrame();
  } while (performance.now() < deadline);

  const rules = element.shadowRoot ? styleRules(element.shadowRoot) : [];
  const expected = winningHostDisplay(element, rules) || "none";
  const display = getComputedStyle(element).display;
  throw new Error(
    `Styles did not apply within ${DEADLINE_MS}ms for <${element.localName}> ` +
      `(expected display ${expected}, computed ${display}, ${rules.length} rules).`,
  );
}
