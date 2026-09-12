import"./stepper-DK0sQJDK.js";import"./define-BL-z8OAl.js";import"./events-CaQanPdG.js";const f={title:"Workflows/Stepper",component:"rowan-stepper",tags:["autodocs"],argTypes:{currentStep:{control:{type:"number",min:1}},orientation:{control:"inline-radio",options:["horizontal","vertical"]},disabled:{control:"boolean"}}},c=({currentStep:p=2,orientation:d="horizontal",disabled:m=!1})=>{const e=document.createElement("rowan-stepper");return e.steps=["Draft","Review","Publish","Confirm"],e.currentStep=p,e.orientation=d,e.disabled=m,e},r={render:c,args:{currentStep:2,orientation:"horizontal",disabled:!1}},t={render:c,args:{currentStep:3,orientation:"vertical",disabled:!1}};var n,o,a;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: Template,
  args: {
    currentStep: 2,
    orientation: "horizontal",
    disabled: false
  }
}`,...(a=(o=r.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};var s,i,l;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: Template,
  args: {
    currentStep: 3,
    orientation: "vertical",
    disabled: false
  }
}`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const S=["Playground","Vertical"];export{r as Playground,t as Vertical,S as __namedExportsOrder,f as default};
