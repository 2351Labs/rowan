import"./toast-BVL-KQwh.js";import"./button-Cnv2b6fF.js";import{c as p}from"./event-script-39NhYcVW.js";import"./define-C1bbOtVV.js";import"./events-CaQanPdG.js";const E={title:"Components/Toast",tags:["autodocs"],argTypes:{tone:{control:"select",options:["info","success","warning","danger"]},dismissible:{control:"boolean"},title:{control:"text"},message:{control:"text"},withAction:{control:"boolean"}},args:{tone:"info",dismissible:!0,title:"Build complete",message:"Sprint 1 artifacts are ready for review.",withAction:!0}},n={parameters:p({steps:["Click the Dismiss button.","Confirm rowan-dismiss appears in Event Trace."],events:["rowan-dismiss"]}),render:({tone:s,dismissible:m,title:o,message:d,withAction:l})=>{const e=document.createElement("rowan-toast");if(s!=="info"&&e.setAttribute("tone",s),m&&e.setAttribute("dismissible",""),o){const t=document.createElement("span");t.slot="title",t.textContent=o,e.append(t)}const i=document.createElement("span");if(i.textContent=d,e.append(i),l){const t=document.createElement("rowan-button");t.slot="actions",t.setAttribute("variant","secondary"),t.setAttribute("size","sm"),t.textContent="View details",e.append(t)}return e}};var a,r,c;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the Dismiss button.", "Confirm rowan-dismiss appears in Event Trace."],
    events: ["rowan-dismiss"]
  }),
  render: ({
    tone,
    dismissible,
    title,
    message,
    withAction
  }) => {
    const toast = document.createElement("rowan-toast");
    if (tone !== "info") toast.setAttribute("tone", tone);
    if (dismissible) toast.setAttribute("dismissible", "");
    if (title) {
      const titleNode = document.createElement("span");
      titleNode.slot = "title";
      titleNode.textContent = title;
      toast.append(titleNode);
    }
    const messageNode = document.createElement("span");
    messageNode.textContent = message;
    toast.append(messageNode);
    if (withAction) {
      const action = document.createElement("rowan-button");
      action.slot = "actions";
      action.setAttribute("variant", "secondary");
      action.setAttribute("size", "sm");
      action.textContent = "View details";
      toast.append(action);
    }
    return toast;
  }
}`,...(c=(r=n.parameters)==null?void 0:r.docs)==null?void 0:c.source}}};const A=["Playground"];export{n as Playground,A as __namedExportsOrder,E as default};
