import"./radio-group-BTmw1RCc.js";import"./radio-BONeUV34.js";import{c as m}from"./event-script-39NhYcVW.js";import"./define-DNCuZUBR.js";import"./events-CaQanPdG.js";const y={title:"Components/Radio Group",tags:["autodocs"],argTypes:{value:{control:"text"},name:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"}},args:{value:"team",name:"audience",required:!1,disabled:!1}},a={parameters:m({steps:["Choose an option to update group value."],events:["rowan-change"]}),render:({value:p,name:u,required:s,disabled:d})=>{const e=document.createElement("rowan-radio-group");e.value=p,e.name=u,e.required=s,e.disabled=d;const i=[{label:"Team",value:"team"},{label:"Department",value:"department"},{label:"Company",value:"company"}];for(const n of i){const o=document.createElement("rowan-radio");o.value=n.value,o.textContent=n.label,e.append(o)}return e}};var r,t,l;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Choose an option to update group value."],
    events: ["rowan-change"]
  }),
  render: ({
    value,
    name,
    required,
    disabled
  }) => {
    const group = document.createElement("rowan-radio-group");
    group.value = value;
    group.name = name;
    group.required = required;
    group.disabled = disabled;
    const options = [{
      label: "Team",
      value: "team"
    }, {
      label: "Department",
      value: "department"
    }, {
      label: "Company",
      value: "company"
    }];
    for (const option of options) {
      const radio = document.createElement("rowan-radio");
      radio.value = option.value;
      radio.textContent = option.label;
      group.append(radio);
    }
    return group;
  }
}`,...(l=(t=a.parameters)==null?void 0:t.docs)==null?void 0:l.source}}};const C=["Playground"];export{a as Playground,C as __namedExportsOrder,y as default};
