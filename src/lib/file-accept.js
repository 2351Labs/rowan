export function parseAcceptList(accept) {
  return String(accept ?? "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

export function fileMatchesAccept(file, accept) {
  if (!(file instanceof File)) return false;

  const tokens = parseAcceptList(accept);
  if (tokens.length === 0) return true;

  const name = String(file.name ?? "").toLowerCase();
  const type = String(file.type ?? "").toLowerCase();
  const extensionIndex = name.lastIndexOf(".");
  const extension = extensionIndex >= 0 ? name.slice(extensionIndex) : "";

  return tokens.some((token) => {
    if (token.startsWith(".")) return extension === token;
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

export function partitionAcceptedFiles(files, accept) {
  const incoming = Array.isArray(files) ? files.filter((file) => file instanceof File) : [];
  const accepted = [];
  const rejected = [];

  for (const file of incoming) {
    if (fileMatchesAccept(file, accept)) accepted.push(file);
    else rejected.push(file);
  }

  return { accepted, rejected };
}
