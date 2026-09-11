import"./badge-DJNEAxWR.js";import"./define-DJLCbHkD.js";const d={title:"Components/Badge",tags:["autodocs"],argTypes:{tone:{control:"select",options:["info","success","warning","danger"]},size:{control:"select",options:["sm","md","lg"]},label:{control:"text"}},args:{tone:"info",size:"md",label:"Info"}},t={render:({tone:n,size:o,label:i})=>{const e=document.createElement("rowan-badge");return n!=="info"&&e.setAttribute("tone",n),o!=="md"&&e.setAttribute("size",o),e.textContent=i,e}};var r,s,a;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: ({
    tone,
    size,
    label
  }) => {
    const el = document.createElement("rowan-badge");
    if (tone !== "info") el.setAttribute("tone", tone);
    if (size !== "md") el.setAttribute("size", size);
    el.textContent = label;
    return el;
  }
}`,...(a=(s=t.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const m=["Playground"];export{t as Playground,m as __namedExportsOrder,d as default};
