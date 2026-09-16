import"./listbox-Zoc0ck5Q.js";import"./option-D72qDHHW.js";import"./define-BZx74wjy.js";import"./events-CaQanPdG.js";import"./keys-C4RmHry8.js";const x={title:"Components/Forms & Input/Option",tags:["autodocs"],argTypes:{value:{control:"text"},label:{control:"text"},selected:{control:"boolean"},disabled:{control:"boolean"}},args:{value:"engineering",label:"Engineering",selected:!1,disabled:!1}},o={render:({value:s,label:r,selected:i,disabled:d})=>{const t=document.createElement("rowan-listbox");t.label="Teams";const e=document.createElement("rowan-option");return e.value=s,e.label=r,e.selected=i,e.disabled=d,t.append(e),t}};var n,l,a;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: ({
    value,
    label,
    selected,
    disabled
  }) => {
    const listbox = document.createElement("rowan-listbox");
    listbox.label = "Teams";
    const option = document.createElement("rowan-option");
    option.value = value;
    option.label = label;
    option.selected = selected;
    option.disabled = disabled;
    listbox.append(option);
    return listbox;
  }
}`,...(a=(l=o.parameters)==null?void 0:l.docs)==null?void 0:a.source}}};const g=["InListbox"];export{o as InListbox,g as __namedExportsOrder,x as default};
