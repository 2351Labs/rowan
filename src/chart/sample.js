/**
 * Lazy shape-preserving sampler for large chart series.
 * Keeps the min and max of each x bucket so spikes survive, then asks the
 * chart to draw again. The eager path has already drawn a bounded stride.
 */

function numeric(point) {
  if (typeof point === "number") return Number.isFinite(point) ? point : null;
  if (point == null || typeof point !== "object") return null;
  const value = point.value ?? point.y;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function columnsOf(series) {
  if (!Array.isArray(series) || !series.length) return [];
  if (typeof series[0] === "number" || series[0] == null) {
    return [series.map((point) => (typeof point === "number" && Number.isFinite(point) ? point : null))];
  }
  return series.map((item) => {
    const points = item?.points || item?.values;
    if (!Array.isArray(points)) return [];
    return points.map((point) => numeric(point));
  });
}

/**
 * Indexes whose y is the min or max of a bucket. Endpoints stay.
 * @param {Array<Array<number | null>>} columns
 * @param {number} start
 * @param {number} end
 * @param {number} cap
 */
export function bucketIndexes(columns, start, end, cap) {
  const keep = new Set([start, end]);
  const seriesCount = Math.max(columns.length, 1);
  const perSeries = Math.max(2, Math.floor(cap / seriesCount));
  const buckets = Math.max(1, Math.floor(perSeries / 2));
  const span = Math.max(1, end - start);
  for (const values of columns) {
    if (!values?.length) continue;
    for (let bucket = 0; bucket < buckets; bucket += 1) {
      const lo = start + Math.floor((bucket * span) / buckets);
      const hi = bucket === buckets - 1 ? end : start + Math.floor(((bucket + 1) * span) / buckets);
      let minIndex = -1;
      let maxIndex = -1;
      for (let index = lo; index <= hi && index < values.length; index += 1) {
        const value = values[index];
        if (value == null) continue;
        if (minIndex < 0 || value < values[minIndex]) minIndex = index;
        if (maxIndex < 0 || value > values[maxIndex]) maxIndex = index;
      }
      if (minIndex >= 0) keep.add(minIndex);
      if (maxIndex >= 0) keep.add(maxIndex);
    }
  }
  return [...keep].sort((left, right) => left - right);
}

function scatterIndexes(series, cap, x0, x1) {
  const keep = new Set();
  const perSeries = Math.max(2, Math.floor(cap / Math.max(series.length, 1)));
  const buckets = Math.max(1, Math.floor(perSeries / 2));
  for (const item of series) {
    const points = item?.points;
    if (!Array.isArray(points)) continue;
    const finite = [];
    points.forEach((point, index) => {
      if (typeof point?.x !== "number" || typeof point?.y !== "number") return;
      if (x0 != null && (point.x < x0 || point.x > x1)) return;
      finite.push({ index, x: point.x, y: point.y });
    });
    if (!finite.length) continue;
    finite.sort((left, right) => left.x - right.x);
    keep.add(finite[0].index);
    keep.add(finite.at(-1).index);
    const span = finite.length;
    for (let bucket = 0; bucket < buckets; bucket += 1) {
      const lo = Math.floor((bucket * span) / buckets);
      const hi = bucket === buckets - 1 ? span : Math.floor(((bucket + 1) * span) / buckets);
      let min = finite[lo];
      let max = finite[lo];
      for (let index = lo; index < hi; index += 1) {
        const point = finite[index];
        if (point.y < min.y) min = point;
        if (point.y > max.y) max = point;
      }
      keep.add(min.index);
      keep.add(max.index);
    }
  }
  return [...keep].sort((left, right) => left - right);
}

function sameIndexes(left, right) {
  if (!left || left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) if (left[index] !== right[index]) return false;
  return true;
}

/**
 * Replace the stride with min/max buckets. `paint` redraws when the caller is
 * not already inside render.
 * @param {HTMLElement} host
 * @param {string} key
 * @param {boolean} [paint]
 */
export function zoomWindow(host, view, origin) {
  const count = host.__n || 0;
  const full = Math.abs(view.width - origin.width) < 0.5 && Math.abs(view.x - origin.x) < 0.5;
  const redraw = () => {
    host.__drawToken = "";
    host.__refined = false;
    host.requestRender?.();
  };
  if (host.localName === "rowan-scatter-chart" && host.__xScale) {
    const scale = host.__xScale;
    const xAt = (x) => scale.min + ((x - scale.left) / Math.max(scale.width, 1)) * (scale.max - scale.min);
    const lo = full ? null : Math.min(xAt(view.x), xAt(view.x + view.width));
    const hi = full ? null : Math.max(xAt(view.x), xAt(view.x + view.width));
    if (host.__x0 === lo && host.__x1 === hi) return;
    host.__x0 = lo;
    host.__x1 = hi;
    redraw();
    return;
  }
  const map = host.__xMapFull;
  if (!map || map.i1 === map.i0) return;
  let start = 0;
  let end = count - 1;
  if (!full) {
    const indexAt = (x) => map.i0 + ((x - map.x0) / (map.x1 - map.x0)) * (map.i1 - map.i0);
    const left = Math.round(indexAt(view.x));
    const right = Math.round(indexAt(view.x + view.width));
    start = Math.max(0, Math.min(count - 1, Math.min(left, right)));
    end = Math.max(start, Math.min(count - 1, Math.max(left, right)));
  }
  if (host.__z0 === start && host.__z1 === end) return;
  host.__z0 = start;
  host.__z1 = end;
  redraw();
}

export function refine(host, token, paint = true) {
  host.__refineSync = (next) => refine(host, next, false);
  let cap = host.__drawCap;
  const count = host.__n || 0;
  if (!count || !Number.isFinite(cap)) return;
  if (host.getAttribute("large-series") == null) {
    const pixels = Math.max(48, Math.min(1600, ((host.clientWidth || host.__px || 640) | 0) * 2));
    if (pixels < cap) cap = host.__drawCap = pixels;
  }
  const end = Math.max(0, Math.min(count - 1, host.__z1 ?? count - 1));
  const start = Math.max(0, Math.min(end, host.__z0 || 0));
  if (token && host.__drawToken === token && host.__refined) return;
  const scatter = Array.isArray(host.__seriesRef?.[0]?.points);
  const indexes = scatter
    ? scatterIndexes(host.__seriesRef, cap, host.__x0, host.__x1)
    : bucketIndexes(columnsOf(host.__seriesRef), start, end, cap);
  if (!indexes.length) return;
  const unchanged = sameIndexes(host.__drawIdx, indexes);
  host.__drawIdx = indexes;
  host.__drawSet = new Set(indexes);
  host.__drawToken = token;
  host.__refined = true;
  if (!unchanged && paint && host.isConnected) host.requestRender?.();
}
