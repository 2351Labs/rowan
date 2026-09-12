var B=Object.defineProperty;var h=e=>{throw TypeError(e)};var k=(e,t,s)=>t in e?B(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var r=(e,t,s)=>k(e,typeof t!="symbol"?t+"":t,s),u=(e,t,s)=>t.has(e)||h("Cannot "+s);var i=(e,t,s)=>(u(e,t,"read from private field"),s?s.call(e):t.get(e)),a=(e,t,s)=>t.has(e)?h("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),p=(e,t,s,n)=>(u(e,t,"write to private field"),n?n.call(e,s):t.set(e,s),s),C=(e,t,s)=>(u(e,t,"access private method"),s);import{B as y,d as v}from"./define-DNCuZUBR.js";import{e as Y}from"./events-CaQanPdG.js";import{c as X}from"./event-script-39NhYcVW.js";var o,d,l,g,w;class c extends y{constructor(){super(...arguments);a(this,g);a(this,o,null);a(this,d,null);a(this,l,null)}connectedCallback(){super.connectedCallback(),!i(this,l)&&p(this,l,this.listen(this,"click",s=>{const n=s.composedPath();(n.includes(i(this,o))||n.includes(i(this,d)))&&(this.open=!1,Y(this,"rowan-change",{open:this.open}))}))}get open(){return this.readBoolean("open")}set open(s){this.reflectBoolean("open",!!s)}get side(){return this.readString("side","start")}set side(s){const n=s==="end"?"end":"start";this.reflectString("side",n)}render(){i(this,o)||(this.renderRoot.innerHTML=`
        <div class="backdrop" part="backdrop" aria-hidden="true"></div>
        <aside class="panel" part="panel">
          <header class="header">
            <slot name="title"></slot>
            <button type="button" class="close">Close</button>
          </header>
          <div class="content"><slot></slot></div>
        </aside>
      `,p(this,o,this.renderRoot.querySelector(".backdrop")),p(this,d,this.renderRoot.querySelector(".close"))),C(this,g,w).call(this),this.renderRoot.querySelector(".backdrop").hidden=!this.open,this.renderRoot.querySelector(".panel").hidden=!this.open}}o=new WeakMap,d=new WeakMap,l=new WeakMap,g=new WeakSet,w=function(){this.internals&&(!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="dialog"),!this.hasAttribute("aria-modal")&&"ariaModal"in this.internals&&(this.internals.ariaModal="true"))},r(c,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5iYWNrZHJvcCB7CiAgYmFja2dyb3VuZDogcmdiKDIyIDI4IDI2IC8gMC40NSk7CiAgaW5zZXQ6IDA7CiAgcG9zaXRpb246IGZpeGVkOwogIHotaW5kZXg6IDUwOwp9CgoucGFuZWwgewogIGJhY2tncm91bmQ6IHZhcigtLXJvd2FuLWNvbG9yLXN1cmZhY2UpOwogIGJvcmRlcjogdmFyKC0tcm93YW4tYm9yZGVyLXdpZHRoKSBzb2xpZCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIpOwogIGJveC1zaXppbmc6IGJvcmRlci1ib3g7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBkaXNwbGF5OiBmbGV4OwogIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47CiAgaGVpZ2h0OiAxMDB2aDsKICBtYXgtd2lkdGg6IG1pbig5MHZ3LCAyNnJlbSk7CiAgcGFkZGluZzogdmFyKC0tcm93YW4tc3BhY2UtNCk7CiAgcG9zaXRpb246IGZpeGVkOwogIHRvcDogMDsKICB3aWR0aDogMTAwJTsKICB6LWluZGV4OiA2MDsKfQoKOmhvc3QoW3NpZGU9ImVuZCJdKSAucGFuZWwgewogIHJpZ2h0OiAwOwp9Cgo6aG9zdCg6bm90KFtzaWRlPSJlbmQiXSkpIC5wYW5lbCB7CiAgbGVmdDogMDsKfQoKLmhlYWRlciB7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBkaXNwbGF5OiBmbGV4OwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBtYXJnaW4tYm90dG9tOiB2YXIoLS1yb3dhbi1zcGFjZS0zKTsKfQoKLmNsb3NlIHsKICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsKICBib3JkZXI6IHZhcigtLXJvd2FuLWJvcmRlci13aWR0aCkgc29saWQgdmFyKC0tcm93YW4tY29sb3ItYm9yZGVyKTsKICBib3JkZXItcmFkaXVzOiB2YXIoLS1yb3dhbi1yYWRpdXMtc20pOwogIGNvbG9yOiB2YXIoLS1yb3dhbi1jb2xvci1mZyk7CiAgY3Vyc29yOiBwb2ludGVyOwogIGZvbnQtZmFtaWx5OiBpbmhlcml0OwogIHBhZGRpbmc6IDAuM3JlbSAwLjU1cmVtOwp9CgouY29udGVudCB7CiAgb3ZlcmZsb3c6IGF1dG87Cn0K",import.meta.url).href),r(c,"useElementInternals",!0),r(c,"observedAttributes",["open","side"]),r(c,"upgradeProperties",["open","side"]);v("rowan-drawer",c);const f={title:"Components/Drawer",tags:["autodocs"],argTypes:{open:{control:"boolean"},side:{control:{type:"radio"},options:["start","end"]},content:{control:"text"}},args:{open:!0,side:"start",content:"Drawer content for settings or navigation."}},m={parameters:X({steps:["Click backdrop or Close to dismiss."],events:["rowan-change"]}),render:({open:e,side:t,content:s})=>{const n=document.createElement("rowan-drawer");n.side=t,e&&n.setAttribute("open","");const b=document.createElement("strong");return b.slot="title",b.textContent="Navigation",n.append(b),n.append(s),n}};var I,G,Z;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click backdrop or Close to dismiss."],
    events: ["rowan-change"]
  }),
  render: ({
    open,
    side,
    content
  }) => {
    const drawer = document.createElement("rowan-drawer");
    drawer.side = side;
    if (open) drawer.setAttribute("open", "");
    const title = document.createElement("strong");
    title.slot = "title";
    title.textContent = "Navigation";
    drawer.append(title);
    drawer.append(content);
    return drawer;
  }
}`,...(Z=(G=m.parameters)==null?void 0:G.docs)==null?void 0:Z.source}}};const S=["Playground"];export{m as Playground,S as __namedExportsOrder,f as default};
