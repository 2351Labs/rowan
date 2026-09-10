export function createEventScriptParameters({ steps = [], events = [] } = {}) {
  const normalizedSteps = Array.isArray(steps)
    ? steps
        .filter((step) => typeof step === "string" && step.trim().length > 0)
        .map((step) => step.trim())
    : [];

  const normalizedEvents = Array.isArray(events)
    ? events
        .filter((eventName) => typeof eventName === "string" && eventName.trim().length > 0)
        .map((eventName) => eventName.trim())
    : [];

  const descriptionLines = [];

  if (normalizedSteps.length > 0) {
    descriptionLines.push("Interaction script:");

    for (const [index, step] of normalizedSteps.entries()) {
      descriptionLines.push(`${index + 1}. ${step}`);
    }
  }

  if (normalizedEvents.length > 0) {
    if (descriptionLines.length > 0) {
      descriptionLines.push("");
    }

    descriptionLines.push(`Expected events: ${normalizedEvents.join(", ")}`);
  }

  return {
    docs: {
      description: {
        story: descriptionLines.join("\n"),
      },
    },
    rowanEventTrace: {
      script: normalizedSteps,
      events: normalizedEvents,
    },
  };
}
