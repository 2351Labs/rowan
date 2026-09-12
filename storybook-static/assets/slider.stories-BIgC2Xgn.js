import"./slider-mNgNb9PS.js";import{c as S}from"./event-script-39NhYcVW.js";import"./define-BL-z8OAl.js";import"./events-CaQanPdG.js";function d({value:e=45,min:a=0,max:y=100,step:f=5,range:o=!1,disabled:x=!1}={}){const r=document.createElement("rowan-slider");return r.label=o?"Price range":"Capacity",r.min=a,r.max=y,r.step=f,r.range=o,r.disabled=x,r.value=o?{start:25,end:75}:e,r}const P={title:"Components/Slider",tags:["autodocs"],argTypes:{value:{control:{type:"number",min:0,max:100}},min:{control:{type:"number"}},max:{control:{type:"number"}},step:{control:{type:"number",min:1}},range:{control:"boolean"},disabled:{control:"boolean"}},args:{value:45,min:0,max:100,step:5,range:!1,disabled:!1}},n={parameters:S({steps:["Drag a thumb or use arrow keys to adjust its value.","Turn on Range to expose independent start and end handles.","Inspect user-originated rowan-change payloads in Event Trace."],events:["rowan-change"]}),render:e=>d(e)},t={render:()=>{const e=d({min:0,max:500,step:25,range:!0});return e.name="budget",e.formatValue=a=>`$${a.start} - $${a.end}`,e}},s={render:()=>{const e=d({value:72,step:1});return e.formatValue=a=>`${a}% capacity`,e}};var c,l,i;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Drag a thumb or use arrow keys to adjust its value.", "Turn on Range to expose independent start and end handles.", "Inspect user-originated rowan-change payloads in Event Trace."],
    events: ["rowan-change"]
  }),
  render: args => createSlider(args)
}`,...(i=(l=n.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};var u,m,p;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const slider = createSlider({
      min: 0,
      max: 500,
      step: 25,
      range: true
    });
    slider.name = "budget";
    slider.formatValue = value => \`$\${value.start} - $\${value.end}\`;
    return slider;
  }
}`,...(p=(m=t.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var g,v,b;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const slider = createSlider({
      value: 72,
      step: 1
    });
    slider.formatValue = value => \`\${value}% capacity\`;
    return slider;
  }
}`,...(b=(v=s.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const T=["Playground","Range","Formatter"];export{s as Formatter,n as Playground,t as Range,T as __namedExportsOrder,P as default};
