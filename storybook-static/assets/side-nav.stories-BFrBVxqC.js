import"./side-nav-OpPtIexT.js";import"./side-nav-item-rTgV2QFM.js";import{c as v}from"./event-script-39NhYcVW.js";import"./define-BSqCZTMW.js";import"./events-CaQanPdG.js";import"./keys-C4RmHry8.js";function m({value:r="overview"}={}){const e=document.createElement("rowan-side-nav");e.label="Workspace navigation",e.value=r;for(const[o,c]of[["overview","Overview"],["activity","Activity"],["members","Members"],["settings","Settings"]]){const t=document.createElement("rowan-side-nav-item");t.href=`#${o}`,t.value=o,t.textContent=c,e.append(t)}return e}const b={title:"Components/Side Navigation",tags:["autodocs"],args:{value:"overview"},argTypes:{value:{control:"select",options:["overview","activity","members","settings"]}}},a={parameters:v({steps:["Use Arrow keys to move the navigation tab stop, then Enter to activate an item."],events:["rowan-change"]}),render:r=>m(r)};var n,s,i;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Use Arrow keys to move the navigation tab stop, then Enter to activate an item."],
    events: ["rowan-change"]
  }),
  render: args => createSideNav(args)
}`,...(i=(s=a.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};const h=["Workspace"];export{a as Workspace,h as __namedExportsOrder,b as default};
