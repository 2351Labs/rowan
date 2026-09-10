import"./icon-button-D0QvykjY.js";import{c as d}from"./event-script-39NhYcVW.js";import"./define-C1bbOtVV.js";import"./events-CaQanPdG.js";const g={title:"Components/Icon Button",tags:["autodocs"],argTypes:{label:{control:"text"},variant:{control:"select",options:["primary","secondary","ghost","danger"]},size:{control:"select",options:["sm","md","lg"]},disabled:{control:"boolean"},icon:{control:"text"}},args:{label:"Edit",variant:"ghost",size:"md",disabled:!1,icon:"✎"}},e={parameters:d({steps:["Click the icon button.","Toggle Disabled and click again."],events:["rowan-click"]}),render:({label:i,variant:n,size:o,disabled:l,icon:c})=>{const t=document.createElement("rowan-icon-button");return t.label=i,n!=="ghost"&&t.setAttribute("variant",n),o!=="md"&&t.setAttribute("size",o),l&&t.setAttribute("disabled",""),t.textContent=c,t}};var r,a,s;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the icon button.", "Toggle Disabled and click again."],
    events: ["rowan-click"]
  }),
  render: ({
    label,
    variant,
    size,
    disabled,
    icon
  }) => {
    const el = document.createElement("rowan-icon-button");
    el.label = label;
    if (variant !== "ghost") el.setAttribute("variant", variant);
    if (size !== "md") el.setAttribute("size", size);
    if (disabled) el.setAttribute("disabled", "");
    el.textContent = icon;
    return el;
  }
}`,...(s=(a=e.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const v=["Playground"];export{e as Playground,v as __namedExportsOrder,g as default};
