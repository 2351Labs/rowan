import"./menu-CzKDMEKf.js";import"./menu-item-mP7ZVfKB.js";import{c}from"./event-script-39NhYcVW.js";import"./define-DNCuZUBR.js";import"./events-CaQanPdG.js";const v={title:"Components/Menu",tags:["autodocs"]},e={parameters:c({steps:["Click any menu item."],events:["rowan-change"]}),render:()=>{const n=document.createElement("rowan-menu"),s=["Edit","Duplicate","Archive"];for(const r of s){const t=document.createElement("rowan-menu-item");t.value=r.toLowerCase(),t.textContent=r,n.append(t)}return n}};var a,o,m;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click any menu item."],
    events: ["rowan-change"]
  }),
  render: () => {
    const menu = document.createElement("rowan-menu");
    const items = ["Edit", "Duplicate", "Archive"];
    for (const value of items) {
      const item = document.createElement("rowan-menu-item");
      item.value = value.toLowerCase();
      item.textContent = value;
      menu.append(item);
    }
    return menu;
  }
}`,...(m=(o=e.parameters)==null?void 0:o.docs)==null?void 0:m.source}}};const E=["Playground"];export{e as Playground,E as __namedExportsOrder,v as default};
