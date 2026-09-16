var y=Object.defineProperty;var m=e=>{throw TypeError(e)};var G=(e,r,t)=>r in e?y(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t;var o=(e,r,t)=>G(e,typeof r!="symbol"?r+"":r,t),u=(e,r,t)=>r.has(e)||m("Cannot "+t);var h=(e,r,t)=>(u(e,r,"read from private field"),t?t.call(e):r.get(e)),v=(e,r,t)=>r.has(e)?m("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(e):r.set(e,t),g=(e,r,t,n)=>(u(e,r,"write to private field"),n?n.call(e,t):r.set(e,t),t);import{B as I,d as w}from"./define-BZx74wjy.js";function c(e){return String(e??"").trim().toLowerCase()==="vertical"?"vertical":"horizontal"}var l;class s extends I{constructor(){super(...arguments);v(this,l,null)}get orientation(){return c(this.readString("orientation","horizontal"))}set orientation(t){const n=c(t);this.reflectString("orientation",n==="horizontal"?null:n)}attributeChangedCallback(t,n,i){if(n!==i){if(t==="orientation"){const a=c(i),p=a==="horizontal"?null:a;if(i!==p){this.reflectString("orientation",p);return}}super.attributeChangedCallback(t,n,i)}}render(){h(this,l)||(this.renderRoot.innerHTML='<span class="divider" part="divider"></span>',g(this,l,this.renderRoot.querySelector(".divider")));const t=this.orientation==="vertical"?"vertical":"horizontal";this.internals&&!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="separator"),this.internals&&!this.hasAttribute("aria-orientation")&&"ariaOrientation"in this.internals&&(this.internals.ariaOrientation=t)}}l=new WeakMap,o(s,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5kaXZpZGVyIHsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1kaXZpZGVyLWNvbG9yLCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIpKTsKICBkaXNwbGF5OiBibG9jazsKICBoZWlnaHQ6IHZhcigtLXJvd2FuLWJvcmRlci13aWR0aCk7CiAgd2lkdGg6IDEwMCU7Cn0KCjpob3N0KFtvcmllbnRhdGlvbj0idmVydGljYWwiXSkgewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICBoZWlnaHQ6IDEwMCU7Cn0KCjpob3N0KFtvcmllbnRhdGlvbj0idmVydGljYWwiXSkgLmRpdmlkZXIgewogIGhlaWdodDogMTAwJTsKICB3aWR0aDogdmFyKC0tcm93YW4tYm9yZGVyLXdpZHRoKTsKfQo=",import.meta.url).href),o(s,"useElementInternals",!0),o(s,"observedAttributes",["orientation"]),o(s,"upgradeProperties",["orientation"]);w("rowan-divider",s);const X={title:"Components/Navigation & Layout/Divider",tags:["autodocs"],argTypes:{orientation:{control:"select",options:["horizontal","vertical"]}},args:{orientation:"horizontal"}},d={render:({orientation:e})=>{if(e==="vertical"){const t=document.createElement("div");t.style.display="flex",t.style.alignItems="center",t.style.gap="0.75rem";const n=document.createElement("span");n.textContent="Left";const i=document.createElement("rowan-divider");i.orientation="vertical",i.style.height="1.5rem";const a=document.createElement("span");return a.textContent="Right",t.append(n,i,a),t}return document.createElement("rowan-divider")}};var b,C,f;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(f=(C=d.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};const K=["Playground"];export{d as Playground,K as __namedExportsOrder,X as default};
