import "../src/calendar/calendar.js";
import "../src/segmented-control/segmented-control.js";
import "../src/table/table.js";

const REQUESTS = [
  { id: "REQ-104", request: "تجهيز القاعة", owner: "ليلى", status: "مؤكد", capacity: 24 },
  { id: "REQ-105", request: "دعوة الضيوف", owner: "عمر", status: "قيد المراجعة", capacity: 9 },
  { id: "REQ-106", request: "اختبار العرض", owner: "سارة", status: "مؤكد", capacity: 18 },
];

function createCalendar() {
  const calendar = document.createElement("rowan-calendar");
  calendar.label = "نافذة الخدمة";
  calendar.selectionMode = "range";
  calendar.start = "2026-10-12";
  calendar.end = "2026-10-17";
  calendar.month = "2026-10";
  calendar.messages = {
    previousMonth: "السابق",
    previousMonthLabel: "الشهر السابق",
    nextMonth: "التالي",
    nextMonthLabel: "الشهر التالي",
    dayLabel: "اختيار {date}",
  };
  return calendar;
}

function createTable() {
  const table = document.createElement("rowan-table");
  table.config = {
    caption: "طلبات الفريق",
    rowId: "id",
    selectable: "multiple",
    density: "sm",
    columns: [
      { id: "request", header: "الطلب", sortable: true, sticky: "start", minWidth: "11rem" },
      { id: "owner", header: "المسؤول", sortable: true, minWidth: "8rem" },
      {
        id: "status",
        header: "الحالة",
        type: "badge",
        cell: { tone: (value) => (value === "مؤكد" ? "success" : "warning") },
      },
      { id: "capacity", header: "المقاعد", type: "number", align: "end", sortable: true },
    ],
    rows: REQUESTS.map((request) => ({ ...request })),
  };
  table.messages = {
    checkbox: "مربع اختيار",
    selectAllRows: "تحديد كل الصفوف",
    selectRow: "تحديد الصف {rowId}",
  };
  return table;
}

function createViewControl() {
  const control = document.createElement("rowan-segmented-control");
  control.label = "طريقة العرض";
  control.value = "agenda";
  control.options = [
    { value: "agenda", label: "جدول الأعمال" },
    { value: "board", label: "لوحة" },
    { value: "calendar", label: "تقويم" },
  ];
  return control;
}

function createSectionLabel(text) {
  const label = document.createElement("h2");
  label.textContent = text;
  label.style.margin = "0";
  label.style.fontSize = "1rem";
  label.style.fontWeight = "650";
  return label;
}

export default {
  title: "Foundations/Localization & Direction",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export const ArabicRightToLeft = {
  render: () => {
    const root = document.createElement("section");
    root.lang = "ar-EG";
    root.dir = "rtl";
    root.style.display = "grid";
    root.style.gap = "1.5rem";
    root.style.maxWidth = "72rem";
    root.style.margin = "0 auto";
    root.style.color = "var(--rowan-color-fg, #1a221d)";
    root.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

    const heading = document.createElement("h1");
    heading.textContent = "تنسيق الفريق";
    heading.style.margin = "0";
    heading.style.fontSize = "1.5rem";
    heading.style.fontWeight = "700";

    const view = document.createElement("div");
    view.style.display = "grid";
    view.style.gap = "0.625rem";
    view.append(createSectionLabel("طريقة العرض"), createViewControl());

    const content = document.createElement("div");
    content.style.display = "grid";
    content.style.gridTemplateColumns = "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))";
    content.style.gap = "1.5rem";
    content.style.alignItems = "start";

    const calendarSection = document.createElement("div");
    calendarSection.style.display = "grid";
    calendarSection.style.gap = "0.625rem";
    calendarSection.append(createSectionLabel("نافذة الخدمة"), createCalendar());

    const tableSection = document.createElement("div");
    tableSection.style.display = "grid";
    tableSection.style.gap = "0.625rem";
    tableSection.style.minWidth = "0";
    tableSection.append(createSectionLabel("طلبات الفريق"), createTable());

    content.append(calendarSection, tableSection);
    root.append(heading, view, content);
    return root;
  },
};
