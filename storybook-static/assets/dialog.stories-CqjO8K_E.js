var S=Object.defineProperty;var E=e=>{throw TypeError(e)};var R=(e,o,t)=>o in e?S(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t;var b=(e,o,t)=>R(e,typeof o!="symbol"?o+"":o,t),G=(e,o,t)=>o.has(e)||E("Cannot "+t);var i=(e,o,t)=>(G(e,o,"read from private field"),t?t.call(e):o.get(e)),u=(e,o,t)=>o.has(e)?E("Cannot add the same private member more than once"):o instanceof WeakSet?o.add(e):o.set(e,t),p=(e,o,t,s)=>(G(e,o,"write to private field"),s?s.call(e,t):o.set(e,t),t),r=(e,o,t)=>(G(e,o,"access private method"),t);import{B as z,d as D}from"./define-C9dOMgiB.js";import{e as N}from"./events-CaQanPdG.js";import"./button-oWFjesS9.js";import{c as H}from"./event-script-39NhYcVW.js";const v=["button:not([disabled])","[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])","[tabindex]:not([tabindex='-1'])"].join(",");var m,l,C,h,f,I,Z,n,X,w,A,Y,K,F,O,B,V;class g extends z{constructor(){super(...arguments);u(this,n);u(this,m,null);u(this,l,null);u(this,C,null);u(this,h,null);u(this,f,null);u(this,I,!1);u(this,Z,t=>{if(!this.open)return;const s=t.target;s instanceof Node&&(r(this,n,V).call(this,s)||r(this,n,O).call(this))})}get open(){return this.readBoolean("open")}set open(t){this.reflectBoolean("open",!!t)}show(){this.open=!0}hide(){this.open=!1}render(){i(this,l)||(this.renderRoot.innerHTML=`
        <div class="overlay" part="overlay" hidden>
          <div class="backdrop" part="backdrop"></div>
          <section class="panel" part="panel" tabindex="-1">
            <header class="header" part="header">
              <div class="title" part="title"><slot name="title"></slot></div>
              <button class="close" part="close" type="button" aria-label="Close dialog">×</button>
            </header>
            <div class="body" part="body"><slot></slot></div>
            <footer class="actions" part="actions"><slot name="actions"></slot></footer>
          </section>
        </div>
      `,p(this,m,this.renderRoot.querySelector(".overlay")),p(this,l,this.renderRoot.querySelector(".panel")),p(this,C,this.renderRoot.querySelector(".close")),this.listen(i(this,C),"click",()=>{r(this,n,w).call(this,"close-button")}),this.listen(i(this,m),"click",t=>{(t.target===i(this,m)||t.target===i(this,m).firstElementChild)&&r(this,n,w).call(this,"backdrop")}),this.listen(i(this,l),"keydown",t=>{if(t.key==="Escape"){t.preventDefault(),r(this,n,w).call(this,"escape");return}t.key==="Tab"&&r(this,n,F).call(this,t)})),r(this,n,X).call(this),r(this,n,A).call(this)}}m=new WeakMap,l=new WeakMap,C=new WeakMap,h=new WeakMap,f=new WeakMap,I=new WeakMap,Z=new WeakMap,n=new WeakSet,X=function(){this.internals&&(!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="dialog"),!this.hasAttribute("aria-modal")&&"ariaModal"in this.internals&&(this.internals.ariaModal="true"))},w=function(t){this.open&&(this.open=!1,N(this,"rowan-close",{reason:t}))},A=function(){if(this.open!==i(this,I)){if(p(this,I,this.open),this.open){r(this,n,Y).call(this);return}r(this,n,K).call(this)}},Y=function(){p(this,h,document.activeElement instanceof HTMLElement?document.activeElement:null),i(this,m).hidden=!1,p(this,f,this.listen(document,"focusin",i(this,Z),!0)),queueMicrotask(()=>{this.open&&r(this,n,O).call(this)})},K=function(){var t;i(this,m).hidden=!0,(t=i(this,f))==null||t.call(this),p(this,f,null),i(this,h)&&typeof i(this,h).focus=="function"&&i(this,h).focus(),p(this,h,null)},F=function(t){const s=r(this,n,B).call(this);if(s.length===0){t.preventDefault(),i(this,l).focus();return}const d=s[0],a=s[s.length-1],c=this.shadowRoot.activeElement||document.activeElement;if(t.shiftKey){(c===d||c===i(this,l))&&(t.preventDefault(),a.focus());return}c===a&&(t.preventDefault(),d.focus())},O=function(){(r(this,n,B).call(this)[0]??i(this,l)).focus()},B=function(){const t=new Set,s=[],d=a=>{a instanceof HTMLElement&&(t.has(a)||a.matches(v)&&(t.add(a),s.push(a)))};return i(this,l).querySelectorAll(v).forEach(a=>{d(a)}),i(this,l).querySelectorAll("slot").forEach(a=>{a.assignedElements({flatten:!0}).forEach(c=>{d(c),typeof c.querySelectorAll=="function"&&c.querySelectorAll(v).forEach(x=>{d(x)})})}),s},V=function(t){return!!(t instanceof HTMLElement&&this.contains(t)||this.shadowRoot&&this.shadowRoot.contains(t))},b(g,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGNvbnRlbnRzOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5vdmVybGF5IHsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGRpc3BsYXk6IGdyaWQ7CiAgaW5zZXQ6IDA7CiAganVzdGlmeS1pdGVtczogY2VudGVyOwogIHBhZGRpbmc6IHZhcigtLXJvd2FuLXNwYWNlLTYpOwogIHBvc2l0aW9uOiBmaXhlZDsKICB6LWluZGV4OiAxMDAwOwp9Cgoub3ZlcmxheVtoaWRkZW5dIHsKICBkaXNwbGF5OiBub25lOwp9CgouYmFja2Ryb3AgewogIGJhY2tncm91bmQ6IHZhcigtLXJvd2FuLW92ZXJsYXktYmFja2Ryb3AsIHJnYigxNiAyOCAyMiAvIDQ4JSkpOwogIGluc2V0OiAwOwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKfQoKLnBhbmVsIHsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1kaWFsb2ctYmcsICNmZmZmZmYpOwogIGJvcmRlcjogdmFyKC0tcm93YW4tYm9yZGVyLXdpZHRoKSBzb2xpZCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIpOwogIGJvcmRlci1yYWRpdXM6IHZhcigtLXJvd2FuLXJhZGl1cy1sZyk7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBkaXNwbGF5OiBncmlkOwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtNCk7CiAgbWF4LWlubGluZS1zaXplOiBtaW4oMzZyZW0sIDEwMCUpOwogIG1pbi1pbmxpbmUtc2l6ZTogbWluKDIycmVtLCAxMDAlKTsKICBwYWRkaW5nOiB2YXIoLS1yb3dhbi1zcGFjZS00KTsKICBwb3NpdGlvbjogcmVsYXRpdmU7CiAgd2lkdGg6IDEwMCU7Cn0KCi5oZWFkZXIgewogIGFsaWduLWl0ZW1zOiBzdGFydDsKICBkaXNwbGF5OiBmbGV4OwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtMyk7CiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOwp9CgoudGl0bGUgewogIGZvbnQtc2l6ZTogdmFyKC0tcm93YW4tZm9udC1zaXplLWxnKTsKICBmb250LXdlaWdodDogNjAwOwogIGxpbmUtaGVpZ2h0OiAxLjI7Cn0KCi5hY3Rpb25zIHsKICBkaXNwbGF5OiBmbGV4OwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtMik7CiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDsKfQoKLmNsb3NlIHsKICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsKICBib3JkZXI6IG5vbmU7CiAgYm9yZGVyLXJhZGl1czogdmFyKC0tcm93YW4tcmFkaXVzLXNtKTsKICBjb2xvcjogaW5oZXJpdDsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZm9udC1zaXplOiAxLjI1cmVtOwogIGxpbmUtaGVpZ2h0OiAxOwogIG1pbi1oZWlnaHQ6IDEuNzVyZW07CiAgbWluLXdpZHRoOiAxLjc1cmVtOwogIHBhZGRpbmc6IDA7Cn0KCi5jbG9zZTpmb2N1cy12aXNpYmxlLAoucGFuZWw6Zm9jdXMtdmlzaWJsZSB7CiAgYm94LXNoYWRvdzogdmFyKC0tcm93YW4tZm9jdXMtcmluZyk7CiAgb3V0bGluZTogbm9uZTsKfQo=",import.meta.url).href),b(g,"useElementInternals",!0),b(g,"shadowRootOptions",{mode:"open",delegatesFocus:!0}),b(g,"observedAttributes",["open"]),b(g,"upgradeProperties",["open"]);D("rowan-dialog",g);const Q={title:"Components/Dialog",tags:["autodocs"],argTypes:{open:{control:"boolean"}},args:{open:!1}},y={parameters:H({steps:["Click Open dialog.","Close using the Save action or press Escape.","Compare rowan-click and rowan-close entries in Event Trace."],events:["rowan-click","rowan-close"]}),render:({open:e})=>{const o=document.createElement("div"),t=document.createElement("rowan-button");t.textContent="Open dialog";const s=document.createElement("rowan-dialog");e&&s.setAttribute("open","");const d=document.createElement("span");d.slot="title",d.textContent="Confirm route";const a=document.createElement("p");a.textContent="Do you want to save this trail plan to your collection?";const c=document.createElement("rowan-button");return c.slot="actions",c.textContent="Save",s.append(d,a,c),t.addEventListener("rowan-click",()=>{s.open=!0}),c.addEventListener("rowan-click",()=>{s.open=!1}),o.append(t,s),o}};var W,k,L;y.parameters={...y.parameters,docs:{...(W=y.parameters)==null?void 0:W.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click Open dialog.", "Close using the Save action or press Escape.", "Compare rowan-click and rowan-close entries in Event Trace."],
    events: ["rowan-click", "rowan-close"]
  }),
  render: ({
    open
  }) => {
    const wrapper = document.createElement("div");
    const trigger = document.createElement("rowan-button");
    trigger.textContent = "Open dialog";
    const dialog = document.createElement("rowan-dialog");
    if (open) dialog.setAttribute("open", "");
    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "Confirm route";
    const body = document.createElement("p");
    body.textContent = "Do you want to save this trail plan to your collection?";
    const action = document.createElement("rowan-button");
    action.slot = "actions";
    action.textContent = "Save";
    dialog.append(title, body, action);
    trigger.addEventListener("rowan-click", () => {
      dialog.open = true;
    });
    action.addEventListener("rowan-click", () => {
      dialog.open = false;
    });
    wrapper.append(trigger, dialog);
    return wrapper;
  }
}`,...(L=(k=y.parameters)==null?void 0:k.docs)==null?void 0:L.source}}};const q=["Playground"];export{y as Playground,q as __namedExportsOrder,Q as default};
