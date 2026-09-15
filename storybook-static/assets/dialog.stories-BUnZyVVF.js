import"./dialog-DgUraEkp.js";import"./button-DRTocQjA.js";import{c as d}from"./event-script-39NhYcVW.js";import"./define-Chpk02HC.js";import"./events-CaQanPdG.js";import"./form-BsCuqVMT.js";const C={title:"Components/Overlays & Menus/Dialog",tags:["autodocs"],argTypes:{open:{control:"boolean"}},args:{open:!1}},n={parameters:d({steps:["Click Open dialog.","Close using the Save action or press Escape.","Compare rowan-click and rowan-close entries in Event Trace."],events:["rowan-click","rowan-close"]}),render:({open:p})=>{const a=document.createElement("div"),o=document.createElement("rowan-button");o.textContent="Open dialog";const e=document.createElement("rowan-dialog");p&&e.setAttribute("open","");const r=document.createElement("span");r.slot="title",r.textContent="Confirm route";const c=document.createElement("p");c.textContent="Do you want to save this trail plan to your collection?";const t=document.createElement("rowan-button");return t.slot="actions",t.textContent="Save",e.append(r,c,t),o.addEventListener("rowan-click",()=>{e.open=!0}),t.addEventListener("rowan-click",()=>{e.open=!1}),a.append(o,e),a}};var i,s,l;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click Open dialog.", "Close using the Save action or press Escape.", "Compare rowan-click and rowan-close entries in Event Trace."],
    events: ["rowan-click", "rowan-close"]
  }),
  render: ({
    open
  }) => {
    const wrapper = document.createElement("div");
    const trigger = document.createElement("rowan-button");
    trigger.textContent = "Open dialog";
    const dialog = document.createElement("rowan-dialog");
    if (open) dialog.setAttribute("open", "");
    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "Confirm route";
    const body = document.createElement("p");
    body.textContent = "Do you want to save this trail plan to your collection?";
    const action = document.createElement("rowan-button");
    action.slot = "actions";
    action.textContent = "Save";
    dialog.append(title, body, action);
    trigger.addEventListener("rowan-click", () => {
      dialog.open = true;
    });
    action.addEventListener("rowan-click", () => {
      dialog.open = false;
    });
    wrapper.append(trigger, dialog);
    return wrapper;
  }
}`,...(l=(s=n.parameters)==null?void 0:s.docs)==null?void 0:l.source}}};const y=["Playground"];export{n as Playground,y as __namedExportsOrder,C as default};
