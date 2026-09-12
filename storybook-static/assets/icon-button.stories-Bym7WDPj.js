import"./icon-button-DaTKUV_C.js";import{c as g}from"./event-script-39NhYcVW.js";import"./define-BSqCZTMW.js";import"./events-CaQanPdG.js";function a(t,r,{variant:n="ghost",size:o="md",disabled:c=!1}={}){const e=document.createElement("rowan-icon-button");return e.label=t,e.textContent=r,n!=="ghost"&&(e.variant=n),o!=="md"&&(e.size=o),e.disabled=c,e}function v(){const t=document.createElement("div");return t.style.alignItems="center",t.style.display="flex",t.style.flexWrap="wrap",t.style.gap="0.75rem",t}const E={title:"Components/Icon Button",tags:["autodocs"],argTypes:{label:{control:"text"},variant:{control:"select",options:["primary","secondary","ghost","danger"]},size:{control:"select",options:["sm","md","lg"]},disabled:{control:"boolean"},icon:{control:"text"}},args:{label:"Edit",variant:"ghost",size:"md",disabled:!1,icon:"✎"}},s={parameters:g({steps:["Click the icon button.","Toggle Disabled and click again."],events:["rowan-click"]}),render:({label:t,variant:r,size:n,disabled:o,icon:c})=>{const e=document.createElement("rowan-icon-button");return e.label=t,r!=="ghost"&&e.setAttribute("variant",r),n!=="md"&&e.setAttribute("size",n),o&&e.setAttribute("disabled",""),e.textContent=c,e}},i={render:()=>{const t=v();return t.append(a("Edit","✎"),a("Add","+",{variant:"primary"}),a("Open settings","⚙",{variant:"secondary"}),a("Delete","×",{variant:"danger"}),a("Unavailable","⋯",{disabled:!0})),t}};var l,d,u;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the icon button.", "Toggle Disabled and click again."],
    events: ["rowan-click"]
  }),
  render: ({
    label,
    variant,
    size,
    disabled,
    icon
  }) => {
    const el = document.createElement("rowan-icon-button");
    el.label = label;
    if (variant !== "ghost") el.setAttribute("variant", variant);
    if (size !== "md") el.setAttribute("size", size);
    if (disabled) el.setAttribute("disabled", "");
    el.textContent = icon;
    return el;
  }
}`,...(u=(d=s.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var m,p,b;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const showcase = createShowcase();
    showcase.append(createIconButton("Edit", "✎"), createIconButton("Add", "+", {
      variant: "primary"
    }), createIconButton("Open settings", "⚙", {
      variant: "secondary"
    }), createIconButton("Delete", "×", {
      variant: "danger"
    }), createIconButton("Unavailable", "⋯", {
      disabled: true
    }));
    return showcase;
  }
}`,...(b=(p=i.parameters)==null?void 0:p.docs)==null?void 0:b.source}}};const x=["Playground","VisualStates"];export{s as Playground,i as VisualStates,x as __namedExportsOrder,E as default};
