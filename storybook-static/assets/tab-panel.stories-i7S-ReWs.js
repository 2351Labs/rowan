import"./tab-panel-YkgExC_8.js";import"./define-BL-z8OAl.js";const p={title:"Components/Tab Panel",tags:["autodocs"],argTypes:{value:{control:"text"},active:{control:"boolean"},content:{control:"text"}},args:{value:"overview",active:!0,content:"Panel content"}},t={render:({value:r,active:c,content:l})=>{const e=document.createElement("rowan-tab-panel");return e.value=r,c&&e.setAttribute("active",""),e.textContent=l,e}};var n,a,o;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: ({
    value,
    active,
    content
  }) => {
    const panel = document.createElement("rowan-tab-panel");
    panel.value = value;
    if (active) panel.setAttribute("active", "");
    panel.textContent = content;
    return panel;
  }
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const i=["Playground"];export{t as Playground,i as __namedExportsOrder,p as default};
