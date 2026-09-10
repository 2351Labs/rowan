import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let calendarId = 0;

const DATE_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_VALUE_PATTERN = /^\d{4}-\d{2}$/;

function pad(number) {
  return String(number).padStart(2, "0");
}

function normalizeDateValue(value) {
  const next = String(value ?? "").trim();
  if (!DATE_VALUE_PATTERN.test(next)) return "";

  const [yearText, monthText, dayText] = next.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return "";
  }

  return next;
}

function normalizeMonthValue(value) {
  const next = String(value ?? "").trim();
  if (!MONTH_VALUE_PATTERN.test(next)) return "";

  const [yearText, monthText] = next.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return "";
  }

  return `${year}-${pad(month)}`;
}

function toDateFromValue(dateValue) {
  const normalized = normalizeDateValue(dateValue);
  if (!normalized) return null;

  const [yearText, monthText, dayText] = normalized.split("-");
  return new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
}

function toDateValue(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function toMonthValue(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

function addDays(dateValue, amount) {
  const source = toDateFromValue(dateValue);
  if (!source) return "";

  source.setUTCDate(source.getUTCDate() + amount);
  return toDateValue(source);
}

function addMonths(monthValue, amount) {
  const normalized = normalizeMonthValue(monthValue);
  if (!normalized) return "";

  const [yearText, monthText] = normalized.split("-");
  const date = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, 1));
  date.setUTCMonth(date.getUTCMonth() + amount);

  return toMonthValue(date);
}

function moveDateByMonths(dateValue, amount) {
  const source = toDateFromValue(dateValue);
  if (!source) return "";

  const originalDay = source.getUTCDate();
  const target = new Date(Date.UTC(source.getUTCFullYear(), source.getUTCMonth() + amount, 1));
  const maxDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(originalDay, maxDay));

  return toDateValue(target);
}

function todayDateValue() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function buildCalendarCells(monthValue) {
  const normalized = normalizeMonthValue(monthValue);
  if (!normalized) return [];

  const [yearText, monthText] = normalized.split("-");
  const monthStart = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, 1));
  const monthIndex = monthStart.getUTCMonth();

  const gridStart = new Date(monthStart);
  gridStart.setUTCDate(monthStart.getUTCDate() - monthStart.getUTCDay());

  const cells = [];
  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + index);

    cells.push({
      dateValue: toDateValue(date),
      day: date.getUTCDate(),
      currentMonth: date.getUTCMonth() === monthIndex,
    });
  }

  return cells;
}

/**
 * Calendar grid for date selection with keyboard navigation.
 * @tag rowan-calendar
 * @attr {string} name
 * @attr {string} value
 * @attr {string} month
 * @attr {string} label
 * @attr {string} locale
 * @attr {string} min
 * @attr {string} max
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart calendar
 * @csspart header
 * @csspart month-label
 * @csspart grid
 * @csspart day
 * @event rowan-change - Fired when a user selects a day
 */
export class RowanCalendar extends BaseElement {
  static formAssociated = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./calendar.css", import.meta.url).href;
  static observedAttributes = [
    "name",
    "value",
    "month",
    "label",
    "locale",
    "min",
    "max",
    "disabled",
    "required",
    "invalid",
  ];
  static upgradeProperties = [
    "name",
    "value",
    "month",
    "label",
    "locale",
    "min",
    "max",
    "disabled",
    "required",
    "invalid",
  ];

  #fallbackLabel = null;
  #monthLabel = null;
  #weekdayRow = null;
  #grid = null;
  #defaultValue = null;
  #calendarId = "";
  #autoInvalid = false;
  #focusedDate = "";

  connectedCallback() {
    super.connectedCallback();

    if (this.#defaultValue === null) {
      this.#defaultValue = this.value;
    }

    if (!this.id) {
      calendarId += 1;
      this.id = `rowan-calendar-${calendarId}`;
    }

    this.#calendarId = `${this.id}__calendar`;
    this.#ensureInitialState();
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", value);
  }

  get value() {
    return normalizeDateValue(this.readString("value", ""));
  }

  set value(value) {
    const normalized = normalizeDateValue(value);
    this.reflectString("value", normalized || null);

    if (normalized) {
      const month = normalized.slice(0, 7);
      if (this.month !== month) {
        this.month = month;
      }
      this.#focusedDate = normalized;
    }

    this.#syncFormValue();
    this.#syncValidity();
  }

  get month() {
    const attrValue = normalizeMonthValue(this.readString("month", ""));
    if (attrValue) return attrValue;

    const valueMonth = this.value ? this.value.slice(0, 7) : "";
    if (normalizeMonthValue(valueMonth)) return valueMonth;

    return todayDateValue().slice(0, 7);
  }

  set month(value) {
    const normalized = normalizeMonthValue(value);
    this.reflectString("month", normalized || null);
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", value);
  }

