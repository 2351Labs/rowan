var Y=Object.defineProperty;var C=t=>{throw TypeError(t)};var D=(t,i,e)=>i in t?Y(t,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[i]=e;var x=(t,i,e)=>D(t,typeof i!="symbol"?i+"":i,e),v=(t,i,e)=>i.has(t)||C("Cannot "+e);var n=(t,i,e)=>(v(t,i,"read from private field"),e?e.call(t):i.get(t)),f=(t,i,e)=>i.has(t)?C("Cannot add the same private member more than once"):i instanceof WeakSet?i.add(t):i.set(t,e),m=(t,i,e,s)=>(v(t,i,"write to private field"),s?s.call(t,e):i.set(t,e),e),u=(t,i,e)=>(v(t,i,"access private method"),e);import{B as T,d as P}from"./define-C1bbOtVV.js";import{e as F}from"./events-CaQanPdG.js";import"./dropzone-CtjHHowf.js";import"./file-item-_o_Z7P7X.js";import{c as U}from"./event-script-39NhYcVW.js";const j=new Set(["queued","uploading","success","failed"]);let G=0;function H(t){const i=String(t??"").trim().toLowerCase();return j.has(i)?i:"queued"}function V(t){const i=Number(t);return Number.isFinite(i)?Math.min(100,Math.max(0,Math.round(i))):0}function E(t){const i=Number(t);return!Number.isFinite(i)||i<=0?0:Math.floor(i)}function I(t){return{...t}}function _(t){return G+=1,{id:`file-${G}`,name:t.name,size:t.size,type:t.type,status:"queued",progress:0,file:t}}function J(t){const i=t&&typeof t=="object"?t:{},s=String(i.id??"").trim()||`file-${++G}`,a=String(i.name??i.filename??"").trim()||"Untitled file",r=Number(i.size??i.filesize??0),d=Number.isFinite(r)&&r>=0?Math.round(r):0;return{id:s,name:a,size:d,type:String(i.type??""),status:H(i.status),progress:V(i.progress),file:i.file instanceof File?i.file:null}}var c,p,b,l,o,M,X,z,k,K,O,W;class w extends T{constructor(){super(...arguments);f(this,o);f(this,c,null);f(this,p,null);f(this,b,null);f(this,l,[])}get label(){return this.readString("label","")}set label(e){const s=String(e??"").trim();this.reflectString("label",s||null)}get accept(){return this.readString("accept","").trim()}set accept(e){const s=String(e??"").trim();this.reflectString("accept",s||null)}get multiple(){return this.readBoolean("multiple")}set multiple(e){this.reflectBoolean("multiple",!!e)}get disabled(){return this.readBoolean("disabled")}set disabled(e){this.reflectBoolean("disabled",!!e)}get maxFiles(){return E(this.readNumber("max-files",0))}set maxFiles(e){const s=E(e);this.reflectNumber("max-files",s||null)}get files(){return n(this,l).map(e=>I(e))}set files(e){const s=Array.isArray(e)?e:[];m(this,l,s.map(a=>J(a))),this.requestRender()}render(){n(this,c)||(this.renderRoot.innerHTML=`
        <section class="upload" part="upload">
          <rowan-dropzone part="dropzone"></rowan-dropzone>
          <ul class="file-list" part="file-list"></ul>
          <p class="empty" part="empty"></p>
        </section>
      `,m(this,c,this.renderRoot.querySelector("rowan-dropzone")),m(this,p,this.renderRoot.querySelector(".file-list")),m(this,b,this.renderRoot.querySelector(".empty")),this.listen(n(this,c),"rowan-files-add",e=>{var a,r;if(e.stopPropagation(),this.disabled)return;const s=((a=e.detail)==null?void 0:a.source)==="drop"?"drop":"picker";u(this,o,X).call(this,(r=e.detail)==null?void 0:r.files,s)}),this.listen(n(this,p),"rowan-remove",e=>{e.stopPropagation(),u(this,o,k).call(this,e)}),this.listen(n(this,p),"rowan-retry",e=>{e.stopPropagation(),u(this,o,K).call(this,e)}),this.listen(n(this,p),"rowan-cancel",e=>{e.stopPropagation(),u(this,o,O).call(this,e)})),n(this,c).label=this.label||"Drop files to upload",n(this,c).description="or click to browse from your device",n(this,c).accept=this.accept,n(this,c).multiple=this.multiple,n(this,c).disabled=this.disabled,u(this,o,M).call(this),u(this,o,W).call(this)}}c=new WeakMap,p=new WeakMap,b=new WeakMap,l=new WeakMap,o=new WeakSet,M=function(){n(this,p).textContent="";for(const s of n(this,l)){const a=document.createElement("li");a.className="row";const r=document.createElement("rowan-file-item");r.setAttribute("data-file-id",s.id),r.fileId=s.id,r.filename=s.name,r.filesize=s.size,r.status=s.status,r.progress=s.progress,r.disabled=this.disabled,a.append(r),n(this,p).append(a)}const e=n(this,l).length>0;n(this,b).hidden=e,n(this,b).textContent=e?"":"No files selected."},X=function(e,s){const a=Array.isArray(e)?e.filter(g=>g instanceof File):[];if(a.length===0)return;const r=this.multiple?a:a.slice(0,1),d=this.maxFiles,h=d>0?Math.max(0,d-n(this,l).length):Number.POSITIVE_INFINITY,A=Number.isFinite(h)?r.slice(0,h):r;if(A.length===0)return;const N=A.map(g=>_(g));m(this,l,[...n(this,l),...N]),this.requestRender(),F(this,"rowan-files-add",{files:N.map(g=>I(g)),source:s,total:n(this,l).length})},z=function(e){var r;const s=String(((r=e.detail)==null?void 0:r.fileId)??"").trim();if(s)return s;const a=e.target;if(a instanceof HTMLElement){const d=String(a.getAttribute("data-file-id")??"").trim();if(d)return d}return""},k=function(e){const s=u(this,o,z).call(this,e);if(!s)return;const a=n(this,l).findIndex(d=>d.id===s);if(a===-1)return;const[r]=n(this,l).splice(a,1);m(this,l,[...n(this,l)]),this.requestRender(),F(this,"rowan-file-remove",{file:I(r),files:this.files})},K=function(e){const s=u(this,o,z).call(this,e);if(!s)return;const a=n(this,l).findIndex(h=>h.id===s);if(a===-1)return;const r=n(this,l)[a];if(r.status!=="failed")return;const d={...r,status:"queued",progress:0};n(this,l)[a]=d,m(this,l,[...n(this,l)]),this.requestRender(),F(this,"rowan-file-retry",{file:I(d),files:this.files})},O=function(e){const s=u(this,o,z).call(this,e);if(!s)return;const a=n(this,l).findIndex(h=>h.id===s);if(a===-1)return;const r=n(this,l)[a];if(r.status!=="uploading")return;const d={...r,status:"failed"};n(this,l)[a]=d,m(this,l,[...n(this,l)]),this.requestRender(),F(this,"rowan-file-cancel",{file:I(d),files:this.files})},W=function(){if(this.internals){if(!this.hasAttribute("role")&&"role"in this.internals&&(this.internals.role="group"),!this.hasAttribute("aria-label")&&"ariaLabel"in this.internals){const e=this.label.trim();this.internals.ariaLabel=e||"File upload"}!this.hasAttribute("aria-disabled")&&"ariaDisabled"in this.internals&&(this.internals.ariaDisabled=this.disabled?"true":"false")}},x(w,"useElementInternals",!0),x(w,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi51cGxvYWQgewogIGRpc3BsYXk6IGdyaWQ7CiAgZ2FwOiB2YXIoLS1yb3dhbi1zcGFjZS0zKTsKfQoKLmZpbGUtbGlzdCB7CiAgZGlzcGxheTogZ3JpZDsKICBnYXA6IHZhcigtLXJvd2FuLXNwYWNlLTIpOwogIGxpc3Qtc3R5bGU6IG5vbmU7CiAgbWFyZ2luOiAwOwogIHBhZGRpbmc6IDA7Cn0KCi5yb3cgewogIG1hcmdpbjogMDsKfQoKLmVtcHR5IHsKICBjb2xvcjogdmFyKC0tcm93YW4tY29sb3ItbXV0ZWQsICM2MDZiNjMpOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1yb3dhbi1mb250LWZhbWlseSk7CiAgZm9udC1zaXplOiB2YXIoLS1yb3dhbi1mb250LXNpemUtc20pOwogIG1hcmdpbjogMDsKfQoKOmhvc3QoW2Rpc2FibGVkXSkgewogIG9wYWNpdHk6IDAuNzsKfQ==",import.meta.url).href),x(w,"observedAttributes",["label","accept","multiple","disabled","max-files"]),x(w,"upgradeProperties",["label","accept","multiple","disabled","maxFiles","files"]);P("rowan-file-upload",w);const ne={title:"Components/File Upload",tags:["autodocs"],argTypes:{label:{control:"text"},accept:{control:"text"},multiple:{control:"boolean"},disabled:{control:"boolean"},maxFiles:{control:"number"}},args:{label:"Upload attachments",accept:".csv,.xlsx,.pdf",multiple:!0,disabled:!1,maxFiles:5}},y={parameters:U({steps:["Add files with picker or drag-drop, then remove or retry items."],events:["rowan-files-add","rowan-file-remove","rowan-file-retry","rowan-file-cancel"]}),render:({label:t,accept:i,multiple:e,disabled:s,maxFiles:a})=>{const r=document.createElement("rowan-file-upload");return r.label=t,r.accept=i,r.multiple=e,r.disabled=s,r.maxFiles=a,r}},S={render:()=>{const t=document.createElement("rowan-file-upload");return t.label="Quarterly statements",t.accept=".csv,.pdf",t.multiple=!0,t.maxFiles=6,t.files=[{id:"seed-1",name:"q1.csv",size:20480,status:"success"},{id:"seed-2",name:"q2.csv",size:19312,status:"uploading",progress:46},{id:"seed-3",name:"q3.csv",size:25121,status:"failed"}],t}};var q,B,L;y.parameters={...y.parameters,docs:{...(q=y.parameters)==null?void 0:q.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Add files with picker or drag-drop, then remove or retry items."],
    events: ["rowan-files-add", "rowan-file-remove", "rowan-file-retry", "rowan-file-cancel"]
  }),
  render: ({
    label,
    accept,
    multiple,
    disabled,
    maxFiles
  }) => {
    const upload = document.createElement("rowan-file-upload");
    upload.label = label;
    upload.accept = accept;
    upload.multiple = multiple;
    upload.disabled = disabled;
    upload.maxFiles = maxFiles;
    return upload;
  }
}`,...(L=(B=y.parameters)==null?void 0:B.docs)==null?void 0:L.source}}};var R,Z,Q;S.parameters={...S.parameters,docs:{...(R=S.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const upload = document.createElement("rowan-file-upload");
    upload.label = "Quarterly statements";
    upload.accept = ".csv,.pdf";
    upload.multiple = true;
    upload.maxFiles = 6;
    upload.files = [{
      id: "seed-1",
      name: "q1.csv",
      size: 20480,
      status: "success"
    }, {
      id: "seed-2",
      name: "q2.csv",
      size: 19312,
      status: "uploading",
      progress: 46
    }, {
      id: "seed-3",
      name: "q3.csv",
      size: 25121,
      status: "failed"
    }];
    return upload;
  }
}`,...(Q=(Z=S.parameters)==null?void 0:Z.docs)==null?void 0:Q.source}}};const ae=["Playground","WithSeededQueue"];export{y as Playground,S as WithSeededQueue,ae as __namedExportsOrder,ne as default};
