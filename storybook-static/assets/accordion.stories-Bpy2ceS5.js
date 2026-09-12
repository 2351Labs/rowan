var Z=Object.defineProperty;var u=t=>{throw TypeError(t)};var C=(t,o,e)=>o in t?Z(t,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[o]=e;var a=(t,o,e)=>C(t,typeof o!="symbol"?o+"":o,e),h=(t,o,e)=>o.has(t)||u("Cannot "+e);var n=(t,o,e)=>(h(t,o,"read from private field"),e?e.call(t):o.get(t)),l=(t,o,e)=>o.has(t)?u("Cannot add the same private member more than once"):o instanceof WeakSet?o.add(t):o.set(t,e),d=(t,o,e,r)=>(h(t,o,"write to private field"),r?r.call(t,e):o.set(t,e),e);import{B as I,d as v}from"./define-DNCuZUBR.js";import{e as W}from"./events-CaQanPdG.js";import{c as G}from"./event-script-39NhYcVW.js";var s,i,m;class c extends I{constructor(){super(...arguments);l(this,s,null);l(this,i,null);l(this,m,null)}connectedCallback(){super.connectedCallback(),!n(this,m)&&d(this,m,this.listen(this,"click",e=>{e.composedPath().includes(n(this,s))&&(this.open=!this.open,W(this,"rowan-change",{open:this.open}))}))}get open(){return this.readBoolean("open")}set open(e){this.reflectBoolean("open",!!e)}get summary(){return this.readString("summary","Details")}set summary(e){this.reflectString("summary",e)}render(){n(this,s)||(this.renderRoot.innerHTML=`
        <button class="trigger" part="trigger" type="button" aria-expanded="false">
          <slot name="summary"></slot>
          <span class="fallback-summary"></span>
        </button>
        <div class="panel" part="panel">
          <slot></slot>
        </div>
      `,d(this,s,this.renderRoot.querySelector(".trigger")),d(this,i,this.renderRoot.querySelector(".panel")));const e=this.renderRoot.querySelector(".fallback-summary");e.textContent=this.summary,e.hidden=this.querySelector('[slot="summary"]')!==null,n(this,s).setAttribute("aria-expanded",this.open?"true":"false"),n(this,i).hidden=!this.open}}s=new WeakMap,i=new WeakMap,m=new WeakMap,a(c,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGJvcmRlcjogdmFyKC0tcm93YW4tYm9yZGVyLXdpZHRoKSBzb2xpZCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIpOwogIGJvcmRlci1yYWRpdXM6IHZhcigtLXJvd2FuLXJhZGl1cy1tZCk7CiAgZGlzcGxheTogYmxvY2s7CiAgb3ZlcmZsb3c6IGhpZGRlbjsKfQoKOmhvc3QoW2hpZGRlbl0pIHsKICBkaXNwbGF5OiBub25lOwp9CgoudHJpZ2dlciB7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1jb2xvci1zdXJmYWNlKTsKICBib3JkZXI6IG5vbmU7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZGlzcGxheTogZmxleDsKICBmb250LWZhbWlseTogdmFyKC0tcm93YW4tZm9udC1mYW1pbHkpOwogIGZvbnQtd2VpZ2h0OiA2MDA7CiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOwogIHBhZGRpbmc6IHZhcigtLXJvd2FuLXNwYWNlLTMpIHZhcigtLXJvd2FuLXNwYWNlLTQpOwogIHdpZHRoOiAxMDAlOwp9CgoucGFuZWwgewogIGJvcmRlci10b3A6IHZhcigtLXJvd2FuLWJvcmRlci13aWR0aCkgc29saWQgdmFyKC0tcm93YW4tY29sb3ItYm9yZGVyKTsKICBjb2xvcjogdmFyKC0tcm93YW4tY29sb3ItZmcpOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1yb3dhbi1mb250LWZhbWlseSk7CiAgcGFkZGluZzogdmFyKC0tcm93YW4tc3BhY2UtMykgdmFyKC0tcm93YW4tc3BhY2UtNCk7Cn0K",import.meta.url).href),a(c,"shadowRootOptions",{mode:"open",delegatesFocus:!0}),a(c,"observedAttributes",["open","summary"]),a(c,"upgradeProperties",["open","summary"]);v("rowan-accordion",c);const X={title:"Components/Accordion",tags:["autodocs"],argTypes:{open:{control:"boolean"},summary:{control:"text"},content:{control:"text"}},args:{open:!1,summary:"Release Notes",content:"Minor accessibility and performance updates."}},p={parameters:G({steps:["Click the header to toggle the section."],events:["rowan-change"]}),render:({open:t,summary:o,content:e})=>{const r=document.createElement("rowan-accordion");return r.summary=o,t&&r.setAttribute("open",""),r.textContent=e,r}};var g,b,y;p.parameters={...p.parameters,docs:{...(g=p.parameters)==null?void 0:g.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the header to toggle the section."],
    events: ["rowan-change"]
  }),
  render: ({
    open,
    summary,
    content
  }) => {
    const accordion = document.createElement("rowan-accordion");
    accordion.summary = summary;
    if (open) accordion.setAttribute("open", "");
    accordion.textContent = content;
    return accordion;
  }
}`,...(y=(b=p.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};const f=["Playground"];export{p as Playground,f as __namedExportsOrder,X as default};
