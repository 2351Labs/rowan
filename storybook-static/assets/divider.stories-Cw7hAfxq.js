var y=Object.defineProperty;var c=t=>{throw TypeError(t)};var C=(t,n,e)=>n in t?y(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var i=(t,n,e)=>C(t,typeof n!="symbol"?n+"":n,e),p=(t,n,e)=>n.has(t)||c("Cannot "+e);var m=(t,n,e)=>(p(t,n,"read from private field"),e?e.call(t):n.get(t)),h=(t,n,e)=>n.has(t)?c("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(t):n.set(t,e),v=(t,n,e,r)=>(p(t,n,"write to private field"),r?r.call(t,e):n.set(t,e),e);import{B as f,d as G}from"./define-BSqCZTMW.js";var o;class a extends f{constructor(){super(...arguments);h(this,o,null)}get orientation(){return this.readString("orientation","horizontal")}set orientation(e){this.reflectString("orientation",e==="horizontal"?null:e)}render(){m(this,o)||(this.renderRoot.innerHTML='<span class="divider" part="divider"></span>',v(this,o,this.renderRoot.querySelector(".divider")));const e=this.orientation==="vertical"?"vertical":"horizontal";this.internals&&!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="separator"),this.internals&&!this.hasAttribute("aria-orientation")&&"ariaOrientation"in this.internals&&(this.internals.ariaOrientation=e)}}o=new WeakMap,i(a,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5kaXZpZGVyIHsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1kaXZpZGVyLWNvbG9yLCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIpKTsKICBkaXNwbGF5OiBibG9jazsKICBoZWlnaHQ6IHZhcigtLXJvd2FuLWJvcmRlci13aWR0aCk7CiAgd2lkdGg6IDEwMCU7Cn0KCjpob3N0KFtvcmllbnRhdGlvbj0idmVydGljYWwiXSkgewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICBoZWlnaHQ6IDEwMCU7Cn0KCjpob3N0KFtvcmllbnRhdGlvbj0idmVydGljYWwiXSkgLmRpdmlkZXIgewogIGhlaWdodDogMTAwJTsKICB3aWR0aDogdmFyKC0tcm93YW4tYm9yZGVyLXdpZHRoKTsKfQo=",import.meta.url).href),i(a,"useElementInternals",!0),i(a,"observedAttributes",["orientation"]),i(a,"upgradeProperties",["orientation"]);G("rowan-divider",a);const k={title:"Components/Divider",tags:["autodocs"],argTypes:{orientation:{control:"select",options:["horizontal","vertical"]}},args:{orientation:"horizontal"}},s={render:({orientation:t})=>{if(t==="vertical"){const e=document.createElement("div");e.style.display="flex",e.style.alignItems="center",e.style.gap="0.75rem";const r=document.createElement("span");r.textContent="Left";const d=document.createElement("rowan-divider");d.orientation="vertical",d.style.height="1.5rem";const l=document.createElement("span");return l.textContent="Right",e.append(r,d,l),e}return document.createElement("rowan-divider")}};var u,g,b;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: ({
    orientation
  }) => {
    if (orientation === "vertical") {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.gap = "0.75rem";
      const before = document.createElement("span");
      before.textContent = "Left";
      const divider = document.createElement("rowan-divider");
      divider.orientation = "vertical";
      divider.style.height = "1.5rem";
      const after = document.createElement("span");
      after.textContent = "Right";
      wrapper.append(before, divider, after);
      return wrapper;
    }
    const divider = document.createElement("rowan-divider");
    return divider;
  }
}`,...(b=(g=s.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};const E=["Playground"];export{s as Playground,E as __namedExportsOrder,k as default};
