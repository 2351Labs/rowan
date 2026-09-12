import"./menu-item-mP7ZVfKB.js";import"./define-DNCuZUBR.js";const m={title:"Components/Menu Item",tags:["autodocs"],argTypes:{value:{control:"text"},disabled:{control:"boolean"},label:{control:"text"}},args:{value:"edit",disabled:!1,label:"Edit"}},t={render:({value:o,disabled:l,label:s})=>{const e=document.createElement("rowan-menu-item");return e.value=o,l&&e.setAttribute("disabled",""),e.textContent=s,e}};var n,a,r;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: ({
    value,
    disabled,
    label
  }) => {
    const item = document.createElement("rowan-menu-item");
    item.value = value;
    if (disabled) item.setAttribute("disabled", "");
    item.textContent = label;
    return item;
  }
}`,...(r=(a=t.parameters)==null?void 0:a.docs)==null?void 0:r.source}}};const u=["Playground"];export{t as Playground,u as __namedExportsOrder,m as default};
