var y=Object.defineProperty;var p=t=>{throw TypeError(t)};var Z=(t,o,e)=>o in t?y(t,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[o]=e;var n=(t,o,e)=>Z(t,typeof o!="symbol"?o+"":o,e),u=(t,o,e)=>o.has(t)||p("Cannot "+e);var a=(t,o,e)=>(u(t,o,"read from private field"),e?e.call(t):o.get(t)),l=(t,o,e)=>o.has(t)?p("Cannot add the same private member more than once"):o instanceof WeakSet?o.add(t):o.set(t,e),d=(t,o,e,s)=>(u(t,o,"write to private field"),s?s.call(t,e):o.set(t,e),e);import{B as C,d as I}from"./define-C1bbOtVV.js";import{e as W}from"./events-CaQanPdG.js";import{c as v}from"./event-script-39NhYcVW.js";var r,i;class c extends C{constructor(){super(...arguments);l(this,r,null);l(this,i,null)}connectedCallback(){super.connectedCallback(),this.listen(this,"click",e=>{e.composedPath().includes(a(this,r))&&(this.open=!this.open,W(this,"rowan-change",{open:this.open}))})}get open(){return this.readBoolean("open")}set open(e){this.reflectBoolean("open",!!e)}get summary(){return this.readString("summary","Details")}set summary(e){this.reflectString("summary",e)}render(){a(this,r)||(this.renderRoot.innerHTML=`
        <button class="trigger" part="trigger" type="button" aria-expanded="false">
          <slot name="summary"></slot>
          <span class="fallback-summary"></span>
        </button>
        <div class="panel" part="panel">
          <slot></slot>
        </div>
      `,d(this,r,this.renderRoot.querySelector(".trigger")),d(this,i,this.renderRoot.querySelector(".panel")));const e=this.renderRoot.querySelector(".fallback-summary");e.textContent=this.summary,e.hidden=this.querySelector('[slot="summary"]')!==null,a(this,r).setAttribute("aria-expanded",this.open?"true":"false"),a(this,i).hidden=!this.open}}r=new WeakMap,i=new WeakMap,n(c,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGJvcmRlcjogdmFyKC0tcm93YW4tYm9yZGVyLXdpZHRoKSBzb2xpZCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIpOwogIGJvcmRlci1yYWRpdXM6IHZhcigtLXJvd2FuLXJhZGl1cy1tZCk7CiAgZGlzcGxheTogYmxvY2s7CiAgb3ZlcmZsb3c6IGhpZGRlbjsKfQoKOmhvc3QoW2hpZGRlbl0pIHsKICBkaXNwbGF5OiBub25lOwp9CgoudHJpZ2dlciB7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1jb2xvci1zdXJmYWNlKTsKICBib3JkZXI6IG5vbmU7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZGlzcGxheTogZmxleDsKICBmb250LWZhbWlseTogdmFyKC0tcm93YW4tZm9udC1mYW1pbHkpOwogIGZvbnQtd2VpZ2h0OiA2MDA7CiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOwogIHBhZGRpbmc6IHZhcigtLXJvd2FuLXNwYWNlLTMpIHZhcigtLXJvd2FuLXNwYWNlLTQpOwogIHdpZHRoOiAxMDAlOwp9CgoucGFuZWwgewogIGJvcmRlci10b3A6IHZhcigtLXJvd2FuLWJvcmRlci13aWR0aCkgc29saWQgdmFyKC0tcm93YW4tY29sb3ItYm9yZGVyKTsKICBjb2xvcjogdmFyKC0tcm93YW4tY29sb3ItZmcpOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1yb3dhbi1mb250LWZhbWlseSk7CiAgcGFkZGluZzogdmFyKC0tcm93YW4tc3BhY2UtMykgdmFyKC0tcm93YW4tc3BhY2UtNCk7Cn0K",import.meta.url).href),n(c,"shadowRootOptions",{mode:"open",delegatesFocus:!0}),n(c,"observedAttributes",["open","summary"]),n(c,"upgradeProperties",["open","summary"]);I("rowan-accordion",c);const X={title:"Components/Accordion",tags:["autodocs"],argTypes:{open:{control:"boolean"},summary:{control:"text"},content:{control:"text"}},args:{open:!1,summary:"Release Notes",content:"Minor accessibility and performance updates."}},m={parameters:v({steps:["Click the header to toggle the section."],events:["rowan-change"]}),render:({open:t,summary:o,content:e})=>{const s=document.createElement("rowan-accordion");return s.summary=o,t&&s.setAttribute("open",""),s.textContent=e,s}};var h,g,b;m.parameters={...m.parameters,docs:{...(h=m.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(b=(g=m.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};const L=["Playground"];export{m as Playground,L as __namedExportsOrder,X as default};
