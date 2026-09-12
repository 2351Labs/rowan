import"./progress-DGBWIWsb.js";import"./define-BL-z8OAl.js";const c={title:"Components/Progress",tags:["autodocs"],argTypes:{value:{control:{type:"number",min:0,step:1}},max:{control:{type:"number",min:1,step:1}},label:{control:"text"}},args:{value:42,max:100,label:"Quota"}},r={render:({value:t,max:l,label:s})=>{const e=document.createElement("rowan-progress");return e.value=Number(t),e.max=Number(l),e.label=s,e}};var a,n,o;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: ({
    value,
    max,
    label
  }) => {
    const el = document.createElement("rowan-progress");
    el.value = Number(value);
    el.max = Number(max);
    el.label = label;
    return el;
  }
}`,...(o=(n=r.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};const p=["Playground"];export{r as Playground,p as __namedExportsOrder,c as default};
