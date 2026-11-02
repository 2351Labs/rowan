// Tiny sync helper. The async part registry lives in load-component-tokens.js
// and is imported only by components that do not ship declarations inline.

export function cssForDeclarations(declarations) {
  if (declarations.length === 0) return "";
  const body = declarations.map(([name, value]) => "  " + name + ": " + value + ";").join("\n");
  return ":host {\n" + body + "\n}";
}

export function componentTokensFromDeclarations(declarations, prefixes) {
  const matched = declarations.filter(([name]) =>
    prefixes.some((prefix) => name.startsWith(prefix)),
  );
  return {
    names: matched.map(([name]) => name),
    cssText: cssForDeclarations(matched),
  };
}
