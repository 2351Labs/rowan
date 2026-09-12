import"./checkbox-CJwk8Dhd.js";import{c as l}from"./event-script-39NhYcVW.js";import"./define-DNCuZUBR.js";import"./events-CaQanPdG.js";const p={title:"Components/Checkbox",tags:["autodocs"],argTypes:{checked:{control:"boolean"},disabled:{control:"boolean"},required:{control:"boolean"},label:{control:"text"}},args:{checked:!1,disabled:!1,required:!1,label:"Receive updates"}},t={parameters:l({steps:["Click the checkbox control to toggle it.","Focus the checkbox and press Space to toggle again.","Toggle Disabled on, then interact again to confirm no new event fires."],events:["rowan-change"]}),render:({checked:a,disabled:c,required:s,label:i})=>{const e=document.createElement("rowan-checkbox");return a&&e.setAttribute("checked",""),c&&e.setAttribute("disabled",""),s&&e.setAttribute("required",""),e.textContent=i,e}};var r,n,o;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the checkbox control to toggle it.", "Focus the checkbox and press Space to toggle again.", "Toggle Disabled on, then interact again to confirm no new event fires."],
    events: ["rowan-change"]
  }),
  render: ({
    checked,
    disabled,
    required,
    label
  }) => {
    const el = document.createElement("rowan-checkbox");
    if (checked) el.setAttribute("checked", "");
    if (disabled) el.setAttribute("disabled", "");
    if (required) el.setAttribute("required", "");
    el.textContent = label;
    return el;
  }
}`,...(o=(n=t.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};const h=["Playground"];export{t as Playground,h as __namedExportsOrder,p as default};
