import "./data-state.js";
import "../button/button.js";
import "../empty-state/empty-state.js";
import "../skeleton/skeleton.js";
import "../spinner/spinner.js";

function createReady() {
  const body = document.createElement("p");
  body.textContent = "Fill rate is 82% versus a target of 90%.";
  return body;
}

function createLoading() {
  const wrap = document.createElement("div");
  wrap.slot = "loading";
  wrap.style.display = "grid";
  wrap.style.gap = "0.5rem";
  const spinner = document.createElement("rowan-spinner");
  spinner.label = "Loading fill rate";
  const skeleton = document.createElement("rowan-skeleton");
  skeleton.height = "2.5rem";
  wrap.append(spinner, skeleton);
  return wrap;
}

function createEmpty() {
  const empty = document.createElement("rowan-empty-state");
  empty.slot = "empty";
  const title = document.createElement("span");
  title.slot = "title";
  title.textContent = "No fill-rate samples";
  const copy = document.createElement("p");
  copy.textContent = "Connect a source to populate this panel.";
  empty.append(title, copy);
  return empty;
}

function createError() {
  const error = document.createElement("p");
  error.slot = "error";
  error.textContent = "The fill-rate query failed.";
  return error;
}

function createRetry() {
  const button = document.createElement("rowan-button");
  button.slot = "actions";
  button.textContent = "Retry";
  return button;
}

function createHost(state) {
  const el = document.createElement("rowan-data-state");
  el.state = state;
  el.append(createReady(), createLoading(), createEmpty(), createError(), createRetry());
  return el;
}

export default {
  title: "Components/Actions & Feedback/Data State",
  tags: ["autodocs"],
  args: { state: "ready" },
  argTypes: {
    state: {
      control: "select",
      options: ["ready", "loading", "empty", "error"],
    },
  },
};

export const Playground = {
  render: (args) => createHost(args.state),
};

export const Retry = {
  render: () => createHost("error"),
};
