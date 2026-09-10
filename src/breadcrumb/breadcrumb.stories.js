import "./breadcrumb.js";

export default {
  title: "Components/Breadcrumb",
  tags: ["autodocs"],
};

export const Playground = {
  render: () => {
    const breadcrumb = document.createElement("rowan-breadcrumb");

    const home = document.createElement("a");
    home.href = "#";
    home.textContent = "Home";
    breadcrumb.append(home);

    const sep1 = document.createElement("span");
    sep1.textContent = "/";
    breadcrumb.append(sep1);

    const docs = document.createElement("a");
    docs.href = "#";
    docs.textContent = "Docs";
    breadcrumb.append(docs);

    const sep2 = document.createElement("span");
    sep2.textContent = "/";
    breadcrumb.append(sep2);

    const current = document.createElement("span");
    current.setAttribute("aria-current", "page");
    current.textContent = "Buttons";
    breadcrumb.append(current);

    return breadcrumb;
  },
};
