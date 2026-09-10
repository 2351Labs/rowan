var B=Object.defineProperty;var m=t=>{throw TypeError(t)};var E=(t,a,e)=>a in t?B(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var i=(t,a,e)=>E(t,typeof a!="symbol"?a+"":a,e),g=(t,a,e)=>a.has(t)||m("Cannot "+e);var p=(t,a,e)=>(g(t,a,"read from private field"),e?e.call(t):a.get(t)),h=(t,a,e)=>a.has(t)?m("Cannot add the same private member more than once"):a instanceof WeakSet?a.add(t):a.set(t,e),b=(t,a,e,n)=>(g(t,a,"write to private field"),n?n.call(t,e):a.set(t,e),e);import{B as x,d as y}from"./define-C1bbOtVV.js";import{e as A}from"./events-CaQanPdG.js";import"./radio-CMjFnEmq.js";import{c as k}from"./event-script-39NhYcVW.js";var s;class u extends x{constructor(){super(...arguments);h(this,s,null)}connectedCallback(){super.connectedCallback(),this.listen(this,"rowan-change",e=>{const n=e.target;if(!(n instanceof HTMLElement)||n.tagName.toLowerCase()!=="rowan-radio"||!n.checked)return;const o=n.value;this.value!==o&&(this.value=o,A(this,"rowan-change",{value:this.value,radio:n}))})}get value(){return this.readString("value","")}set value(e){this.reflectString("value",e)}get name(){return this.readString("name","")}set name(e){this.reflectString("name",e)}get disabled(){return this.readBoolean("disabled")}set disabled(e){this.reflectBoolean("disabled",!!e)}get required(){return this.readBoolean("required")}set required(e){this.reflectBoolean("required",!!e)}render(){var d;p(this,s)||(this.renderRoot.innerHTML='<div class="group" part="group"><slot></slot></div>',b(this,s,this.renderRoot.querySelector("slot"))),this.internals&&!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="radiogroup");const e=p(this,s).assignedElements({flatten:!0}).filter(r=>r instanceof HTMLElement&&r.tagName.toLowerCase()==="rowan-radio"),n=((d=e.find(r=>r.checked))==null?void 0:d.value)??"",o=this.value||n;!this.value&&n&&(this.value=n),e.forEach((r,l)=>{r.hasAttribute("data-rowan-local-disabled")||r.setAttribute("data-rowan-local-disabled",r.disabled?"true":"false"),r.hasAttribute("data-rowan-local-required")||r.setAttribute("data-rowan-local-required",r.required?"true":"false"),this.name&&(r.name=this.name);const q=r.getAttribute("data-rowan-local-disabled")==="true",C=r.getAttribute("data-rowan-local-required")==="true";r.disabled=this.disabled||q,r.required=C||this.required&&l===0,r.checked=r.value===o})}}s=new WeakMap,i(u,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5ncm91cCB7CiAgZGlzcGxheTogZ3JpZDsKICBnYXA6IHZhcigtLXJvd2FuLXNwYWNlLTIpOwp9Cg==",import.meta.url).href),i(u,"useElementInternals",!0),i(u,"observedAttributes",["value","name","disabled","required"]),i(u,"upgradeProperties",["value","name","disabled","required"]);y("rowan-radio-group",u);const X={title:"Components/Radio Group",tags:["autodocs"],argTypes:{value:{control:"text"},name:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"}},args:{value:"team",name:"audience",required:!1,disabled:!1}},c={parameters:k({steps:["Choose an option to update group value."],events:["rowan-change"]}),render:({value:t,name:a,required:e,disabled:n})=>{const o=document.createElement("rowan-radio-group");o.value=t,o.name=a,o.required=e,o.disabled=n;const d=[{label:"Team",value:"team"},{label:"Department",value:"department"},{label:"Company",value:"company"}];for(const r of d){const l=document.createElement("rowan-radio");l.value=r.value,l.textContent=r.label,o.append(l)}return o}};var v,f,w;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Choose an option to update group value."],
    events: ["rowan-change"]
  }),
  render: ({
    value,
    name,
    required,
    disabled
  }) => {
    const group = document.createElement("rowan-radio-group");
    group.value = value;
    group.name = name;
    group.required = required;
    group.disabled = disabled;
    const options = [{
      label: "Team",
      value: "team"
    }, {
      label: "Department",
      value: "department"
    }, {
      label: "Company",
      value: "company"
    }];
    for (const option of options) {
      const radio = document.createElement("rowan-radio");
      radio.value = option.value;
      radio.textContent = option.label;
      group.append(radio);
    }
    return group;
  }
}`,...(w=(f=c.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};const N=["Playground"];export{c as Playground,N as __namedExportsOrder,X as default};
