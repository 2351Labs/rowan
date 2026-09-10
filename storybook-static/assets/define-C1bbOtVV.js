var T=Object.defineProperty;var P=e=>{throw TypeError(e)};var q=(e,r,t)=>r in e?T(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t;var d=(e,r,t)=>q(e,typeof r!="symbol"?r+"":r,t),k=(e,r,t)=>r.has(e)||P("Cannot "+t);var n=(e,r,t)=>(k(e,r,"read from private field"),t?t.call(e):r.get(e)),s=(e,r,t)=>r.has(e)?P("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(e):r.set(e,t),i=(e,r,t,o)=>(k(e,r,"write to private field"),o?o.call(e,t):r.set(e,t),t),y=(e,r,t)=>(k(e,r,"access private method"),t);function L(e,r){return e.hasAttribute(r)}function F(e,r,t){if(t){e.setAttribute(r,"");return}e.removeAttribute(r)}function j(e,r,t=""){return e.getAttribute(r)??t}function M(e,r,t){if(t==null||t===""){e.removeAttribute(r);return}e.setAttribute(r,String(t))}function V(e,r,t=0){const o=e.getAttribute(r);if(o==null)return t;const a=Number(o);return Number.isFinite(a)?a:t}function D(e,r,t){if(t==null||!Number.isFinite(t)){e.removeAttribute(r);return}e.setAttribute(r,String(t))}const N=`
:root,
:host {
  --rowan-color-forest-900: #10261c;
  --rowan-color-forest-800: #153224;
  --rowan-color-forest-700: #1d432f;
  --rowan-color-forest-600: #24543c;
  --rowan-color-forest-500: #2f6a4d;
  --rowan-color-sand-50: #f8f7f2;
  --rowan-color-sand-100: #efede4;
  --rowan-color-ink-900: #1f2421;
  --rowan-color-ink-700: #424945;
  --rowan-color-danger-600: #b4392d;

  --rowan-space-1: 0.25rem;
  --rowan-space-2: 0.5rem;
  --rowan-space-3: 0.75rem;
  --rowan-space-4: 1rem;
  --rowan-space-5: 1.25rem;
  --rowan-space-6: 1.5rem;
  --rowan-space-8: 2rem;

  --rowan-radius-sm: 0.375rem;
  --rowan-radius-md: 0.5rem;
  --rowan-radius-lg: 0.625rem;

  --rowan-font-family: "Avenir Next", "Segoe UI", "Noto Sans", sans-serif;
  --rowan-font-size-sm: 0.875rem;
  --rowan-font-size-md: 1rem;
  --rowan-font-size-lg: 1.125rem;
  --rowan-line-height: 1.4;

  --rowan-border-width: 1px;

  --rowan-color-bg: var(--rowan-color-sand-50);
  --rowan-color-fg: var(--rowan-color-ink-900);
  --rowan-color-muted: var(--rowan-color-ink-700);
  --rowan-color-accent: var(--rowan-color-forest-700);
  --rowan-color-border: #d8dcd5;
  --rowan-color-danger: var(--rowan-color-danger-600);

  --rowan-button-bg: var(--rowan-color-accent);
  --rowan-button-fg: #ffffff;
  --rowan-button-border: transparent;
  --rowan-field-bg: #ffffff;
  --rowan-field-fg: var(--rowan-color-fg);
  --rowan-field-border: var(--rowan-color-border);
  --rowan-card-bg: #ffffff;
  --rowan-card-border: var(--rowan-color-border);
  --rowan-dialog-bg: #ffffff;
  --rowan-overlay-backdrop: rgb(16 28 22 / 48%);
  --rowan-focus-ring: 0 0 0 2px rgb(47 106 77 / 32%);
}
`,v=typeof CSSStyleSheet>"u"?null:new CSSStyleSheet;v&&v.replaceSync(N);const x=typeof CSSStyleSheet<"u"&&"adoptedStyleSheets"in Document.prototype;var A,f,b,C,S,h,w,g,c,p,l,U,E,z,O;class u extends HTMLElement{constructor(){super();s(this,l);s(this,A,null);s(this,f,new Set);s(this,b,!1);s(this,C,!1);s(this,S,[]);s(this,h,x?new CSSStyleSheet:null);s(this,w,null);s(this,g,null);s(this,c,null);s(this,p,null);const t={mode:"open",...this.constructor.shadowRootOptions};this.attachShadow(t),y(this,l,z).call(this),(this.constructor.formAssociated||this.constructor.useElementInternals)&&typeof this.attachInternals=="function"&&i(this,A,this.attachInternals()),y(this,l,U).call(this),y(this,l,E).call(this)}connectedCallback(){y(this,l,O).call(this),n(this,C)||this.requestRender()}disconnectedCallback(){for(const t of n(this,f))t();n(this,f).clear()}attributeChangedCallback(t,o,a){o!==a&&this.requestRender()}get internals(){return n(this,A)}get renderRoot(){return n(this,p)}requestRender(){n(this,b)||(i(this,b,!0),queueMicrotask(()=>{i(this,b,!1),this.isConnected&&(this.render(),i(this,C,!0))}))}render(){}setComponentStyles(t){const o=t??"";if(x&&n(this,h)){n(this,h).replaceSync(o);return}n(this,c)||(i(this,c,document.createElement("style")),this.shadowRoot.append(n(this,c))),n(this,c).textContent=o}addCleanup(t){return n(this,f).add(t),()=>n(this,f).delete(t)}listen(t,o,a,m){return t.addEventListener(o,a,m),this.addCleanup(()=>t.removeEventListener(o,a,m))}observe(t){return this.addCleanup(()=>t.disconnect())}reflectBoolean(t,o){F(this,t,o)}reflectString(t,o){M(this,t,o)}reflectNumber(t,o){D(this,t,o)}readBoolean(t){return L(this,t)}readString(t,o=""){return j(this,t,o)}readNumber(t,o=0){return V(this,t,o)}}A=new WeakMap,f=new WeakMap,b=new WeakMap,C=new WeakMap,S=new WeakMap,h=new WeakMap,w=new WeakMap,g=new WeakMap,c=new WeakMap,p=new WeakMap,l=new WeakSet,U=function(){const t=this.constructor.styleUrl,o=typeof t=="string"&&t.length>0,a=this.constructor.styles,m=Array.isArray(a)?a.join(`
`):a??"",I=!o&&m.length>0;if(x){const R=[];v&&R.push(v),I&&n(this,h)&&(n(this,h).replaceSync(m),R.push(n(this,h))),this.shadowRoot.adoptedStyleSheets=R}else i(this,g,document.createElement("style")),n(this,g).textContent=N,this.shadowRoot.append(n(this,g)),I&&(i(this,c,document.createElement("style")),n(this,c).textContent=m,this.shadowRoot.append(n(this,c)));o&&(i(this,w,document.createElement("link")),n(this,w).rel="stylesheet",n(this,w).href=t,this.shadowRoot.append(n(this,w)))},E=function(){i(this,p,document.createElement("div")),n(this,p).setAttribute("data-rowan-render-root",""),this.shadowRoot.append(n(this,p))},z=function(){const t=this.constructor.upgradeProperties??[];i(this,S,t.filter(o=>Object.prototype.hasOwnProperty.call(this,o)))},O=function(){for(const t of n(this,S)){const o=this[t];delete this[t],this[t]=o}i(this,S,[])},d(u,"shadowRootOptions",{mode:"open"}),d(u,"styles",""),d(u,"styleUrl",""),d(u,"observedAttributes",[]),d(u,"formAssociated",!1),d(u,"useElementInternals",!1),d(u,"upgradeProperties",[]);function Q(e,r){customElements.get(e)||customElements.define(e,r)}export{u as B,Q as d};
