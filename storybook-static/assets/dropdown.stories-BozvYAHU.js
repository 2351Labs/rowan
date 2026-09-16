var B=Object.defineProperty;var v=t=>{throw TypeError(t)};var G=(t,n,e)=>n in t?B(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var h=(t,n,e)=>G(t,typeof n!="symbol"?n+"":n,e),C=(t,n,e)=>n.has(t)||v("Cannot "+e);var o=(t,n,e)=>(C(t,n,"read from private field"),e?e.call(t):n.get(t)),d=(t,n,e)=>n.has(t)?v("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(t):n.set(t,e),c=(t,n,e,l)=>(C(t,n,"write to private field"),l?l.call(t,e):n.set(t,e),e),u=(t,n,e)=>(C(t,n,"access private method"),e);import{B as K,d as S}from"./define-BZx74wjy.js";import{e as O}from"./events-CaQanPdG.js";import{k as R}from"./keys-C4RmHry8.js";import"./button-mmaSNUNF.js";import"./menu-2BQlsHjo.js";import"./menu-item-CenCHerl.js";import{c as P}from"./event-script-39NhYcVW.js";import"./form-BsCuqVMT.js";let A=0;var r,i,p,a,s,I,x,g;class w extends K{constructor(){super(...arguments);d(this,s);d(this,r,null);d(this,i,null);d(this,p,"");d(this,a,null)}connectedCallback(){super.connectedCallback(),o(this,p)||(A+=1,c(this,p,`rowan-dropdown-${A}-panel`))}disconnectedCallback(){var e;(e=o(this,a))==null||e.call(this),c(this,a,null),super.disconnectedCallback()}get open(){return this.readBoolean("open")}set open(e){this.reflectBoolean("open",!!e)}get label(){return this.readString("label","Options")}set label(e){this.reflectString("label",e)}render(){o(this,r)||(this.renderRoot.innerHTML=`
        <rowan-button class="trigger" part="trigger" variant="secondary" size="sm"></rowan-button>
        <section class="panel" part="panel"><slot></slot></section>
      `,c(this,r,this.renderRoot.querySelector("rowan-button")),c(this,i,this.renderRoot.querySelector(".panel")),this.listen(o(this,r),"rowan-click",()=>u(this,s,g).call(this,!this.open)),this.listen(this,"keydown",e=>u(this,s,x).call(this,e))),o(this,r).textContent=this.label,o(this,r).setAttribute("aria-controls",o(this,p)),o(this,r).setAttribute("aria-expanded",this.open?"true":"false"),o(this,r).setAttribute("aria-haspopup","menu"),o(this,i).id=o(this,p),o(this,i).hidden=!this.open,o(this,i).setAttribute("aria-hidden",this.open?"false":"true"),u(this,s,I).call(this)}}r=new WeakMap,i=new WeakMap,p=new WeakMap,a=new WeakMap,s=new WeakSet,I=function(){var e;if(!this.open){(e=o(this,a))==null||e.call(this),c(this,a,null);return}o(this,a)||c(this,a,this.listen(document,"pointerdown",l=>{const m=l.composedPath();m.includes(this)||m.includes(o(this,i))||u(this,s,g).call(this,!1)}))},x=function(e){e.key!==R.ESCAPE||!this.open||(e.preventDefault(),u(this,s,g).call(this,!1),o(this,r).focus({preventScroll:!0}))},g=function(e){this.open!==e&&(this.open=e,O(this,"rowan-change",{open:e}))},h(w,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KCjpob3N0KFtoaWRkZW5dKSB7CiAgZGlzcGxheTogbm9uZTsKfQoKLnBhbmVsIHsKICBsZWZ0OiAwOwogIG1pbi13aWR0aDogMTJyZW07CiAgcG9zaXRpb246IGFic29sdXRlOwogIHRvcDogY2FsYygxMDAlICsgMC4zcmVtKTsKICB6LWluZGV4OiAzMDsKfQo=",import.meta.url).href),h(w,"observedAttributes",["open","label"]),h(w,"upgradeProperties",["open","label"]);S("rowan-dropdown",w);const V={title:"Components/Overlays & Menus/Dropdown",tags:["autodocs"],argTypes:{open:{control:"boolean"},label:{control:"text"}},args:{open:!1,label:"Actions"}},b={parameters:P({steps:["Click the trigger button to open and close."],events:["rowan-change","rowan-click"]}),render:({open:t,label:n})=>{const e=document.createElement("rowan-dropdown");e.label=n,t&&e.setAttribute("open","");const l=document.createElement("rowan-menu");for(const m of["Edit","Archive"]){const f=document.createElement("rowan-menu-item");f.value=m.toLowerCase(),f.textContent=m,l.append(f)}return e.append(l),e}};var k,y,E;b.parameters={...b.parameters,docs:{...(k=b.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(E=(y=b.parameters)==null?void 0:y.docs)==null?void 0:E.source}}};const X=["Playground"];export{b as Playground,X as __namedExportsOrder,V as default};
