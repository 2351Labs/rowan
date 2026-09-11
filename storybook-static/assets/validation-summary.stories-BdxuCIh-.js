import"./validation-summary-K7Nf89Yd.js";import"./define-DJLCbHkD.js";import"./events-CaQanPdG.js";const p={title:"Forms/Validation Summary",component:"rowan-validation-summary",tags:["autodocs"],argTypes:{heading:{control:"text"},disabled:{control:"boolean"}}},c=({heading:s="Please correct the highlighted fields",disabled:e=!1})=>{const a=document.createElement("rowan-validation-summary");return a.heading=s,a.disabled=e,a.errors=[{fieldId:"name",label:"Name",message:"Name is required"},{fieldId:"email",label:"Email",message:"Email format is invalid"}],a},r={render:c,args:{heading:"Please correct the highlighted fields",disabled:!1}},o={render:({heading:s="Looks good"})=>{const e=document.createElement("rowan-validation-summary");return e.heading=s,e.errors=[],e},args:{heading:"Looks good"}};var n,t,d;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: Template,
  args: {
    heading: "Please correct the highlighted fields",
    disabled: false
  }
}`,...(d=(t=r.parameters)==null?void 0:t.docs)==null?void 0:d.source}}};var m,i,l;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: ({
    heading = "Looks good"
  }) => {
    const summary = document.createElement("rowan-validation-summary");
    summary.heading = heading;
    summary.errors = [];
    return summary;
  },
  args: {
    heading: "Looks good"
  }
}`,...(l=(i=o.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const y=["Playground","Empty"];export{o as Empty,r as Playground,y as __namedExportsOrder,p as default};
