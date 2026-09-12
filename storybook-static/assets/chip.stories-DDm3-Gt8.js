import"./chip-DggezjO4.js";import"./define-C9dOMgiB.js";const d={title:"Components/Chip",tags:["autodocs"],argTypes:{tone:{control:"select",options:["info","success","warning","danger"]},size:{control:"select",options:["sm","md","lg"]},label:{control:"text"}},args:{tone:"info",size:"md",label:"Platform"}},t={render:({tone:n,size:o,label:a})=>{const e=document.createElement("rowan-chip");return n!=="info"&&e.setAttribute("tone",n),o!=="md"&&e.setAttribute("size",o),e.textContent=a,e}};var r,s,i;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: ({
    tone,
    size,
    label
  }) => {
    const el = document.createElement("rowan-chip");
    if (tone !== "info") el.setAttribute("tone", tone);
    if (size !== "md") el.setAttribute("size", size);
    el.textContent = label;
    return el;
  }
}`,...(i=(s=t.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};const m=["Playground"];export{t as Playground,m as __namedExportsOrder,d as default};
