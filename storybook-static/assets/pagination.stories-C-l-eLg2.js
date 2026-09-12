var W=Object.defineProperty;var C=e=>{throw TypeError(e)};var x=(e,a,t)=>a in e?W(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t;var c=(e,a,t)=>x(e,typeof a!="symbol"?a+"":a,t),l=(e,a,t)=>a.has(e)||C("Cannot "+t);var d=(e,a,t)=>(l(e,a,"read from private field"),t?t.call(e):a.get(e)),g=(e,a,t)=>a.has(e)?C("Cannot add the same private member more than once"):a instanceof WeakSet?a.add(e):a.set(e,t),u=(e,a,t,n)=>(l(e,a,"write to private field"),n?n.call(e,t):a.set(e,t),t),b=(e,a,t)=>(l(e,a,"access private method"),t);import{B as P,d as k}from"./define-DNCuZUBR.js";import{e as X}from"./events-CaQanPdG.js";import"./button-CtQSQLQ9.js";import{c as Y}from"./event-script-39NhYcVW.js";var o,r,i,h;class m extends P{constructor(){super(...arguments);g(this,i);g(this,o,null);g(this,r,null)}connectedCallback(){super.connectedCallback(),!d(this,r)&&u(this,r,this.listen(this,"click",t=>{const n=t.composedPath().find(s=>s instanceof HTMLElement&&s.matches("button[data-action]"));n&&(n.dataset.action==="prev"&&b(this,i,h).call(this,this.page-1),n.dataset.action==="next"&&b(this,i,h).call(this,this.page+1))}))}get page(){return this.readNumber("page",1)}set page(t){this.reflectNumber("page",t)}get totalPages(){return this.readNumber("total-pages",1)}set totalPages(t){this.reflectNumber("total-pages",t)}render(){d(this,o)||(this.renderRoot.innerHTML=`
        <nav class="container" part="container" aria-label="Pagination">
          <button data-action="prev" type="button">Previous</button>
          <span class="status"></span>
          <button data-action="next" type="button">Next</button>
        </nav>
      `,u(this,o,this.renderRoot.querySelector(".container")));const t=Math.max(1,this.page||1),n=Math.max(1,this.totalPages||1),s=this.renderRoot.querySelector(".status");s.textContent=`Page ${Math.min(t,n)} of ${n}`;const G=this.renderRoot.querySelector('button[data-action="prev"]'),I=this.renderRoot.querySelector('button[data-action="next"]');G.disabled=t<=1,I.disabled=t>=n}}o=new WeakMap,r=new WeakMap,i=new WeakSet,h=function(t){const n=Math.max(1,this.totalPages||1),s=Math.max(1,Math.min(n,Number(t)||1));s!==this.page&&(this.page=s,X(this,"rowan-page-change",{index:s,size:null}))},c(m,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5jb250YWluZXIgewogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBkaXNwbGF5OiBpbmxpbmUtZmxleDsKICBmb250LWZhbWlseTogdmFyKC0tcm93YW4tZm9udC1mYW1pbHkpOwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtMyk7Cn0KCmJ1dHRvbiB7CiAgYmFja2dyb3VuZDogdmFyKC0tcm93YW4tY29sb3Itc3VyZmFjZSk7CiAgYm9yZGVyOiB2YXIoLS1yb3dhbi1ib3JkZXItd2lkdGgpIHNvbGlkIHZhcigtLXJvd2FuLWNvbG9yLWJvcmRlcik7CiAgYm9yZGVyLXJhZGl1czogdmFyKC0tcm93YW4tcmFkaXVzLXNtKTsKICBjb2xvcjogaW5oZXJpdDsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7CiAgcGFkZGluZzogMC4zNXJlbSAwLjY1cmVtOwp9CgpidXR0b246ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC42Owp9Cg==",import.meta.url).href),c(m,"observedAttributes",["page","total-pages"]),c(m,"upgradeProperties",["page","totalPages"]);k("rowan-pagination",m);const F={title:"Components/Pagination",tags:["autodocs"],argTypes:{page:{control:{type:"number",min:1}},totalPages:{control:{type:"number",min:1}}},args:{page:2,totalPages:5}},p={parameters:Y({steps:["Click Previous or Next to change page."],events:["rowan-page-change"]}),render:({page:e,totalPages:a})=>{const t=document.createElement("rowan-pagination");return t.page=e,t.totalPages=a,t}};var v,y,Z;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(Z=(y=p.parameters)==null?void 0:y.docs)==null?void 0:Z.source}}};const K=["Playground"];export{p as Playground,K as __namedExportsOrder,F as default};
