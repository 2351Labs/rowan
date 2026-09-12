function normalizePositiveNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function normalizeKey(value, index) {
  const text = String(value ?? "").trim();
  return text || String(index);
}

/**
 * Keyed variable-size collection layout shared by collection views.
 *
 * This intentionally owns no DOM. Views provide their own semantic markup
 * while sharing stable keys, measured sizes, and visible-window calculation.
 */
export class VirtualCollection {
  #items = [];
  #itemKey = null;
  #estimatedItemSize = 40;
  #measuredSizes = new Map();
  #entries = [];
  #totalSize = 0;
  #needsLayout = true;
  #duplicateKeys = [];

  get items() {
    return [...this.#items];
  }

  set items(value) {
    this.#items = Array.isArray(value) ? [...value] : [];
    this.#needsLayout = true;
  }

  get itemKey() {
    return this.#itemKey;
  }

  set itemKey(value) {
    this.#itemKey = typeof value === "function" || typeof value === "string" ? value : null;
    this.#needsLayout = true;
  }

  get estimatedItemSize() {
    return this.#estimatedItemSize;
  }

  set estimatedItemSize(value) {
    const next = normalizePositiveNumber(value, 40);
    if (next === this.#estimatedItemSize) return;

    this.#estimatedItemSize = next;
    this.#needsLayout = true;
  }

  get entries() {
    this.#ensureLayout();
    return this.#entries;
  }

  get totalSize() {
    this.#ensureLayout();
    return this.#totalSize;
  }

  get duplicateKeys() {
    this.#ensureLayout();
    return [...this.#duplicateKeys];
  }

  setMeasuredSize(key, value) {
    const normalizedKey = String(key);
    const next = normalizePositiveNumber(value, 0);
    if (next <= 0 || this.#measuredSizes.get(normalizedKey) === next) return false;

    this.#measuredSizes.set(normalizedKey, next);
    this.#needsLayout = true;
    return true;
  }

  clearMeasurements() {
    if (this.#measuredSizes.size === 0) return;

    this.#measuredSizes.clear();
    this.#needsLayout = true;
  }

  range(scrollOffset, viewportSize, overscan = 3) {
    this.#ensureLayout();

    if (this.#entries.length === 0) {
      return { start: 0, end: -1, entries: [], totalSize: 0 };
    }

    const viewport = Math.max(1, Number(viewportSize) || this.#estimatedItemSize);
    const offset = Math.max(0, Number(scrollOffset) || 0);
    const extra = Math.max(0, Math.trunc(Number(overscan) || 0));
    const start = Math.max(0, this.#indexAtOffset(offset) - extra);
    const end = Math.min(this.#entries.length - 1, this.#indexAtOffset(offset + viewport) + extra);

    return {
      start,
      end,
      entries: this.#entries.slice(start, end + 1),
      totalSize: this.#totalSize,
    };
  }

  entryAt(index) {
    this.#ensureLayout();
    return this.#entries[index] ?? null;
  }

  #indexAtOffset(offset) {
    let start = 0;
    let end = this.#entries.length - 1;

    while (start <= end) {
      const middle = Math.floor((start + end) / 2);
      const entry = this.#entries[middle];

      if (entry.offset + entry.size <= offset) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }

    return Math.min(Math.max(start, 0), this.#entries.length - 1);
  }

  #resolveKey(item, index) {
    if (typeof this.#itemKey === "function") {
      return this.#itemKey(item, index);
    }

    if (typeof this.#itemKey === "string" && item && typeof item === "object") {
      return item[this.#itemKey];
    }

    if (item && typeof item === "object" && "id" in item) {
      return item.id;
    }

    return index;
  }

  #ensureLayout() {
    if (!this.#needsLayout) return;

    const keyCounts = new Map();
    const liveKeys = new Set();
    const entries = [];
    const duplicateKeys = [];
    let offset = 0;

    this.#items.forEach((item, index) => {
      const baseKey = normalizeKey(this.#resolveKey(item, index), index);
      const occurrence = keyCounts.get(baseKey) ?? 0;
      keyCounts.set(baseKey, occurrence + 1);

      if (occurrence > 0) {
        duplicateKeys.push(baseKey);
      }

      const key = occurrence === 0 ? baseKey : `${baseKey}--${occurrence}`;
      const size = this.#measuredSizes.get(key) ?? this.#estimatedItemSize;
      const entry = { item, index, key, offset, size };

      entries.push(entry);
      liveKeys.add(key);
      offset += size;
    });

    for (const key of this.#measuredSizes.keys()) {
      if (!liveKeys.has(key)) this.#measuredSizes.delete(key);
    }

    this.#entries = entries;
    this.#totalSize = offset;
    this.#duplicateKeys = duplicateKeys;
    this.#needsLayout = false;
  }
}
