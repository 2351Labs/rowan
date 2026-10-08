const nextMicrotask = () => Promise.resolve();

/**
 * Disconnects a host and puts it back in the same place, then waits for
 * BaseElement's queued reconnect render.
 *
 * @param {HTMLElement} host
 * @returns {Promise<HTMLElement>}
 */
export async function reconnectHost(host) {
  const parent = host.parentNode ?? document.body;
  const next = host.nextSibling;
  host.remove();
  parent.insertBefore(host, next);
  await nextMicrotask();
  await nextMicrotask();
  return host;
}
