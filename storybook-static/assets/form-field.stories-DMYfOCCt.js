import"./form-field-tq8wVVEU.js";import"./checkbox-BGfkT_Q8.js";import"./radio-68CFSZcr.js";import"./radio-group-D_PQyiq4.js";import"./text-field-DMq4Bose.js";import"./define-BL-z8OAl.js";import"./events-CaQanPdG.js";function g(){const e=document.createElement("rowan-text-field");return e.name="workspace",e.placeholder="northstar",e}const S={title:"Forms/Form Field",tags:["autodocs"],argTypes:{label:{control:"text"},hint:{control:"text"},description:{control:"text"},error:{control:"text"},labelPosition:{control:"inline-radio",options:["top","start"]},required:{control:"boolean"}},args:{label:"Workspace name",hint:"Used in workspace URLs.",description:"Choose a concise, recognizable name.",error:"",labelPosition:"top",required:!1}},i={render:({label:e,hint:r,description:t,error:o,labelPosition:a,required:x})=>{const n=document.createElement("rowan-form-field");return n.label=e,n.hint=r,n.description=t,n.error=o,n.labelPosition=a,n.required=x,n.append(g()),n}},l={render:()=>{const e=document.createElement("rowan-form-field");e.label="Default visibility",e.hint="You can change this per project later.";const r=document.createElement("rowan-radio-group");return r.name="visibility",["Private","Team","Public"].forEach((t,o)=>{const a=document.createElement("rowan-radio");a.value=t.toLowerCase(),a.checked=o===1,a.textContent=t,r.append(a)}),e.append(r),e}},c={render:()=>{const e=document.createElement("rowan-form-field");e.required=!0;const r=document.createElement("span");r.slot="label",r.textContent="Security contact";const t=document.createElement("span");t.slot="hint",t.textContent="Use a monitored team address.";const o=g();return o.type="email",o.name="security-contact",e.append(r,o,t),e}};var d,s,m;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: ({
    label,
    hint,
    description,
    error,
    labelPosition,
    required
  }) => {
    const formField = document.createElement("rowan-form-field");
    formField.label = label;
    formField.hint = hint;
    formField.description = description;
    formField.error = error;
    formField.labelPosition = labelPosition;
    formField.required = required;
    formField.append(createTextField());
    return formField;
  }
}`,...(m=(s=i.parameters)==null?void 0:s.docs)==null?void 0:m.source}}};var p,u,f;l.parameters={...l.parameters,docs:{...(p=l.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => {
    const formField = document.createElement("rowan-form-field");
    formField.label = "Default visibility";
    formField.hint = "You can change this per project later.";
    const group = document.createElement("rowan-radio-group");
    group.name = "visibility";
    ["Private", "Team", "Public"].forEach((label, index) => {
      const radio = document.createElement("rowan-radio");
      radio.value = label.toLowerCase();
      radio.checked = index === 1;
      radio.textContent = label;
      group.append(radio);
    });
    formField.append(group);
    return formField;
  }
}`,...(f=(u=l.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};var b,F,h;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => {
    const formField = document.createElement("rowan-form-field");
    formField.required = true;
    const label = document.createElement("span");
    label.slot = "label";
    label.textContent = "Security contact";
    const hint = document.createElement("span");
    hint.slot = "hint";
    hint.textContent = "Use a monitored team address.";
    const control = createTextField();
    control.type = "email";
    control.name = "security-contact";
    formField.append(label, control, hint);
    return formField;
  }
}`,...(h=(F=c.parameters)==null?void 0:F.docs)==null?void 0:h.source}}};const T=["Playground","GroupedControl","SlottedContent"];export{l as GroupedControl,i as Playground,c as SlottedContent,T as __namedExportsOrder,S as default};
