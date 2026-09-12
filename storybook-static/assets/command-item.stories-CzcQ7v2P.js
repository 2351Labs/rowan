import"./command-item-B2GsLFd9.js";import"./define-BSqCZTMW.js";const p={title:"Components/Command Item",tags:["autodocs"],argTypes:{label:{control:"text"},description:{control:"text"},group:{control:"text"},shortcut:{control:"text"},disabled:{control:"boolean"}},args:{label:"Open settings",description:"Update workspace preferences",group:"Workspace",shortcut:"G S",disabled:!1}},t={render:({label:s,description:a,group:c,shortcut:i,disabled:d})=>{const e=document.createElement("rowan-command-item");return e.value="open-settings",e.label=s,e.description=a,e.group=c,e.shortcut=i,e.disabled=d,e}};var o,r,n;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: ({
    label,
    description,
    group,
    shortcut,
    disabled
  }) => {
    const item = document.createElement("rowan-command-item");
    item.value = "open-settings";
    item.label = label;
    item.description = description;
    item.group = group;
    item.shortcut = shortcut;
    item.disabled = disabled;
    return item;
  }
}`,...(n=(r=t.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};const u=["Metadata"];export{t as Metadata,u as __namedExportsOrder,p as default};
