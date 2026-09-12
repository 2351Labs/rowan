import"./tab-B5sCCnc6.js";import"./define-BSqCZTMW.js";const i={title:"Components/Tab",tags:["autodocs"],argTypes:{value:{control:"text"},active:{control:"boolean"},label:{control:"text"}},args:{value:"overview",active:!0,label:"Overview"}},t={render:({value:o,active:c,label:l})=>{const e=document.createElement("rowan-tab");return e.value=o,c&&e.setAttribute("active",""),e.textContent=l,e}};var a,r,n;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
}`,...(n=(r=t.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};const b=["Playground"];export{t as Playground,b as __namedExportsOrder,i as default};
