import"./button-Cnv2b6fF.js";import{c as d}from"./event-script-39NhYcVW.js";import"./define-C1bbOtVV.js";import"./events-CaQanPdG.js";const f={title:"Components/Button",tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","ghost","danger"]},size:{control:"select",options:["sm","md","lg"]},disabled:{control:"boolean"},loading:{control:"boolean"},label:{control:"text"}},args:{variant:"primary",size:"md",disabled:!1,loading:!1,label:"Continue"}},t={parameters:d({steps:["Click the button once while enabled.","Turn on Disabled and click again to confirm no event fires.","Turn off Disabled and click once more."],events:["rowan-click"]}),render:({variant:n,size:r,disabled:s,loading:l,label:c})=>{const e=document.createElement("rowan-button");return n!=="primary"&&e.setAttribute("variant",n),r!=="md"&&e.setAttribute("size",r),s&&e.setAttribute("disabled",""),l&&e.setAttribute("loading",""),e.textContent=c,e}};var a,o,i;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the button once while enabled.", "Turn on Disabled and click again to confirm no event fires.", "Turn off Disabled and click once more."],
    events: ["rowan-click"]
  }),
  render: ({
    variant,
    size,
    disabled,
    loading,
    label
  }) => {
    const el = document.createElement("rowan-button");
    if (variant !== "primary") el.setAttribute("variant", variant);
    if (size !== "md") el.setAttribute("size", size);
    if (disabled) el.setAttribute("disabled", "");
    if (loading) el.setAttribute("loading", "");
    el.textContent = label;
    return el;
  }
}`,...(i=(o=t.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};const g=["Playground"];export{t as Playground,g as __namedExportsOrder,f as default};
