var I=Object.defineProperty;var u=e=>{throw TypeError(e)};var W=(e,a,t)=>a in e?I(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t;var i=(e,a,t)=>W(e,typeof a!="symbol"?a+"":a,t),p=(e,a,t)=>a.has(e)||u("Cannot "+t);var b=(e,a,t)=>(p(e,a,"read from private field"),t?t.call(e):a.get(e)),m=(e,a,t)=>a.has(e)?u("Cannot add the same private member more than once"):a instanceof WeakSet?a.add(e):a.set(e,t),h=(e,a,t,n)=>(p(e,a,"write to private field"),n?n.call(e,t):a.set(e,t),t),l=(e,a,t)=>(p(e,a,"access private method"),t);import{B as x,d as P}from"./define-C1bbOtVV.js";import{e as k}from"./events-CaQanPdG.js";import"./button-Cnv2b6fF.js";import{c as X}from"./event-script-39NhYcVW.js";var s,r,d;class g extends x{constructor(){super(...arguments);m(this,r);m(this,s,null)}connectedCallback(){super.connectedCallback(),this.listen(this,"click",t=>{const n=t.composedPath().find(o=>o instanceof HTMLElement&&o.matches("button[data-action]"));n&&(n.dataset.action==="prev"&&l(this,r,d).call(this,this.page-1),n.dataset.action==="next"&&l(this,r,d).call(this,this.page+1))})}get page(){return this.readNumber("page",1)}set page(t){this.reflectNumber("page",t)}get totalPages(){return this.readNumber("total-pages",1)}set totalPages(t){this.reflectNumber("total-pages",t)}render(){b(this,s)||(this.renderRoot.innerHTML=`
        <nav class="container" part="container" aria-label="Pagination">
          <button data-action="prev" type="button">Previous</button>
          <span class="status"></span>
          <button data-action="next" type="button">Next</button>
        </nav>
      `,h(this,s,this.renderRoot.querySelector(".container")));const t=Math.max(1,this.page||1),n=Math.max(1,this.totalPages||1),o=this.renderRoot.querySelector(".status");o.textContent=`Page ${Math.min(t,n)} of ${n}`;const Z=this.renderRoot.querySelector('button[data-action="prev"]'),G=this.renderRoot.querySelector('button[data-action="next"]');Z.disabled=t<=1,G.disabled=t>=n}}s=new WeakMap,r=new WeakSet,d=function(t){const n=Math.max(1,this.totalPages||1),o=Math.max(1,Math.min(n,Number(t)||1));o!==this.page&&(this.page=o,k(this,"rowan-page-change",{index:o,size:null}))},i(g,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5jb250YWluZXIgewogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBkaXNwbGF5OiBpbmxpbmUtZmxleDsKICBmb250LWZhbWlseTogdmFyKC0tcm93YW4tZm9udC1mYW1pbHkpOwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtMyk7Cn0KCmJ1dHRvbiB7CiAgYmFja2dyb3VuZDogdmFyKC0tcm93YW4tY29sb3Itc3VyZmFjZSk7CiAgYm9yZGVyOiB2YXIoLS1yb3dhbi1ib3JkZXItd2lkdGgpIHNvbGlkIHZhcigtLXJvd2FuLWNvbG9yLWJvcmRlcik7CiAgYm9yZGVyLXJhZGl1czogdmFyKC0tcm93YW4tcmFkaXVzLXNtKTsKICBjb2xvcjogaW5oZXJpdDsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7CiAgcGFkZGluZzogMC4zNXJlbSAwLjY1cmVtOwp9CgpidXR0b246ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC42Owp9Cg==",import.meta.url).href),i(g,"observedAttributes",["page","total-pages"]),i(g,"upgradeProperties",["page","totalPages"]);P("rowan-pagination",g);const B={title:"Components/Pagination",tags:["autodocs"],argTypes:{page:{control:{type:"number",min:1}},totalPages:{control:{type:"number",min:1}}},args:{page:2,totalPages:5}},c={parameters:X({steps:["Click Previous or Next to change page."],events:["rowan-page-change"]}),render:({page:e,totalPages:a})=>{const t=document.createElement("rowan-pagination");return t.page=e,t.totalPages=a,t}};var C,y,v;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click Previous or Next to change page."],
    events: ["rowan-page-change"]
  }),
  render: ({
    page,
    totalPages
  }) => {
    const pagination = document.createElement("rowan-pagination");
    pagination.page = page;
    pagination.totalPages = totalPages;
    return pagination;
  }
}`,...(v=(y=c.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const F=["Playground"];export{c as Playground,F as __namedExportsOrder,B as default};
