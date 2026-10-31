import { button, field, h } from "../dom.js";
import { bindForm } from "../forms.js";

export function renderSignIn(outlet, ctx) {
  renderAuth(outlet, ctx, {
    page: "sign-in",
    title: "Sign in",
    lede: "Operations console for Lumen Goods. This screen is static UI.",
    formId: "sign-in-form",
    heading: "Enter an email and password to preview validation",
    submit: "Continue",
    fields: [
      emailField("sign-in-email"),
      passwordField("sign-in-password", "password", "Password", "current-password"),
    ],
    notice: "This starter does not sign you in. Open the console to work with the sample orders.",
    links: [
      ["#/forgot-password", "Forgot password"],
      ["#/sign-up", "Create an account"],
      ["#/", "Open the console"],
    ],
  });
}

export function renderSignUp(outlet, ctx) {
  const password = passwordField("sign-up-password", "password", "Password", "new-password");
  const confirm = passwordField("sign-up-confirm", "confirm", "Confirm password", "new-password");
  renderAuth(outlet, ctx, {
    page: "sign-up",
    title: "Create an account",
    lede: "A preview of the registration form. No account is created.",
    formId: "sign-up-form",
    heading: "Check the registration form",
    submit: "Create account",
    fields: [
      text("sign-up-name", "name", "Your name", { required: true, autocomplete: "name" }),
      text("sign-up-company", "company", "Company", {
        required: true,
        autocomplete: "organization",
      }),
      emailField("sign-up-email"),
      password,
      confirm,
    ],
    validate() {
      if (password.value === confirm.value) {
        confirm.setValidity({});
        confirm.invalid = false;
        return [];
      }
      confirm.setValidity({ customError: true }, "Passwords do not match.");
      confirm.invalid = true;
      return [
        { fieldId: confirm.id, label: "Confirm password", message: "Passwords do not match." },
      ];
    },
    notice: "Nothing was submitted. The console is available with the sample data.",
    links: [
      ["#/sign-in", "Already have an account"],
      ["#/", "Open the console"],
    ],
  });
}

export function renderForgot(outlet, ctx) {
  renderAuth(outlet, ctx, {
    page: "forgot-password",
    title: "Reset password",
    lede: "A preview of the reset form. No email is sent.",
    formId: "forgot-form",
    heading: "Enter the email on the account",
    submit: "Send reset link",
    fields: [emailField("forgot-email")],
    notice: "If this were production, a reset link would be emailed. Nothing was sent.",
    links: [
      ["#/sign-in", "Back to sign in"],
      ["#/", "Open the console"],
    ],
  });
}

function renderAuth(outlet, ctx, config) {
  outlet.replaceChildren();
  const screen = h("div", { class: "auth-screen", "data-page": config.page, "data-ready": "true" });
  const card = h("rowan-card", { class: "auth-card" });
  const body = h("div", { class: "auth-body" });
  body.append(
    h("span", { class: "brand-mark", text: "L", "aria-hidden": "true" }),
    h("h1", { tabindex: "-1", text: config.title }),
    h("p", { class: "lede", text: config.lede }),
  );

  const form = h("form", { id: config.formId, class: "stack" });
  const summary = h("rowan-validation-summary", {
    "for-form": config.formId,
    heading: config.heading,
  });
  const layout = h("rowan-form-layout", { columns: "1" });
  for (const entry of config.fields) layout.append(entry.wrapper);
  const alert = h("rowan-alert", { tone: "info", hidden: true });
  form.append(
    summary,
    layout,
    alert,
    h("div", { class: "form-actions" }, button(config.submit, { type: "submit" })),
  );
  const links = h("div", { class: "auth-links" });
  for (const [href, label] of config.links) links.append(h("rowan-link", { href }, label));
  body.append(form, links);
  card.append(body);
  screen.append(card);
  outlet.append(screen);

  bindForm(form, {
    summary,
    validate: config.validate,
    onValid() {
      alert.hidden = false;
      alert.textContent = config.notice;
    },
  });
}

function text(id, name, label, extra = {}) {
  const control = h("rowan-text-field", {
    id,
    name,
    label,
    required: extra.required || null,
    type: extra.type || null,
    autocomplete: extra.autocomplete || null,
  });
  return { control, wrapper: field(label, control, { required: extra.required }) };
}

function emailField(id) {
  return text(id, "email", "Email", { required: true, type: "email", autocomplete: "email" });
}

function passwordField(id, name, label, autocomplete) {
  const entry = text(id, name, label, { required: true, type: "password", autocomplete });
  entry.control.wrapper = entry.wrapper;
  return entry.control;
}
