import"./avatar-qOpIf403.js";import"./define-C9dOMgiB.js";const d={title:"Components/Avatar",tags:["autodocs"],argTypes:{name:{control:"text"},src:{control:"text"},alt:{control:"text"},size:{control:"select",options:["sm","md","lg"]}},args:{name:"Ava Pine",src:"",alt:"",size:"md"}},t={render:({name:o,src:c,alt:l,size:r})=>{const e=document.createElement("rowan-avatar");return e.name=o,e.src=c,e.alt=l,r!=="md"&&e.setAttribute("size",r),e}};var n,a,s;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
}`,...(s=(a=t.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const u=["Playground"];export{t as Playground,u as __namedExportsOrder,d as default};
