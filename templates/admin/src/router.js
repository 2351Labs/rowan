export function createRouter(routes, onRoute) {
  function match(path) {
    for (const route of routes) {
      const result = path.match(route.pattern);
      if (result) return { route, params: result.slice(1), path };
    }
    return null;
  }

  function read() {
    const raw = (location.hash.replace(/^#/, "") || "/").split("?")[0] || "/";
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return (
      match(path) || { route: routes.find((route) => route.name === "not-found"), params: [], path }
    );
  }

  async function go() {
    await onRoute(read());
  }

  window.addEventListener("hashchange", () => {
    void go();
  });

  return {
    navigate(path) {
      const next = path.startsWith("#") ? path : `#${path.startsWith("/") ? path : `/${path}`}`;
      if (location.hash === next) void go();
      else location.hash = next;
    },
    start() {
      if (!location.hash) location.hash = "#/";
      else void go();
    },
  };
}
