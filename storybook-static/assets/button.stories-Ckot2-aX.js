import"./button-CGChjj4D.js";import{c as v}from"./event-script-39NhYcVW.js";import"./define-DJLCbHkD.js";import"./events-CaQanPdG.js";function a(e,{variant:o="primary",size:s="md",disabled:d=!1,loading:l=!1,prefix:t,suffix:u}={}){const r=document.createElement("rowan-button");if(r.textContent=e,t){const n=document.createElement("span");n.setAttribute("aria-hidden","true"),n.slot="prefix",n.textContent=t,r.append(n)}if(u){const n=document.createElement("span");n.setAttribute("aria-hidden","true"),n.slot="suffix",n.textContent=u,r.append(n)}return o!=="primary"&&(r.variant=o),s!=="md"&&(r.size=s),r.disabled=d,r.loading=l,r}function h(){const e=document.createElement("div");return e.style.display="flex",e.style.flexWrap="wrap",e.style.gap="0.75rem",e.style.alignItems="center",e}const B={title:"Components/Button",tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","ghost","danger"]},size:{control:"select",options:["sm","md","lg"]},disabled:{control:"boolean"},loading:{control:"boolean"},label:{control:"text"}},args:{variant:"primary",size:"md",disabled:!1,loading:!1,label:"Continue"}},i={parameters:v({steps:["Click the button once while enabled.","Turn on Disabled and click again to confirm no event fires.","Turn off Disabled and click once more."],events:["rowan-click"]}),render:({variant:e,size:o,disabled:s,loading:d,label:l})=>{const t=document.createElement("rowan-button");return e!=="primary"&&t.setAttribute("variant",e),o!=="md"&&t.setAttribute("size",o),s&&t.setAttribute("disabled",""),d&&t.setAttribute("loading",""),t.textContent=l,t}},c={render:()=>{const e=h();return e.append(a("Primary"),a("Secondary",{variant:"secondary"}),a("Ghost",{variant:"ghost"}),a("Danger",{variant:"danger"}),a("Create project",{prefix:"+"}),a("Continue",{suffix:">",variant:"secondary"}),a("Saving",{loading:!0}),a("Disabled",{disabled:!0}),a("Disabled secondary",{disabled:!0,variant:"secondary"})),e}};var m,p,b;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the button once while enabled.", "Turn on Disabled and click again to confirm no event fires.", "Turn off Disabled and click once more."],
    events: ["rowan-click"]
  }),
  render: ({
    variant,
    size,
    disabled,
    loading,
    label
  }) => {
    const el = document.createElement("rowan-button");
    if (variant !== "primary") el.setAttribute("variant", variant);
    if (size !== "md") el.setAttribute("size", size);
    if (disabled) el.setAttribute("disabled", "");
    if (loading) el.setAttribute("loading", "");
    el.textContent = label;
    return el;
  }
}`,...(b=(p=i.parameters)==null?void 0:p.docs)==null?void 0:b.source}}};var f,g,y;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const showcase = createShowcase();
    showcase.append(createButton("Primary"), createButton("Secondary", {
      variant: "secondary"
    }), createButton("Ghost", {
      variant: "ghost"
    }), createButton("Danger", {
      variant: "danger"
    }), createButton("Create project", {
      prefix: "+"
    }), createButton("Continue", {
      suffix: ">",
      variant: "secondary"
    }), createButton("Saving", {
      loading: true
    }), createButton("Disabled", {
      disabled: true
    }), createButton("Disabled secondary", {
      disabled: true,
      variant: "secondary"
    }));
    return showcase;
  }
}`,...(y=(g=c.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};const E=["Playground","VisualStates"];export{i as Playground,c as VisualStates,E as __namedExportsOrder,B as default};
