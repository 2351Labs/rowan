import"./dropzone-BMW-XOn2.js";import{c as z}from"./event-script-39NhYcVW.js";import"./define-C9dOMgiB.js";import"./events-CaQanPdG.js";const v={title:"Components/Dropzone",tags:["autodocs"],argTypes:{label:{control:"text"},description:{control:"text"},accept:{control:"text"},multiple:{control:"boolean"},disabled:{control:"boolean"}},args:{label:"Drop files to upload",description:"or click to select files from your device",accept:".csv,.xlsx",multiple:!0,disabled:!1}},n={parameters:z({steps:["Click the dropzone or drag files onto it."],events:["rowan-files-add"]}),render:({label:o,description:e,accept:i,multiple:m,disabled:u})=>{const r=document.createElement("rowan-dropzone");return r.label=o,r.description=e,r.accept=i,r.multiple=m,r.disabled=u,r}},t={render:()=>{const o=document.createElement("div");o.style.maxWidth="36rem";const e=document.createElement("rowan-dropzone");return e.label="Upload purchase records",e.description="CSV and XLSX only",e.accept=".csv,.xlsx",e.multiple=!0,o.append(e),o}};var a,p,d;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the dropzone or drag files onto it."],
    events: ["rowan-files-add"]
  }),
  render: ({
    label,
    description,
    accept,
    multiple,
    disabled
  }) => {
    const dropzone = document.createElement("rowan-dropzone");
    dropzone.label = label;
    dropzone.description = description;
    dropzone.accept = accept;
    dropzone.multiple = multiple;
    dropzone.disabled = disabled;
    return dropzone;
  }
}`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var c,s,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.maxWidth = "36rem";
    const dropzone = document.createElement("rowan-dropzone");
    dropzone.label = "Upload purchase records";
    dropzone.description = "CSV and XLSX only";
    dropzone.accept = ".csv,.xlsx";
    dropzone.multiple = true;
    wrapper.append(dropzone);
    return wrapper;
  }
}`,...(l=(s=t.parameters)==null?void 0:s.docs)==null?void 0:l.source}}};const g=["Playground","InCard"];export{t as InCard,n as Playground,g as __namedExportsOrder,v as default};
