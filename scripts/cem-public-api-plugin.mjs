const LIFECYCLE = new Set([
  "connectedCallback",
  "disconnectedCallback",
  "attributeChangedCallback",
  "adoptedCallback",
  "formAssociatedCallback",
  "formDisabledCallback",
  "formResetCallback",
  "formStateRestoreCallback",
]);

const INTERNAL_METHODS = new Set([
  "render",
  "requestRender",
  "applyValidity",
  "setComponentStyles",
  "addCleanup",
  "listen",
  "observe",
  "reflectBoolean",
  "reflectString",
  "reflectNumber",
  "readBoolean",
  "readString",
  "readNumber",
  "setAttribute",
]);

const INTERNAL_FIELDS = new Set(["renderRoot"]);

export function isPublicApiMember(member) {
  if (!member || typeof member !== "object") return false;
  if (member.privacy === "private" || member.privacy === "protected") return false;
  if (typeof member.name === "string" && member.name.startsWith("#")) return false;
  if (member.static) return false;
  if (LIFECYCLE.has(member.name) || INTERNAL_METHODS.has(member.name)) return false;
  if (INTERNAL_FIELDS.has(member.name)) return false;
  return true;
}

export function stripPrivateApi(manifest) {
  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.kind !== "class" || !Array.isArray(declaration.members)) continue;
      declaration.members = declaration.members.filter(isPublicApiMember);
    }
  }

  return manifest;
}

export function cemPublicApiPlugin() {
  return {
    name: "rowan-cem-public-api",
    packageLinkPhase({ customElementsManifest }) {
      stripPrivateApi(customElementsManifest);
    },
  };
}
