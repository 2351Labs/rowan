var w=Object.defineProperty;var u=e=>{throw TypeError(e)};var B=(e,t,o)=>t in e?w(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var r=(e,t,o)=>B(e,typeof t!="symbol"?t+"":t,o),g=(e,t,o)=>t.has(e)||u("Cannot "+o);var c=(e,t,o)=>(g(e,t,"read from private field"),o?o.call(e):t.get(e)),d=(e,t,o)=>t.has(e)?u("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),b=(e,t,o,s)=>(g(e,t,"write to private field"),s?s.call(e,o):t.set(e,o),o),h=(e,t,o)=>(g(e,t,"access private method"),o);import{B as k,d as y}from"./define-C1bbOtVV.js";import{e as v}from"./events-CaQanPdG.js";import{c as Y}from"./event-script-39NhYcVW.js";var n,a,p,Z;class i extends k{constructor(){super(...arguments);d(this,p);d(this,n,null);d(this,a,null)}connectedCallback(){super.connectedCallback(),this.listen(this,"click",o=>{const s=o.composedPath();(s.includes(c(this,n))||s.includes(c(this,a)))&&(this.open=!1,v(this,"rowan-change",{open:this.open}))})}get open(){return this.readBoolean("open")}set open(o){this.reflectBoolean("open",!!o)}get side(){return this.readString("side","start")}set side(o){const s=o==="end"?"end":"start";this.reflectString("side",s)}render(){c(this,n)||(this.renderRoot.innerHTML=`
        <div class="backdrop" part="backdrop" aria-hidden="true"></div>
        <aside class="panel" part="panel">
          <header class="header">
            <slot name="title"></slot>
            <button type="button" class="close">Close</button>
          </header>
          <div class="content"><slot></slot></div>
        </aside>
      `,b(this,n,this.renderRoot.querySelector(".backdrop")),b(this,a,this.renderRoot.querySelector(".close"))),h(this,p,Z).call(this),this.renderRoot.querySelector(".backdrop").hidden=!this.open,this.renderRoot.querySelector(".panel").hidden=!this.open}}n=new WeakMap,a=new WeakMap,p=new WeakSet,Z=function(){this.internals&&(!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="dialog"),!this.hasAttribute("aria-modal")&&"ariaModal"in this.internals&&(this.internals.ariaModal="true"))},r(i,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5iYWNrZHJvcCB7CiAgYmFja2dyb3VuZDogcmdiKDIyIDI4IDI2IC8gMC40NSk7CiAgaW5zZXQ6IDA7CiAgcG9zaXRpb246IGZpeGVkOwogIHotaW5kZXg6IDUwOwp9CgoucGFuZWwgewogIGJhY2tncm91bmQ6IHZhcigtLXJvd2FuLWNvbG9yLXN1cmZhY2UpOwogIGJvcmRlcjogdmFyKC0tcm93YW4tYm9yZGVyLXdpZHRoKSBzb2xpZCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIpOwogIGJveC1zaXppbmc6IGJvcmRlci1ib3g7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBkaXNwbGF5OiBmbGV4OwogIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47CiAgaGVpZ2h0OiAxMDB2aDsKICBtYXgtd2lkdGg6IG1pbig5MHZ3LCAyNnJlbSk7CiAgcGFkZGluZzogdmFyKC0tcm93YW4tc3BhY2UtNCk7CiAgcG9zaXRpb246IGZpeGVkOwogIHRvcDogMDsKICB3aWR0aDogMTAwJTsKICB6LWluZGV4OiA2MDsKfQoKOmhvc3QoW3NpZGU9ImVuZCJdKSAucGFuZWwgewogIHJpZ2h0OiAwOwp9Cgo6aG9zdCg6bm90KFtzaWRlPSJlbmQiXSkpIC5wYW5lbCB7CiAgbGVmdDogMDsKfQoKLmhlYWRlciB7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBkaXNwbGF5OiBmbGV4OwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBtYXJnaW4tYm90dG9tOiB2YXIoLS1yb3dhbi1zcGFjZS0zKTsKfQoKLmNsb3NlIHsKICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsKICBib3JkZXI6IHZhcigtLXJvd2FuLWJvcmRlci13aWR0aCkgc29saWQgdmFyKC0tcm93YW4tY29sb3ItYm9yZGVyKTsKICBib3JkZXItcmFkaXVzOiB2YXIoLS1yb3dhbi1yYWRpdXMtc20pOwogIGNvbG9yOiB2YXIoLS1yb3dhbi1jb2xvci1mZyk7CiAgY3Vyc29yOiBwb2ludGVyOwogIGZvbnQtZmFtaWx5OiBpbmhlcml0OwogIHBhZGRpbmc6IDAuM3JlbSAwLjU1cmVtOwp9CgouY29udGVudCB7CiAgb3ZlcmZsb3c6IGF1dG87Cn0K",import.meta.url).href),r(i,"useElementInternals",!0),r(i,"observedAttributes",["open","side"]),r(i,"upgradeProperties",["open","side"]);y("rowan-drawer",i);const A={title:"Components/Drawer",tags:["autodocs"],argTypes:{open:{control:"boolean"},side:{control:{type:"radio"},options:["start","end"]},content:{control:"text"}},args:{open:!0,side:"start",content:"Drawer content for settings or navigation."}},l={parameters:Y({steps:["Click backdrop or Close to dismiss."],events:["rowan-change"]}),render:({open:e,side:t,content:o})=>{const s=document.createElement("rowan-drawer");s.side=t,e&&s.setAttribute("open","");const m=document.createElement("strong");return m.slot="title",m.textContent="Navigation",s.append(m),s.append(o),s}};var I,C,G;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(G=(C=l.parameters)==null?void 0:C.docs)==null?void 0:G.source}}};const S=["Playground"];export{l as Playground,S as __namedExportsOrder,A as default};
