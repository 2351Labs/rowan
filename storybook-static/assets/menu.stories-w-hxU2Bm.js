import"./menu-CpzA1j0p.js";import"./menu-item-BOP9A-L2.js";import{c}from"./event-script-39NhYcVW.js";import"./define-Chpk02HC.js";import"./events-CaQanPdG.js";import"./keys-C4RmHry8.js";const E={title:"Components/Overlays & Menus/Menu",tags:["autodocs"]},e={parameters:c({steps:["Click any menu item."],events:["rowan-change"]}),render:()=>{const n=document.createElement("rowan-menu"),s=["Edit","Duplicate","Archive"];for(const r of s){const t=document.createElement("rowan-menu-item");t.value=r.toLowerCase(),t.textContent=r,n.append(t)}return n}};var a,o,m;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
}`,...(m=(o=e.parameters)==null?void 0:o.docs)==null?void 0:m.source}}};const w=["Playground"];export{e as Playground,w as __namedExportsOrder,E as default};
