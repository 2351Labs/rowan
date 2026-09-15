import"./avatar-DS4zE7PN.js";import"./define-Chpk02HC.js";const d={title:"Components/Data Display/Avatar",tags:["autodocs"],argTypes:{name:{control:"text"},src:{control:"text"},alt:{control:"text"},size:{control:"select",options:["sm","md","lg"]}},args:{name:"Ava Pine",src:"",alt:"",size:"md"}},t={render:({name:o,src:c,alt:l,size:r})=>{const e=document.createElement("rowan-avatar");return e.name=o,e.src=c,e.alt=l,r!=="md"&&e.setAttribute("size",r),e}};var a,n,s;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: ({
    name,
    src,
    alt,
    size
  }) => {
    const el = document.createElement("rowan-avatar");
    el.name = name;
    el.src = src;
    el.alt = alt;
    if (size !== "md") el.setAttribute("size", size);
    return el;
  }
}`,...(s=(n=t.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const u=["Playground"];export{t as Playground,u as __namedExportsOrder,d as default};
