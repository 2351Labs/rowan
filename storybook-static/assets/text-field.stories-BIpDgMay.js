import"./text-field-Bji2XlpM.js";import{c as u}from"./event-script-39NhYcVW.js";import"./define-DNCuZUBR.js";import"./events-CaQanPdG.js";const v={title:"Components/Text Field",tags:["autodocs"],argTypes:{value:{control:"text"},placeholder:{control:"text"},label:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"},type:{control:"select",options:["text","email","password","search","url","tel"]}},args:{value:"",placeholder:"Enter a value",label:"Field",required:!1,disabled:!1,type:"text"}},t={parameters:u({steps:["Focus the field and type a value.","Press Tab or click outside the field to commit the value.","Review the latest rowan-change payload in Event Trace."],events:["rowan-change"]}),render:({value:n,placeholder:o,label:s,required:d,disabled:i,type:c})=>{const e=document.createElement("rowan-text-field");return e.value=n,e.placeholder=o,e.label=s,e.type=c,d&&e.setAttribute("required",""),i&&e.setAttribute("disabled",""),e}};var a,r,l;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Focus the field and type a value.", "Press Tab or click outside the field to commit the value.", "Review the latest rowan-change payload in Event Trace."],
    events: ["rowan-change"]
  }),
  render: ({
    value,
    placeholder,
    label,
    required,
    disabled,
    type
  }) => {
    const el = document.createElement("rowan-text-field");
    el.value = value;
    el.placeholder = placeholder;
    el.label = label;
    el.type = type;
    if (required) el.setAttribute("required", "");
    if (disabled) el.setAttribute("disabled", "");
    return el;
  }
}`,...(l=(r=t.parameters)==null?void 0:r.docs)==null?void 0:l.source}}};const f=["Playground"];export{t as Playground,f as __namedExportsOrder,v as default};
