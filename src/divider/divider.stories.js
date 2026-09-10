import "./divider.js";

export default {
  title: "Components/Divider",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    orientation: "horizontal",
  },
};

export const Playground = {
  render: ({ orientation }) => {
    if (orientation === "vertical") {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.gap = "0.75rem";

      const before = document.createElement("span");
      before.textContent = "Left";

      const divider = document.createElement("rowan-divider");
      divider.orientation = "vertical";
      divider.style.height = "1.5rem";

      const after = document.createElement("span");
      after.textContent = "Right";

      wrapper.append(before, divider, after);
      return wrapper;
    }

    const divider = document.createElement("rowan-divider");
    return divider;
  },
};
