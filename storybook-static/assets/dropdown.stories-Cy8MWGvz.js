var v=Object.defineProperty;var g=e=>{throw TypeError(e)};var C=(e,n,t)=>n in e?v(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var l=(e,n,t)=>C(e,typeof n!="symbol"?n+"":n,t),b=(e,n,t)=>n.has(e)||g("Cannot "+t);var a=(e,n,t)=>(b(e,n,"read from private field"),t?t.call(e):n.get(e)),d=(e,n,t)=>n.has(e)?g("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(e):n.set(e,t),m=(e,n,t,r)=>(b(e,n,"write to private field"),r?r.call(e,t):n.set(e,t),t);import{B as E,d as A}from"./define-BL-z8OAl.js";import{e as B}from"./events-CaQanPdG.js";import"./button-C1341NXc.js";import"./menu-Byi-Ef4Z.js";import"./menu-item-DplQuq25.js";import{c as G}from"./event-script-39NhYcVW.js";var o,s;class c extends E{constructor(){super(...arguments);d(this,o,null);d(this,s,null)}get open(){return this.readBoolean("open")}set open(t){this.reflectBoolean("open",!!t)}get label(){return this.readString("label","Options")}set label(t){this.reflectString("label",t)}render(){a(this,o)||(this.renderRoot.innerHTML=`
        <rowan-button class="trigger" part="trigger" variant="secondary" size="sm"></rowan-button>
        <section class="panel" part="panel"><slot></slot></section>
      `,m(this,o,this.renderRoot.querySelector("rowan-button")),m(this,s,this.renderRoot.querySelector(".panel")),this.listen(a(this,o),"rowan-click",()=>{this.open=!this.open,B(this,"rowan-change",{open:this.open})})),a(this,o).textContent=this.label,a(this,s).hidden=!this.open}}o=new WeakMap,s=new WeakMap,l(c,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KCjpob3N0KFtoaWRkZW5dKSB7CiAgZGlzcGxheTogbm9uZTsKfQoKLnBhbmVsIHsKICBsZWZ0OiAwOwogIG1pbi13aWR0aDogMTJyZW07CiAgcG9zaXRpb246IGFic29sdXRlOwogIHRvcDogY2FsYygxMDAlICsgMC4zcmVtKTsKICB6LWluZGV4OiAzMDsKfQo=",import.meta.url).href),l(c,"observedAttributes",["open","label"]),l(c,"upgradeProperties",["open","label"]);A("rowan-dropdown",c);const k={title:"Components/Dropdown",tags:["autodocs"],argTypes:{open:{control:"boolean"},label:{control:"text"}},args:{open:!1,label:"Actions"}},i={parameters:G({steps:["Click the trigger button to open and close."],events:["rowan-change","rowan-click"]}),render:({open:e,label:n})=>{const t=document.createElement("rowan-dropdown");t.label=n,e&&t.setAttribute("open","");const r=document.createElement("rowan-menu");for(const u of["Edit","Archive"]){const p=document.createElement("rowan-menu-item");p.value=u.toLowerCase(),p.textContent=u,r.append(p)}return t.append(r),t}};var h,w,f;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the trigger button to open and close."],
    events: ["rowan-change", "rowan-click"]
  }),
  render: ({
    open,
    label
  }) => {
    const dropdown = document.createElement("rowan-dropdown");
    dropdown.label = label;
    if (open) dropdown.setAttribute("open", "");
    const menu = document.createElement("rowan-menu");
    for (const value of ["Edit", "Archive"]) {
      const item = document.createElement("rowan-menu-item");
      item.value = value.toLowerCase();
      item.textContent = value;
      menu.append(item);
    }
    dropdown.append(menu);
    return dropdown;
  }
}`,...(f=(w=i.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};const O=["Playground"];export{i as Playground,O as __namedExportsOrder,k as default};
