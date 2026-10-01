import { expect } from "@esm-bundle/chai";
import "./file-upload.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-file-upload", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("adds queued files from rowan-files-add events", async () => {
    const element = document.createElement("rowan-file-upload");
    document.body.append(element);
    await nextMicrotask();

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const fileA = new File(["alpha"], "alpha.csv", { type: "text/csv" });

    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: {
          files: [fileA],
          source: "picker",
        },
      }),
    );
    await nextMicrotask();

    expect(element.files).to.have.length(1);
    expect(element.files[0].name).to.equal("alpha.csv");
    expect(element.files[0].status).to.equal("queued");

    const renderedItems = element.shadowRoot.querySelectorAll("rowan-file-item");
    expect(renderedItems.length).to.equal(1);
  });

  it("emits rowan-files-add with normalized files", async () => {
    const element = document.createElement("rowan-file-upload");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    let detail = null;
    element.addEventListener("rowan-files-add", (event) => {
      eventCount += 1;
      detail = event.detail;
    });

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const fileA = new File(["bravo"], "bravo.csv", { type: "text/csv" });

    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: {
          files: [fileA],
          source: "drop",
        },
      }),
    );
    await nextMicrotask();

    expect(eventCount).to.equal(1);
    expect(detail.files).to.have.length(1);
    expect(detail.files[0].status).to.equal("queued");
    expect(detail.source).to.equal("drop");
  });

  it("supports remove and retry events from file items", async () => {
    const element = document.createElement("rowan-file-upload");
    element.files = [
      {
        id: "f-1",
        name: "retry.csv",
        size: 10,
        status: "failed",
      },
      {
        id: "f-2",
        name: "queued.csv",
        size: 20,
        status: "queued",
      },
    ];
    document.body.append(element);
    await nextMicrotask();

    let retryCount = 0;
    let removeCount = 0;

    element.addEventListener("rowan-file-retry", () => {
      retryCount += 1;
    });

    element.addEventListener("rowan-file-remove", () => {
      removeCount += 1;
    });

    const failedItem = element.shadowRoot.querySelector('rowan-file-item[data-file-id="f-1"]');
    failedItem.dispatchEvent(
      new CustomEvent("rowan-retry", {
        bubbles: true,
        composed: true,
      }),
    );

    const queuedItem = element.shadowRoot.querySelector('rowan-file-item[data-file-id="f-2"]');
    queuedItem.dispatchEvent(
      new CustomEvent("rowan-remove", {
        bubbles: true,
        composed: true,
      }),
    );
    await nextMicrotask();

    expect(retryCount).to.equal(1);
    expect(removeCount).to.equal(1);
    expect(element.files).to.have.length(1);
    expect(element.files[0].id).to.equal("f-1");
  });

  it("rejects synthetic files that fail accept", async () => {
    const element = document.createElement("rowan-file-upload");
    element.accept = ".csv";
    document.body.append(element);
    await nextMicrotask();

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const csv = new File(["sheet"], "report.csv", { type: "text/csv" });
    const exe = new File(["binary"], "setup.exe", { type: "application/x-msdownload" });

    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: {
          files: [exe, csv],
          source: "drop",
        },
      }),
    );
    await nextMicrotask();

    expect(element.files).to.have.length(1);
    expect(element.files[0].name).to.equal("report.csv");
  });

  it("enforces max-files limit", async () => {
    const element = document.createElement("rowan-file-upload");
    element.maxFiles = 1;
    document.body.append(element);
    await nextMicrotask();

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const fileA = new File(["a"], "a.csv", { type: "text/csv" });
    const fileB = new File(["b"], "b.csv", { type: "text/csv" });

    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: {
          files: [fileA, fileB],
          source: "picker",
        },
      }),
    );
    await nextMicrotask();

    expect(element.files).to.have.length(1);
    expect(element.files[0].name).to.equal("a.csv");
  });

  it("syncs host a11y defaults", async () => {
    const element = document.createElement("rowan-file-upload");
    element.label = "Upload documents";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("group");
    expect(element.internals.ariaLabel).to.equal("Upload documents");
    expect(element.internals.ariaDisabled).to.equal("false");

    element.disabled = true;
    await nextMicrotask();
    expect(element.internals.ariaDisabled).to.equal("true");
  });

  it("participates in form submission and required validity", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-file-upload");
    element.name = "docs";
    element.required = true;
    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);
    expect(new FormData(form).getAll("docs")).to.deep.equal([]);

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const fileA = new File(["alpha"], "alpha.csv", { type: "text/csv" });
    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: { files: [fileA], source: "picker" },
      }),
    );
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(true);
    const submitted = new FormData(form).getAll("docs");
    expect(submitted).to.have.length(1);
    expect(submitted[0]).to.be.instanceOf(File);
    expect(submitted[0].name).to.equal("alpha.csv");
  });

  it("clears queued files on form reset without emitting", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-file-upload");
    element.name = "docs";
    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    dropzone.dispatchEvent(
      new CustomEvent("rowan-files-add", {
        bubbles: true,
        composed: true,
        detail: {
          files: [new File(["alpha"], "alpha.csv", { type: "text/csv" })],
          source: "picker",
        },
      }),
    );
    await nextMicrotask();
    expect(element.files).to.have.length(1);

    let removals = 0;
    element.addEventListener("rowan-file-remove", () => {
      removals += 1;
    });

    form.reset();
    await nextMicrotask();

    expect(element.files).to.deep.equal([]);
    expect(removals).to.equal(0);
    expect(new FormData(form).getAll("docs")).to.deep.equal([]);
  });

  it("uses inherited locale and property-only messages across the upload composition", async () => {
    const wrapper = document.createElement("div");
    wrapper.lang = "de-DE";
    const element = document.createElement("rowan-file-upload");
    element.files = [
      {
        id: "upload-1",
        name: "",
        size: 1536,
        status: "uploading",
        progress: 42,
      },
    ];
    wrapper.append(element);
    document.body.append(wrapper);
    await nextMicrotask();
    await nextMicrotask();

    const events = [];
    ["rowan-files-add", "rowan-file-remove", "rowan-file-retry", "rowan-file-cancel"].forEach(
      (type) => {
        element.addEventListener(type, () => events.push(type));
      },
    );
    element.messages = {
      ariaLabel: "Carga de archivos",
      dropzoneDescription: "Arrastra archivos o abre el selector.",
      dropzoneLabel: "Suelta archivos aqui",
      empty: "No hay archivos.",
      itemCancel: "Cancelar",
      itemStatusUploading: "Cargando",
      itemUntitledFile: "Sin nombre",
      itemUploadProgress: "Progreso {progress}%",
    };
    await nextMicrotask();
    await nextMicrotask();

    const dropzone = element.shadowRoot.querySelector("rowan-dropzone");
    const item = element.shadowRoot.querySelector("rowan-file-item");
    expect(element.getAttribute("messages")).to.equal(null);
    expect(element.locale).to.equal("de-DE");
    expect(element.internals.ariaLabel).to.equal("Carga de archivos");
    expect(dropzone.label).to.equal("Suelta archivos aqui");
    expect(dropzone.description).to.equal("Arrastra archivos o abre el selector.");
    expect(item.shadowRoot.querySelector('[part="name"]').textContent).to.equal("Sin nombre");
    expect(item.shadowRoot.querySelector('[part="status"]').textContent).to.equal("Cargando");
    expect(item.shadowRoot.querySelector('[data-action="cancel"]').textContent).to.equal(
      "Cancelar",
    );
    expect(item.shadowRoot.querySelector('[part="progress"]').getAttribute("aria-label")).to.equal(
      "Progreso 42%",
    );
    expect(events).to.deep.equal([]);

    element.files = [];
    await nextMicrotask();

    expect(element.shadowRoot.querySelector('[part="empty"]').textContent).to.equal(
      "No hay archivos.",
    );
    expect(events).to.deep.equal([]);
  });
});
