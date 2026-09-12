import"./listbox-CeYkZIUw.js";import{c as g}from"./event-script-39NhYcVW.js";import"./define-C9dOMgiB.js";import"./events-CaQanPdG.js";import"./keys-C4RmHry8.js";function t(n,s,a=!1){const e=document.createElement("rowan-option");return e.value=n,e.label=s,e.selected=a,e}const v={title:"Components/Listbox",tags:["autodocs"],argTypes:{selection:{control:"select",options:["single","multiple"]},required:{control:"boolean"},disabled:{control:"boolean"}},args:{selection:"single",required:!1,disabled:!1}},r={parameters:g({steps:["Use Arrow keys to move, then Space or Enter to select an option."],events:["rowan-change"]}),render:({selection:n,required:s,disabled:a})=>{const e=document.createElement("rowan-listbox");return e.label="Teams",e.selection=n,e.required=s,e.disabled=a,e.append(t("design","Design",!0),t("engineering","Engineering"),t("operations","Operations")),e}},o={parameters:g({steps:["Select or clear several teams with Space."],events:["rowan-change"]}),render:()=>{const n=document.createElement("rowan-listbox");return n.label="Teams",n.selection="multiple",n.selected=["design","operations"],n.append(t("design","Design"),t("engineering","Engineering"),t("operations","Operations")),n}};var i,l,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Use Arrow keys to move, then Space or Enter to select an option."],
    events: ["rowan-change"]
  }),
  render: ({
    selection,
    required,
    disabled
  }) => {
    const listbox = document.createElement("rowan-listbox");
    listbox.label = "Teams";
    listbox.selection = selection;
    listbox.required = required;
    listbox.disabled = disabled;
    listbox.append(createOption("design", "Design", true), createOption("engineering", "Engineering"), createOption("operations", "Operations"));
    return listbox;
  }
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var p,d,m;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Select or clear several teams with Space."],
    events: ["rowan-change"]
  }),
  render: () => {
    const listbox = document.createElement("rowan-listbox");
    listbox.label = "Teams";
    listbox.selection = "multiple";
    listbox.selected = ["design", "operations"];
    listbox.append(createOption("design", "Design"), createOption("engineering", "Engineering"), createOption("operations", "Operations"));
    return listbox;
  }
}`,...(m=(d=o.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const O=["Playground","Multiple"];export{o as Multiple,r as Playground,O as __namedExportsOrder,v as default};
