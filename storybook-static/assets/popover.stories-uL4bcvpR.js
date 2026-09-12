var I=Object.defineProperty;var i=t=>{throw TypeError(t)};var v=(t,e,o)=>e in t?I(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var s=(t,e,o)=>v(t,typeof e!="symbol"?e+"":e,o),g=(t,e,o)=>e.has(t)||i("Cannot "+o);var c=(t,e,o)=>(g(t,e,"read from private field"),o?o.call(t):e.get(t)),l=(t,e,o)=>e.has(t)?i("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),m=(t,e,o,n)=>(g(t,e,"write to private field"),n?n.call(t,o):e.set(t,o),o);import{B as h,d as C}from"./define-C9dOMgiB.js";import"./button-oWFjesS9.js";import"./events-CaQanPdG.js";var r;class a extends h{constructor(){super(...arguments);l(this,r,null)}get open(){return this.readBoolean("open")}set open(o){this.reflectBoolean("open",!!o)}render(){c(this,r)||(this.renderRoot.innerHTML=`
        <span class="trigger" part="trigger"><slot name="trigger"></slot></span>
        <section class="panel" part="panel"><slot></slot></section>
      `,m(this,r,this.renderRoot.querySelector(".panel"))),c(this,r).hidden=!this.open}}r=new WeakMap,s(a,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KCjpob3N0KFtoaWRkZW5dKSB7CiAgZGlzcGxheTogbm9uZTsKfQoKLnRyaWdnZXIgewogIGRpc3BsYXk6IGlubGluZS1mbGV4Owp9CgoucGFuZWwgewogIGJhY2tncm91bmQ6IHZhcigtLXJvd2FuLWNvbG9yLWJnLCAjZmZmZmZmKTsKICBib3JkZXI6IHZhcigtLXJvd2FuLWJvcmRlci13aWR0aCkgc29saWQgdmFyKC0tcm93YW4tY29sb3ItYm9yZGVyKTsKICBib3JkZXItcmFkaXVzOiB2YXIoLS1yb3dhbi1yYWRpdXMtbWQpOwogIGJveC1zaGFkb3c6IDAgMTBweCAyNnB4IHJnYigxNiAyOCAyMiAvIDE0JSk7CiAgbGVmdDogMDsKICBtaW4td2lkdGg6IDE0cmVtOwogIHBhZGRpbmc6IHZhcigtLXJvd2FuLXNwYWNlLTMpOwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICB0b3A6IGNhbGMoMTAwJSArIDAuMzVyZW0pOwogIHotaW5kZXg6IDIwOwp9Cg==",import.meta.url).href),s(a,"observedAttributes",["open"]),s(a,"upgradeProperties",["open"]);C("rowan-popover",a);const y={title:"Components/Popover",tags:["autodocs"],argTypes:{open:{control:"boolean"}},args:{open:!0}},p={render:({open:t})=>{const e=document.createElement("rowan-popover");t&&e.setAttribute("open","");const o=document.createElement("rowan-button");o.slot="trigger",o.textContent="Open popover";const n=document.createElement("p");return n.textContent="Popover content can hold actions, text, or filters.",n.style.margin="0",e.append(o,n),e}};var d,u,b;p.parameters={...p.parameters,docs:{...(d=p.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: ({
    open
  }) => {
    const popover = document.createElement("rowan-popover");
    if (open) popover.setAttribute("open", "");
    const trigger = document.createElement("rowan-button");
    trigger.slot = "trigger";
    trigger.textContent = "Open popover";
    const text = document.createElement("p");
    text.textContent = "Popover content can hold actions, text, or filters.";
    text.style.margin = "0";
    popover.append(trigger, text);
    return popover;
  }
}`,...(b=(u=p.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};const x=["Playground"];export{p as Playground,x as __namedExportsOrder,y as default};