  get locale() {
    const configured = this.readString("locale", "").trim();
    if (configured.length > 0) return configured;

    if (typeof navigator !== "undefined" && typeof navigator.language === "string") {
      return navigator.language;
    }

    return "en-US";
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  get min() {
    return normalizeDateValue(this.readString("min", ""));
  }

  set min(value) {
    const normalized = normalizeDateValue(value);
    this.reflectString("min", normalized || null);
    this.#syncValidity();
  }

  get max() {
    return normalizeDateValue(this.readString("max", ""));
  }

  set max(value) {
    const normalized = normalizeDateValue(value);
    this.reflectString("max", normalized || null);
    this.#syncValidity();
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get required() {
    return this.readBoolean("required");
  }

  set required(value) {
    this.reflectBoolean("required", Boolean(value));
    this.#syncValidity();
  }

  get invalid() {
    return this.readBoolean("invalid");
  }

  set invalid(value) {
    this.#autoInvalid = false;
    this.reflectBoolean("invalid", Boolean(value));
  }

  setFormValue(value = this.value) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#grid) {
    if (this.internals && typeof this.internals.setValidity === "function") {
      if (anchor instanceof HTMLElement) {
        this.internals.setValidity(flags, message, anchor);
      } else {
        this.internals.setValidity(flags, message);
      }
    }
  }

  formResetCallback() {
    this.value = this.#defaultValue ?? "";
    this.requestRender();
  }

  formStateRestoreCallback(state) {
    this.value = state == null ? "" : String(state);
    this.requestRender();
  }

  checkValidity() {
    if (this.internals && typeof this.internals.checkValidity === "function") {
      return this.internals.checkValidity();
    }

    return true;
  }

  reportValidity() {
    if (this.internals && typeof this.internals.reportValidity === "function") {
      return this.internals.reportValidity();
    }

    return true;
  }

  render() {
    if (!this.#grid) {
      this.renderRoot.innerHTML = `
        <section class="calendar" part="calendar">
          <label class="sr-only" part="label"></label>
          <header class="header" part="header">
            <button class="nav-button" type="button" data-action="prev-month" aria-label="Previous month">Previous</button>
            <p class="month-label" part="month-label" aria-live="polite"></p>
            <button class="nav-button" type="button" data-action="next-month" aria-label="Next month">Next</button>
          </header>
          <div class="weekday-row" part="weekday-row"></div>
          <div class="grid" part="grid" role="grid"></div>
        </section>
      `;

      this.#fallbackLabel = this.renderRoot.querySelector("label");
      this.#monthLabel = this.renderRoot.querySelector(".month-label");
      this.#weekdayRow = this.renderRoot.querySelector(".weekday-row");
      this.#grid = this.renderRoot.querySelector(".grid");

      this.listen(this.renderRoot.querySelector('[data-action="prev-month"]'), "click", () => {
        this.#navigateMonth(-1);
      });

      this.listen(this.renderRoot.querySelector('[data-action="next-month"]'), "click", () => {
        this.#navigateMonth(1);
      });

      this.listen(this.#grid, "click", (event) => {
        const button = event
          .composedPath()
          .find((node) => node instanceof HTMLElement && node.matches("button[data-date]"));

        if (!button || button.disabled) return;
        this.#commitSelection(button.getAttribute("data-date"), "pointer");
      });

      this.listen(this.#grid, "keydown", (event) => {
        const button = event
          .composedPath()
          .find((node) => node instanceof HTMLElement && node.matches("button[data-date]"));

        if (!button || button.disabled) return;

        const currentDate = button.getAttribute("data-date");
        if (!currentDate) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.#commitSelection(currentDate, "keyboard");
          return;
        }

        let nextDate = "";

        if (event.key === "ArrowRight") nextDate = addDays(currentDate, 1);
        if (event.key === "ArrowLeft") nextDate = addDays(currentDate, -1);
        if (event.key === "ArrowDown") nextDate = addDays(currentDate, 7);
        if (event.key === "ArrowUp") nextDate = addDays(currentDate, -7);
        if (event.key === "PageDown") nextDate = moveDateByMonths(currentDate, 1);
        if (event.key === "PageUp") nextDate = moveDateByMonths(currentDate, -1);

        if (!nextDate) return;

        event.preventDefault();
        this.#focusedDate = nextDate;
        this.month = nextDate.slice(0, 7);
        this.requestRender();
      });
    }

    this.#ensureInitialState();
    this.#renderWeekdays();
    this.#renderGrid();

    const monthLabelFormatter = new Intl.DateTimeFormat(this.locale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    const [yearText, monthText] = this.month.split("-");
    const monthDate = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, 1));
    this.#monthLabel.textContent = monthLabelFormatter.format(monthDate);

    const fallbackLabelText = this.label;
    this.#fallbackLabel.textContent = fallbackLabelText;
    this.#fallbackLabel.hidden = fallbackLabelText.length === 0;
    this.#fallbackLabel.htmlFor = this.#calendarId;

    this.#grid.id = this.#calendarId;

    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #ensureInitialState() {
    if (!this.#focusedDate) {
      this.#focusedDate = this.value || `${this.month}-01`;
    }
  }

  #renderWeekdays() {
    this.#weekdayRow.textContent = "";

    const formatter = new Intl.DateTimeFormat(this.locale, {
      weekday: "short",
      timeZone: "UTC",
    });

    const sunday = new Date(Date.UTC(2023, 0, 1));
    for (let index = 0; index < 7; index += 1) {
      const labelDate = new Date(sunday);
      labelDate.setUTCDate(sunday.getUTCDate() + index);

      const header = document.createElement("span");
      header.className = "weekday";
      header.textContent = formatter.format(labelDate);
      this.#weekdayRow.append(header);
    }
  }

  #renderGrid() {
    const fragment = document.createDocumentFragment();
    const cells = buildCalendarCells(this.month);
    const focusDate = this.#resolveFocusableDate(cells);

    for (const cell of cells) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day";
      button.part = "day";
      button.textContent = String(cell.day);
      button.setAttribute("data-date", cell.dateValue);
      button.setAttribute("aria-label", cell.dateValue);

      const disabled = this.disabled || !this.#isWithinRange(cell.dateValue);
      button.disabled = disabled;
      button.tabIndex = !disabled && cell.dateValue === focusDate ? 0 : -1;

      if (cell.currentMonth) {
        button.classList.add("current-month");
      } else {
        button.classList.add("outside-month");
      }

      if (cell.dateValue === this.value) {
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }

      fragment.append(button);
    }

    this.#grid.replaceChildren(fragment);

    const active = this.#grid.querySelector('[tabindex="0"]');
    if (active) {
      active.focus({ preventScroll: true });
    }
  }

  #resolveFocusableDate(cells) {
    const enabledDates = cells
      .filter((cell) => !this.disabled && this.#isWithinRange(cell.dateValue))
      .map((cell) => cell.dateValue);

    if (enabledDates.length === 0) {
      return "";
    }

    const preferred = normalizeDateValue(this.#focusedDate) || this.value;
    if (preferred && enabledDates.includes(preferred)) {
      return preferred;
    }

    const currentMonthDate = enabledDates.find((dateValue) => dateValue.startsWith(`${this.month}-`));
    return currentMonthDate || enabledDates[0];
  }

  #isWithinRange(dateValue) {
    const normalized = normalizeDateValue(dateValue);
    if (!normalized) return false;

    if (this.min && normalized < this.min) return false;
    if (this.max && normalized > this.max) return false;

    return true;
  }

  #navigateMonth(offset) {
    if (this.disabled) return;

    const nextMonth = addMonths(this.month, offset);
    if (!nextMonth) return;

    this.month = nextMonth;

    const focusBase = this.#focusedDate || `${this.month}-01`;
    const moved = moveDateByMonths(focusBase, offset);
    if (moved) {
      this.#focusedDate = moved;
    }
  }

  #commitSelection(dateValue, source) {
    const normalized = normalizeDateValue(dateValue);
    if (!normalized || !this.#isWithinRange(normalized) || this.disabled) {
      return;
    }

    if (this.value === normalized) return;

    this.value = normalized;
    this.#focusedDate = normalized;

    emit(this, "rowan-change", {
      value: this.value,
      source,
    });
  }

  #syncFormValue() {
    this.setFormValue(this.value);
  }

  #syncValidity() {
    if (!this.#grid) return;

    if (this.required && this.value.length === 0) {
      this.setValidity({ valueMissing: true }, "Please select a date.", this.#grid);
      this.#setAutoInvalid(true);
      return;
    }

    if (this.value.length > 0 && this.min.length > 0 && this.value < this.min) {
      this.setValidity({ rangeUnderflow: true }, "Date is before minimum.", this.#grid);
      this.#setAutoInvalid(true);
      return;
    }

    if (this.value.length > 0 && this.max.length > 0 && this.value > this.max) {
      this.setValidity({ rangeOverflow: true }, "Date is after maximum.", this.#grid);
      this.#setAutoInvalid(true);
      return;
    }

    this.setValidity({}, "", this.#grid);
    this.#setAutoInvalid(false);
  }

  #setAutoInvalid(nextValue) {
    if (nextValue) {
      if (!this.hasAttribute("invalid")) {
        this.#autoInvalid = true;
        this.setAttribute("invalid", "");
      }

      return;
    }

    if (this.#autoInvalid) {
      this.removeAttribute("invalid");
      this.#autoInvalid = false;
    }
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-required") && "ariaRequired" in this.internals) {
      this.internals.ariaRequired = this.required ? "true" : "false";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }

    if (!this.hasAttribute("aria-invalid") && "ariaInvalid" in this.internals) {
      this.internals.ariaInvalid = this.invalid ? "true" : "false";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      const label = this.label.trim();
      this.internals.ariaLabel = label || "Calendar";
    }
  }
}

define("rowan-calendar", RowanCalendar);