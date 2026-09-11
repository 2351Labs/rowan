import"./radio-BXqxHDwE.js";import{c as u}from"./event-script-39NhYcVW.js";import"./define-DJLCbHkD.js";import"./events-CaQanPdG.js";const v={title:"Components/Radio",tags:["autodocs"],argTypes:{checked:{control:"boolean"},disabled:{control:"boolean"},required:{control:"boolean"},label:{control:"text"},text:{control:"text"},value:{control:"text"},name:{control:"text"}},args:{checked:!1,disabled:!1,required:!1,label:"Role",text:"Editor",value:"editor",name:"role"}},r={parameters:u({steps:["Select the radio option."],events:["rowan-change"]}),render:({checked:n,disabled:d,required:l,label:c,text:s,value:i,name:m})=>{const e=document.createElement("rowan-radio");return e.checked=n,e.disabled=d,e.required=l,e.label=c,e.value=i,e.name=m,e.textContent=s,e}};var a,t,o;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Select the radio option."],
    events: ["rowan-change"]
  }),
  render: ({
    checked,
    disabled,
    required,
    label,
    text,
    value,
    name
  }) => {
    const radio = document.createElement("rowan-radio");
    radio.checked = checked;
    radio.disabled = disabled;
    radio.required = required;
    radio.label = label;
    radio.value = value;
    radio.name = name;
    radio.textContent = text;
    return radio;
  }
}`,...(o=(t=r.parameters)==null?void 0:t.docs)==null?void 0:o.source}}};const g=["Playground"];export{r as Playground,g as __namedExportsOrder,v as default};
