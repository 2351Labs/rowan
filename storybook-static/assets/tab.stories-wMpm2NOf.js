import"./tab-AiaUldik.js";import"./define-BZx74wjy.js";const i={title:"Components/Navigation & Layout/Tab",tags:["autodocs"],argTypes:{value:{control:"text"},active:{control:"boolean"},label:{control:"text"}},args:{value:"overview",active:!0,label:"Overview"}},e={render:({value:o,active:c,label:l})=>{const t=document.createElement("rowan-tab");return t.value=o,c&&t.setAttribute("active",""),t.textContent=l,t}};var a,r,n;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: ({
    value,
    active,
    label
  }) => {
    const tab = document.createElement("rowan-tab");
    tab.value = value;
    if (active) tab.setAttribute("active", "");
    tab.textContent = label;
    return tab;
  }
}`,...(n=(r=e.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};const b=["Playground"];export{e as Playground,b as __namedExportsOrder,i as default};
