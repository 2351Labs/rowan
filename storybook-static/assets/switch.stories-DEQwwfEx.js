import"./switch-5guOhZzD.js";import{c as i}from"./event-script-39NhYcVW.js";import"./define-BZx74wjy.js";import"./events-CaQanPdG.js";const b={title:"Components/Forms & Input/Switch",tags:["autodocs"],argTypes:{checked:{control:"boolean"},disabled:{control:"boolean"},required:{control:"boolean"},label:{control:"text"},text:{control:"text"}},args:{checked:!1,disabled:!1,required:!1,label:"Availability",text:"Available for scheduling"}},t={parameters:i({steps:["Toggle the switch to fire a change event."],events:["rowan-change"]}),render:({checked:o,disabled:l,required:s,label:c,text:d})=>{const e=document.createElement("rowan-switch");return e.checked=o,e.disabled=l,e.required=s,e.label=c,e.textContent=d,e}};var r,n,a;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Toggle the switch to fire a change event."],
    events: ["rowan-change"]
  }),
  render: ({
    checked,
    disabled,
    required,
    label,
    text
  }) => {
    const el = document.createElement("rowan-switch");
    el.checked = checked;
    el.disabled = disabled;
    el.required = required;
    el.label = label;
    el.textContent = text;
    return el;
  }
}`,...(a=(n=t.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};const g=["Playground"];export{t as Playground,g as __namedExportsOrder,b as default};
