import"./empty-state-BYJTgUfO.js";import"./button-mmaSNUNF.js";import"./define-BZx74wjy.js";import"./events-CaQanPdG.js";import"./form-BsCuqVMT.js";const C={title:"Components/Actions & Feedback/Empty State",tags:["autodocs"]},t={render:()=>{const r=document.createElement("rowan-empty-state"),e=document.createElement("span");e.slot="icon",e.textContent="◌";const n=document.createElement("span");n.slot="title",n.textContent="No saved trails";const a=document.createElement("p");a.textContent="Create your first trail plan to get started.";const o=document.createElement("rowan-button");return o.slot="actions",o.textContent="Create trail",r.append(e,n,a,o),r}};var s,c,l;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => {
    const el = document.createElement("rowan-empty-state");
    const icon = document.createElement("span");
    icon.slot = "icon";
    icon.textContent = "◌";
    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "No saved trails";
    const body = document.createElement("p");
    body.textContent = "Create your first trail plan to get started.";
    const button = document.createElement("rowan-button");
    button.slot = "actions";
    button.textContent = "Create trail";
    el.append(icon, title, body, button);
    return el;
  }
}`,...(l=(c=t.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};const b=["Playground"];export{t as Playground,b as __namedExportsOrder,C as default};
