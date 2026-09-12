var H=Object.defineProperty;var k=s=>{throw TypeError(s)};var E=(s,i,t)=>i in s?H(s,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[i]=t;var v=(s,i,t)=>E(s,typeof i!="symbol"?i+"":i,t),G=(s,i,t)=>i.has(s)||k("Cannot "+t);var e=(s,i,t)=>(G(s,i,"read from private field"),t?t.call(s):i.get(s)),b=(s,i,t)=>i.has(s)?k("Cannot add the same private member more than once"):i instanceof WeakSet?i.add(s):i.set(s,t),c=(s,i,t,l)=>(G(s,i,"write to private field"),l?l.call(s,t):i.set(s,t),t),r=(s,i,t)=>(G(s,i,"access private method"),t);import{B as U,d as P}from"./define-BSqCZTMW.js";import{e as O}from"./events-CaQanPdG.js";import{c as _}from"./event-script-39NhYcVW.js";let F=0;const $=/^[+-]?(?:\d+|\d*\.\d+)$/;function Y(s){const i=String(s??"").trim();if(!i||!$.test(i))return"";const t=Number(i);return Number.isFinite(t)?String(t):""}function V(s){const i=Y(s);return i?Number(i):null}function w(s){const i=String(s??"").trim();if(!i)return"";const t=Number(i);return Number.isFinite(t)?String(t):""}function j(s,i=1){const t=Number(s);return!Number.isFinite(t)||t<=0?i:t}var a,y,Z,C,W,x,f,n,K,S,X,L,B,p,Q,g,R;class I extends U{constructor(){super(...arguments);b(this,n);b(this,a,null);b(this,y,null);b(this,Z,null);b(this,C,null);b(this,W,null);b(this,x,"");b(this,f,!1)}connectedCallback(){super.connectedCallback(),e(this,W)===null&&c(this,W,this.value),this.id||(F+=1,this.id=`rowan-number-field-${F}`),c(this,x,`${this.id}__input`),r(this,n,B).call(this),r(this,n,p).call(this),r(this,n,R).call(this)}get name(){return this.readString("name","")}set name(t){this.reflectString("name",t)}get value(){return Y(this.readString("value",""))}set value(t){const l=Y(t);this.reflectString("value",l||null),r(this,n,B).call(this),r(this,n,p).call(this)}get placeholder(){return this.readString("placeholder","")}set placeholder(t){this.reflectString("placeholder",t)}get label(){return this.readString("label","")}set label(t){this.reflectString("label",t)}get min(){return w(this.readString("min",""))}set min(t){const l=w(t);this.reflectString("min",l||null),r(this,n,p).call(this)}get max(){return w(this.readString("max",""))}set max(t){const l=w(t);this.reflectString("max",l||null),r(this,n,p).call(this)}get step(){return j(this.readNumber("step",1),1)}set step(t){const l=j(t,1);this.reflectNumber("step",l===1?null:l),r(this,n,p).call(this)}get disabled(){return this.readBoolean("disabled")}set disabled(t){this.reflectBoolean("disabled",!!t)}get required(){return this.readBoolean("required")}set required(t){this.reflectBoolean("required",!!t),r(this,n,p).call(this)}get invalid(){return this.readBoolean("invalid")}set invalid(t){c(this,f,!1),this.reflectBoolean("invalid",!!t)}setFormValue(t=this.value){this.internals&&typeof this.internals.setFormValue=="function"&&this.internals.setFormValue(t)}setValidity(t={},l="",o=e(this,a)){this.internals&&typeof this.internals.setValidity=="function"&&this.internals.setValidity(t,l,o)}formResetCallback(){this.value=e(this,W)??"",this.requestRender()}formStateRestoreCallback(t){this.value=t==null?"":String(t),this.requestRender()}checkValidity(){return this.internals&&typeof this.internals.checkValidity=="function"?this.internals.checkValidity():e(this,a)?e(this,a).checkValidity():!0}reportValidity(){return this.internals&&typeof this.internals.reportValidity=="function"?this.internals.reportValidity():e(this,a)?e(this,a).reportValidity():!0}render(){e(this,a)||(this.renderRoot.innerHTML=`
        <div class="control" part="control">
          <label class="sr-only" part="label"></label>
          <button
            class="step-button"
            part="decrement-button"
            type="button"
            data-action="decrement"
            aria-label="Decrease value"
          >
            -
          </button>
          <input class="input" part="input" type="number" inputmode="decimal" />
          <button
            class="step-button"
            part="increment-button"
            type="button"
            data-action="increment"
            aria-label="Increase value"
          >
            +
          </button>
        </div>
      `,c(this,a,this.renderRoot.querySelector("input")),c(this,y,this.renderRoot.querySelector("label")),c(this,Z,this.renderRoot.querySelector('[data-action="decrement"]')),c(this,C,this.renderRoot.querySelector('[data-action="increment"]')),this.listen(e(this,a),"input",()=>{this.value=e(this,a).value}),this.listen(e(this,a),"change",()=>{this.value=e(this,a).value,O(this,"rowan-change",{value:this.value})}),this.listen(e(this,Z),"click",()=>{r(this,n,L).call(this,-1)}),this.listen(e(this,C),"click",()=>{r(this,n,L).call(this,1)})),e(this,a).id=e(this,x),e(this,a).name=this.name,e(this,a).value=this.value,e(this,a).placeholder=this.placeholder,e(this,a).min=this.min,e(this,a).max=this.max,e(this,a).step=String(this.step),e(this,a).disabled=this.disabled,e(this,a).required=this.required,e(this,Z).disabled=this.disabled,e(this,C).disabled=this.disabled;const t=this.label;e(this,y).textContent=t,e(this,y).hidden=t.length===0,e(this,y).htmlFor=e(this,x),t.length>0?e(this,a).setAttribute("aria-label",t):e(this,a).removeAttribute("aria-label"),r(this,n,B).call(this),r(this,n,p).call(this),r(this,n,R).call(this)}}a=new WeakMap,y=new WeakMap,Z=new WeakMap,C=new WeakMap,W=new WeakMap,x=new WeakMap,f=new WeakMap,n=new WeakSet,K=function(){return V(this.value)},S=function(){return V(this.min)},X=function(){return V(this.max)},L=function(t){if(this.disabled)return;const l=this.step,o=r(this,n,S).call(this),h=r(this,n,X).call(this);let d=r(this,n,K).call(this);d==null&&(d=t>0?o??0:h??0);let u=d+t*l;o!=null&&(u=Math.max(o,u)),h!=null&&(u=Math.min(h,u)),u=Number(u.toFixed(10));const m=String(u);m!==this.value&&(this.value=m,O(this,"rowan-change",{value:this.value}))},B=function(){this.setFormValue(this.value)},p=function(){if(!e(this,a))return;if(this.required&&this.value.length===0){this.setValidity({valueMissing:!0},"Please enter a number.",e(this,a)),r(this,n,g).call(this,!0);return}const t=r(this,n,K).call(this),l=r(this,n,S).call(this),o=r(this,n,X).call(this);if(this.value.length>0&&t==null){this.setValidity({badInput:!0},"Enter a valid number.",e(this,a)),r(this,n,g).call(this,!0);return}if(t!=null&&l!=null&&t<l){this.setValidity({rangeUnderflow:!0},"Value is below minimum.",e(this,a)),r(this,n,g).call(this,!0);return}if(t!=null&&o!=null&&t>o){this.setValidity({rangeOverflow:!0},"Value is above maximum.",e(this,a)),r(this,n,g).call(this,!0);return}if(t!=null&&r(this,n,Q).call(this,t,l)){this.setValidity({stepMismatch:!0},"Value does not align to step.",e(this,a)),r(this,n,g).call(this,!0);return}this.setValidity({},"",e(this,a)),r(this,n,g).call(this,!1)},Q=function(t,l){const o=this.step,d=(t-(l??0))/o;return Math.abs(Math.round(d)-d)>1e-9},g=function(t){if(t){this.hasAttribute("invalid")||(c(this,f,!0),this.setAttribute("invalid",""));return}e(this,f)&&(this.removeAttribute("invalid"),c(this,f,!1))},R=function(){if(this.internals){if(!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="spinbutton"),!this.hasAttribute("aria-required")&&"ariaRequired"in this.internals&&(this.internals.ariaRequired=this.required?"true":"false"),!this.hasAttribute("aria-disabled")&&"ariaDisabled"in this.internals&&(this.internals.ariaDisabled=this.disabled?"true":"false"),!this.hasAttribute("aria-invalid")&&"ariaInvalid"in this.internals&&(this.internals.ariaInvalid=this.invalid?"true":"false"),!this.hasAttribute("aria-label")&&"ariaLabel"in this.internals){const t=this.label.trim();this.internals.ariaLabel=t||null}!this.hasAttribute("aria-valuemin")&&"ariaValueMin"in this.internals&&(this.internals.ariaValueMin=this.min||null),!this.hasAttribute("aria-valuemax")&&"ariaValueMax"in this.internals&&(this.internals.ariaValueMax=this.max||null),!this.hasAttribute("aria-valuenow")&&"ariaValueNow"in this.internals&&(this.internals.ariaValueNow=this.value||null)}},v(I,"formAssociated",!0),v(I,"shadowRootOptions",{mode:"open",delegatesFocus:!0}),v(I,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICBtaW4taW5saW5lLXNpemU6IDEycmVtOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1yb3dhbi1mb250LWZhbWlseSwgIkF2ZW5pciBOZXh0IiwgIlNlZ29lIFVJIiwgc2Fucy1zZXJpZik7Cn0KCjpob3N0KFtoaWRkZW5dKSB7CiAgZGlzcGxheTogbm9uZTsKfQoKLmNvbnRyb2wgewogIGRpc3BsYXk6IGdyaWQ7CiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAyLjc1cmVtIG1pbm1heCgwLCAxZnIpIDIuNzVyZW07CiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7CiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tcm93YW4tZmllbGQtYm9yZGVyLCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIsICNkOGRjZDUpKTsKICBib3JkZXItcmFkaXVzOiB2YXIoLS1yb3dhbi1yYWRpdXMtbWQsIDAuNXJlbSk7CiAgb3ZlcmZsb3c6IGhpZGRlbjsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1maWVsZC1iZywgI2ZmZmZmZik7Cn0KCi5zci1vbmx5IHsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgaW5saW5lLXNpemU6IDFweDsKICBibG9jay1zaXplOiAxcHg7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IC0xcHg7CiAgb3ZlcmZsb3c6IGhpZGRlbjsKICBjbGlwOiByZWN0KDAsIDAsIDAsIDApOwogIHdoaXRlLXNwYWNlOiBub3dyYXA7CiAgYm9yZGVyOiAwOwp9CgouaW5wdXQgewogIGJvcmRlcjogMDsKICBtaW4tYmxvY2stc2l6ZTogMi43NXJlbTsKICBwYWRkaW5nOiAwIHZhcigtLXJvd2FuLXNwYWNlLTMsIDAuNzVyZW0pOwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBmb250OiBpbmhlcml0OwogIGNvbG9yOiB2YXIoLS1yb3dhbi1maWVsZC1mZywgdmFyKC0tcm93YW4tY29sb3ItZmcsICMxZjI0MjEpKTsKICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsKfQoKLmlucHV0OmZvY3VzIHsKICBvdXRsaW5lOiBub25lOwp9Cgouc3RlcC1idXR0b24gewogIGJvcmRlcjogMDsKICBtaW4tYmxvY2stc2l6ZTogMi43NXJlbTsKICBtaW4taW5saW5lLXNpemU6IDIuNzVyZW07CiAgZGlzcGxheTogaW5saW5lLWZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsKICBmb250OiBpbmhlcml0OwogIGZvbnQtc2l6ZTogMS4xNXJlbTsKICBsaW5lLWhlaWdodDogMTsKICBjb2xvcjogdmFyKC0tcm93YW4tZmllbGQtZmcsIHZhcigtLXJvd2FuLWNvbG9yLWZnLCAjMWYyNDIxKSk7CiAgYmFja2dyb3VuZDogdmFyKC0tcm93YW4tZmllbGQtYmcsICNmZmZmZmYpOwogIGN1cnNvcjogcG9pbnRlcjsKfQoKLnN0ZXAtYnV0dG9uOmZpcnN0LW9mLXR5cGUgewogIGJvcmRlci1pbmxpbmUtZW5kOiAxcHggc29saWQgdmFyKC0tcm93YW4tZmllbGQtYm9yZGVyLCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIsICNkOGRjZDUpKTsKfQoKLnN0ZXAtYnV0dG9uOmxhc3Qtb2YtdHlwZSB7CiAgYm9yZGVyLWlubGluZS1zdGFydDogMXB4IHNvbGlkIHZhcigtLXJvd2FuLWZpZWxkLWJvcmRlciwgdmFyKC0tcm93YW4tY29sb3ItYm9yZGVyLCAjZDhkY2Q1KSk7Cn0KCi5zdGVwLWJ1dHRvbjpob3Zlcjpub3QoOmRpc2FibGVkKSB7CiAgYmFja2dyb3VuZDogdmFyKC0tcm93YW4tY29sb3Itc2FuZC0xMDAsICNlZmVkZTQpOwp9Cgouc3RlcC1idXR0b246Zm9jdXMtdmlzaWJsZSB7CiAgb3V0bGluZTogbm9uZTsKICBib3gtc2hhZG93OiBpbnNldCAwIDAgMCAycHggdmFyKC0tcm93YW4tY29sb3ItYWNjZW50LCAjMWQ0MzJmKTsKfQoKLmNvbnRyb2w6Zm9jdXMtd2l0aGluIHsKICBib3gtc2hhZG93OiB2YXIoLS1yb3dhbi1mb2N1cy1yaW5nLCAwIDAgMCAycHggcmdiKDQ3IDEwNiA3NyAvIDMyJSkpOwp9Cgo6aG9zdChbaW52YWxpZF0pIC5jb250cm9sIHsKICBib3JkZXItY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWRhbmdlciwgI2I0MzkyZCk7Cn0KCjpob3N0KFtkaXNhYmxlZF0pIC5jb250cm9sIHsKICBvcGFjaXR5OiAwLjY1Owp9Cgouc3RlcC1idXR0b246ZGlzYWJsZWQsCi5pbnB1dDpkaXNhYmxlZCB7CiAgY3Vyc29yOiBub3QtYWxsb3dlZDsKfQ==",import.meta.url).href),v(I,"observedAttributes",["name","value","placeholder","label","min","max","step","disabled","required","invalid"]),v(I,"upgradeProperties",["name","value","placeholder","label","min","max","step","disabled","required","invalid"]);P("rowan-number-field",I);const st={title:"Components/Number Field",tags:["autodocs"],argTypes:{value:{control:"text"},label:{control:"text"},placeholder:{control:"text"},min:{control:"text"},max:{control:"text"},step:{control:"number"},required:{control:"boolean"},disabled:{control:"boolean"}},args:{value:"10",label:"Units",placeholder:"Enter units",min:"0",max:"100",step:1,required:!1,disabled:!1}},N={parameters:_({steps:["Type a number and commit the value.","Use increment and decrement controls.","Inspect rowan-change payloads in Event Trace."],events:["rowan-change"]}),render:({value:s,label:i,placeholder:t,min:l,max:o,step:h,required:d,disabled:u})=>{const m=document.createElement("rowan-number-field");return m.value=s,m.label=i,m.placeholder=t,m.min=l,m.max=o,m.step=h,m.required=d,m.disabled=u,m}},A={args:{value:"25",label:"Minimum order quantity",min:"0",max:"500",step:5},render:({value:s,label:i,min:t,max:l,step:o})=>{const h=document.createElement("div");h.style.display="grid",h.style.gap="0.75rem",h.style.maxWidth="22rem";const d=document.createElement("p");d.style.margin="0",d.style.fontSize="0.875rem",d.style.color="var(--rowan-color-muted)",d.textContent="Tune report thresholds with keypad-friendly numeric entry.";const u=document.createElement("rowan-number-field");return u.value=s,u.label=i,u.min=t,u.max=l,u.step=o,h.append(d,u),h}};var M,D,z;N.parameters={...N.parameters,docs:{...(M=N.parameters)==null?void 0:M.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Type a number and commit the value.", "Use increment and decrement controls.", "Inspect rowan-change payloads in Event Trace."],
    events: ["rowan-change"]
  }),
  render: ({
    value,
    label,
    placeholder,
    min,
    max,
    step,
    required,
    disabled
  }) => {
    const field = document.createElement("rowan-number-field");
    field.value = value;
    field.label = label;
    field.placeholder = placeholder;
    field.min = min;
    field.max = max;
    field.step = step;
    field.required = required;
    field.disabled = disabled;
    return field;
  }
}`,...(z=(D=N.parameters)==null?void 0:D.docs)==null?void 0:z.source}}};var T,q,J;A.parameters={...A.parameters,docs:{...(T=A.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    value: "25",
    label: "Minimum order quantity",
    min: "0",
    max: "500",
    step: 5
  },
  render: ({
    value,
    label,
    min,
    max,
    step
  }) => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "0.75rem";
    wrapper.style.maxWidth = "22rem";
    const hint = document.createElement("p");
    hint.style.margin = "0";
    hint.style.fontSize = "0.875rem";
    hint.style.color = "var(--rowan-color-muted)";
    hint.textContent = "Tune report thresholds with keypad-friendly numeric entry.";
    const field = document.createElement("rowan-number-field");
    field.value = value;
    field.label = label;
    field.min = min;
    field.max = max;
    field.step = step;
    wrapper.append(hint, field);
    return wrapper;
  }
}`,...(J=(q=A.parameters)==null?void 0:q.docs)==null?void 0:J.source}}};const at=["Playground","ReportCriteria"];export{N as Playground,A as ReportCriteria,at as __namedExportsOrder,st as default};
