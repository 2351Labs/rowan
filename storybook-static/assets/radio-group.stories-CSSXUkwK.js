var E=Object.defineProperty;var v=t=>{throw TypeError(t)};var x=(t,a,e)=>a in t?E(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var i=(t,a,e)=>x(t,typeof a!="symbol"?a+"":a,e),b=(t,a,e)=>a.has(t)||v("Cannot "+e);var m=(t,a,e)=>(b(t,a,"read from private field"),e?e.call(t):a.get(t)),h=(t,a,e)=>a.has(t)?v("Cannot add the same private member more than once"):a instanceof WeakSet?a.add(t):a.set(t,e),g=(t,a,e,n)=>(b(t,a,"write to private field"),n?n.call(t,e):a.set(t,e),e);import{B as y,d as A}from"./define-DJLCbHkD.js";import{e as L}from"./events-CaQanPdG.js";import"./radio-BXqxHDwE.js";import{c as k}from"./event-script-39NhYcVW.js";var s,d;class u extends y{constructor(){super(...arguments);h(this,s,null);h(this,d,null)}connectedCallback(){super.connectedCallback(),!m(this,d)&&g(this,d,this.listen(this,"rowan-change",e=>{const n=e.target;if(!(n instanceof HTMLElement)||n.tagName.toLowerCase()!=="rowan-radio"||!n.checked)return;const o=n.value;this.value!==o&&(this.value=o,L(this,"rowan-change",{value:this.value,radio:n}))}))}get value(){return this.readString("value","")}set value(e){this.reflectString("value",e)}get name(){return this.readString("name","")}set name(e){this.reflectString("name",e)}get disabled(){return this.readBoolean("disabled")}set disabled(e){this.reflectBoolean("disabled",!!e)}get required(){return this.readBoolean("required")}set required(e){this.reflectBoolean("required",!!e)}render(){var c;m(this,s)||(this.renderRoot.innerHTML='<div class="group" part="group"><slot></slot></div>',g(this,s,this.renderRoot.querySelector("slot"))),this.internals&&!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="radiogroup");const e=m(this,s).assignedElements({flatten:!0}).filter(r=>r instanceof HTMLElement&&r.tagName.toLowerCase()==="rowan-radio"),n=((c=e.find(r=>r.checked))==null?void 0:c.value)??"",o=this.value||n;!this.value&&n&&(this.value=n),e.forEach((r,l)=>{r.hasAttribute("data-rowan-local-disabled")||r.setAttribute("data-rowan-local-disabled",r.disabled?"true":"false"),r.hasAttribute("data-rowan-local-required")||r.setAttribute("data-rowan-local-required",r.required?"true":"false"),this.name&&(r.name=this.name);const q=r.getAttribute("data-rowan-local-disabled")==="true",B=r.getAttribute("data-rowan-local-required")==="true";r.disabled=this.disabled||q,r.required=B||this.required&&l===0,r.checked=r.value===o})}}s=new WeakMap,d=new WeakMap,i(u,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5ncm91cCB7CiAgZGlzcGxheTogZ3JpZDsKICBnYXA6IHZhcigtLXJvd2FuLXNwYWNlLTIpOwp9Cg==",import.meta.url).href),i(u,"useElementInternals",!0),i(u,"observedAttributes",["value","name","disabled","required"]),i(u,"upgradeProperties",["value","name","disabled","required"]);A("rowan-radio-group",u);const N={title:"Components/Radio Group",tags:["autodocs"],argTypes:{value:{control:"text"},name:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"}},args:{value:"team",name:"audience",required:!1,disabled:!1}},p={parameters:k({steps:["Choose an option to update group value."],events:["rowan-change"]}),render:({value:t,name:a,required:e,disabled:n})=>{const o=document.createElement("rowan-radio-group");o.value=t,o.name=a,o.required=e,o.disabled=n;const c=[{label:"Team",value:"team"},{label:"Department",value:"department"},{label:"Company",value:"company"}];for(const r of c){const l=document.createElement("rowan-radio");l.value=r.value,l.textContent=r.label,o.append(l)}return o}};var f,w,C;p.parameters={...p.parameters,docs:{...(f=p.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(C=(w=p.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};const P=["Playground"];export{p as Playground,P as __namedExportsOrder,N as default};
