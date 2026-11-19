/** Category ticks. Long axes keep a few labels at their original positions. */
export function paintCategoryAxis(axis, labels, horizontal = false) {
  const count = labels.length;
  const thin = count > 24;
  axis.replaceChildren();
  axis.style.setProperty("--category-count", String(Math.max(thin ? 1 : count, 1)));
  axis.style.position = thin ? "relative" : "";
  const fragment = document.createDocumentFragment();
  const step = thin ? Math.ceil(count / 8) : 1;
  const add = (index) => {
    const item = document.createElement("span");
    const label = labels[index];
    item.textContent = label;
    item.title = label;
    if (thin) {
      item.style.position = "absolute";
      const pos = count <= 1 ? "0%" : `${((index / (count - 1)) * 100).toFixed(2)}%`;
      if (horizontal) item.style.top = pos;
      else {
        item.style.left = pos;
        item.style.transform = "translateX(-50%)";
      }
    }
    fragment.append(item);
  };
  for (let index = 0; index < count; index += step) add(index);
  if (thin && (count - 1) % step) add(count - 1);
  axis.append(fragment);
}
