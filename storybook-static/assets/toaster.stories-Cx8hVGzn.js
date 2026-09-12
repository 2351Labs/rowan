var H=Object.defineProperty;var N=i=>{throw TypeError(i)};var J=(i,r,t)=>r in i?H(i,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[r]=t;var C=(i,r,t)=>J(i,typeof r!="symbol"?r+"":r,t),S=(i,r,t)=>r.has(i)||N("Cannot "+t);var o=(i,r,t)=>(S(i,r,"read from private field"),t?t.call(i):r.get(i)),p=(i,r,t)=>r.has(i)?N("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(i):r.set(i,t),f=(i,r,t,e)=>(S(i,r,"write to private field"),e?e.call(i,t):r.set(i,t),t),c=(i,r,t)=>(S(i,r,"access private method"),t);import{B as M,d as j}from"./define-BSqCZTMW.js";import{e as Y}from"./events-CaQanPdG.js";import"./toast-DxywfWpA.js";import"./button-D_Czu0Br.js";import{c as D}from"./event-script-39NhYcVW.js";const K=5e3,G=3,v="top-end",F=new Set(["top-start","top-end","bottom-start","bottom-end","bottom-center"]),U=new Set(["info","success","warning","danger"]);var m,I,l,d,u,n,y,w,x,O,L,V,z,k,Z,W;class A extends M{constructor(){super(...arguments);p(this,n);p(this,m,null);p(this,I,0);p(this,l,[]);p(this,d,[]);p(this,u,new Map)}disconnectedCallback(){super.disconnectedCallback();for(const t of o(this,u).values())clearTimeout(t);o(this,u).clear()}get placement(){const t=this.readString("placement",v);return F.has(t)?t:v}set placement(t){const e=F.has(t)?t:v;this.reflectString("placement",e===v?null:e)}get maxVisible(){return Math.max(1,Math.floor(this.readNumber("max-visible",G)))}set maxVisible(t){const e=Number(t),s=Number.isFinite(e)?Math.max(1,Math.floor(e)):G;this.reflectNumber("max-visible",s===G?null:s)}get duration(){return Math.max(0,this.readNumber("duration",K))}set duration(t){const e=Number(t),s=Number.isFinite(e)?Math.max(0,Math.floor(e)):K;this.reflectNumber("duration",s===K?null:s)}show(t){const e=c(this,n,z).call(this,t);return e?(o(this,l).push(e),this.isConnected&&o(this,m)?(c(this,n,y).call(this),c(this,n,x).call(this)):this.requestRender(),e.id):null}dismiss(t,e="programmatic"){if(typeof t!="string"||t.trim().length===0)return!1;const s=o(this,l).findIndex(a=>a.id===t);return s>=0?(o(this,l).splice(s,1),!0):c(this,n,w).call(this,t,e)}clear(t="programmatic"){f(this,l,[]);const e=o(this,d).map(s=>s.id);for(const s of e)c(this,n,w).call(this,s,t)}render(){o(this,m)||(this.renderRoot.innerHTML='<div class="stack" part="stack"></div>',f(this,m,this.renderRoot.querySelector(".stack")),this.listen(o(this,m),"rowan-dismiss",t=>{const e=t.target;if(!(e instanceof HTMLElement))return;const s=e.dataset.toastId;if(!s)return;const a=t.detail&&typeof t.detail.reason=="string"?t.detail.reason:"dismiss-button";c(this,n,w).call(this,s,a)})),c(this,n,y).call(this),c(this,n,x).call(this);for(const t of o(this,d))c(this,n,L).call(this,t)}}m=new WeakMap,I=new WeakMap,l=new WeakMap,d=new WeakMap,u=new WeakMap,n=new WeakSet,y=function(){for(;o(this,d).length<this.maxVisible&&o(this,l).length>0;){const t=o(this,l).shift();o(this,d).push(t),c(this,n,L).call(this,t),Y(this,"rowan-toast-show",{id:t.id,tone:t.tone,title:t.title,message:t.message,duration:t.duration})}},w=function(t,e){const s=o(this,d).findIndex(g=>g.id===t);if(s<0)return!1;const[a]=o(this,d).splice(s,1);return c(this,n,V).call(this,t),c(this,n,y).call(this),c(this,n,x).call(this),Y(this,"rowan-toast-dismiss",{id:t,tone:a.tone,title:a.title,message:a.message,reason:e}),!0},x=function(){if(!o(this,m))return;const t=document.createDocumentFragment();for(const e of o(this,d))t.append(c(this,n,O).call(this,e));o(this,m).replaceChildren(t)},O=function(t){const e=document.createElement("rowan-toast");if(e.dataset.toastId=t.id,t.tone!=="info"&&e.setAttribute("tone",t.tone),t.dismissible&&e.setAttribute("dismissible",""),t.title){const a=document.createElement("span");a.slot="title",a.textContent=t.title,e.append(a)}const s=document.createElement("span");return s.textContent=t.message,e.append(s),e},L=function(t){if(t.duration<=0||o(this,u).has(t.id))return;const e=setTimeout(()=>{c(this,n,w).call(this,t.id,"timeout")},t.duration);o(this,u).set(t.id,e)},V=function(t){const e=o(this,u).get(t);e&&(clearTimeout(e),o(this,u).delete(t))},z=function(t){const e=typeof t=="string"?{message:t}:t&&typeof t=="object"?t:null;if(!e)return null;const s=typeof e.message=="string"?e.message.trim():"";if(!s)return null;const a=typeof e.title=="string"?e.title.trim():"",g=U.has(e.tone)?e.tone:"info",b=e.dismissible!==!1,h=Number(e.duration),Q=Number.isFinite(h)?Math.max(0,Math.floor(h)):this.duration,R=typeof e.id=="string"?e.id.trim():"";return{id:c(this,n,k).call(this,R),title:a,message:s,tone:g,dismissible:b,duration:Q}},k=function(t){if(t.length>0&&!c(this,n,Z).call(this,t))return t;let e=c(this,n,W).call(this);for(;c(this,n,Z).call(this,e);)e=c(this,n,W).call(this);return e},Z=function(t){return o(this,d).some(e=>e.id===t)||o(this,l).some(e=>e.id===t)},W=function(){return f(this,I,o(this,I)+1),`toast-${Date.now()}-${o(this,I)}`},C(A,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGJvdHRvbTogY2FsYyh2YXIoLS1yb3dhbi1zcGFjZS0zKSArIGVudihzYWZlLWFyZWEtaW5zZXQtYm90dG9tKSk7CiAgZGlzcGxheTogYmxvY2s7CiAgaW5zZXQtaW5saW5lOiB2YXIoLS1yb3dhbi1zcGFjZS0zKTsKICBwb2ludGVyLWV2ZW50czogbm9uZTsKICBwb3NpdGlvbjogZml4ZWQ7CiAgei1pbmRleDogdmFyKC0tcm93YW4tdG9hc3Rlci16LWluZGV4LCAxMDAwKTsKfQoKOmhvc3QoW2hpZGRlbl0pIHsKICBkaXNwbGF5OiBub25lOwp9Cgouc3RhY2sgewogIGRpc3BsYXk6IGdyaWQ7CiAgZ2FwOiB2YXIoLS1yb3dhbi1zcGFjZS0yKTsKfQoKLnN0YWNrIHJvd2FuLXRvYXN0IHsKICBwb2ludGVyLWV2ZW50czogYXV0bzsKfQoKQG1lZGlhIChtaW4td2lkdGg6IDQ4cmVtKSB7CiAgOmhvc3QgewogICAgaW5zZXQtaW5saW5lOiBhdXRvOwogICAgbWF4LXdpZHRoOiBtaW4oMjZyZW0sIGNhbGMoMTAwdncgLSB2YXIoLS1yb3dhbi1zcGFjZS04KSkpOwogICAgdHJhbnNmb3JtOiBub25lOwogIH0KCiAgOmhvc3QoOm5vdChbcGxhY2VtZW50XSkpLAogIDpob3N0KFtwbGFjZW1lbnQ9InRvcC1lbmQiXSkgewogICAgYm90dG9tOiBhdXRvOwogICAgcmlnaHQ6IHZhcigtLXJvd2FuLXNwYWNlLTQpOwogICAgdG9wOiB2YXIoLS1yb3dhbi1zcGFjZS00KTsKICB9CgogIDpob3N0KFtwbGFjZW1lbnQ9InRvcC1zdGFydCJdKSB7CiAgICBib3R0b206IGF1dG87CiAgICBsZWZ0OiB2YXIoLS1yb3dhbi1zcGFjZS00KTsKICAgIHJpZ2h0OiBhdXRvOwogICAgdG9wOiB2YXIoLS1yb3dhbi1zcGFjZS00KTsKICB9CgogIDpob3N0KFtwbGFjZW1lbnQ9ImJvdHRvbS1zdGFydCJdKSB7CiAgICBib3R0b206IGNhbGModmFyKC0tcm93YW4tc3BhY2UtNCkgKyBlbnYoc2FmZS1hcmVhLWluc2V0LWJvdHRvbSkpOwogICAgbGVmdDogdmFyKC0tcm93YW4tc3BhY2UtNCk7CiAgICByaWdodDogYXV0bzsKICAgIHRvcDogYXV0bzsKICB9CgogIDpob3N0KFtwbGFjZW1lbnQ9ImJvdHRvbS1lbmQiXSkgewogICAgYm90dG9tOiBjYWxjKHZhcigtLXJvd2FuLXNwYWNlLTQpICsgZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20pKTsKICAgIHJpZ2h0OiB2YXIoLS1yb3dhbi1zcGFjZS00KTsKICAgIHRvcDogYXV0bzsKICB9CgogIDpob3N0KFtwbGFjZW1lbnQ9ImJvdHRvbS1jZW50ZXIiXSkgewogICAgYm90dG9tOiBjYWxjKHZhcigtLXJvd2FuLXNwYWNlLTQpICsgZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20pKTsKICAgIGxlZnQ6IDUwJTsKICAgIHJpZ2h0OiBhdXRvOwogICAgdG9wOiBhdXRvOwogICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpOwogICAgd2lkdGg6IG1pbigyNnJlbSwgY2FsYygxMDB2dyAtIHZhcigtLXJvd2FuLXNwYWNlLTgpKSk7CiAgfQp9",import.meta.url).href),C(A,"observedAttributes",["placement","max-visible","duration"]),C(A,"upgradeProperties",["placement","maxVisible","duration"]);j("rowan-toaster",A);const st={title:"Components/Toaster",tags:["autodocs"],argTypes:{placement:{control:"select",options:["top-start","top-end","bottom-start","bottom-end","bottom-center"]},maxVisible:{control:"number"},duration:{control:"number"}},args:{placement:"top-end",maxVisible:2,duration:3e3}},B={parameters:D({steps:["Click each trigger button to enqueue notifications.","Dismiss one manually or wait for timeout.","Confirm rowan-toast-show and rowan-toast-dismiss appear in Event Trace."],events:["rowan-toast-show","rowan-toast-dismiss"]}),render:({placement:i,maxVisible:r,duration:t})=>{const e=document.createElement("div");e.style.display="grid",e.style.gap="0.75rem";const s=document.createElement("div");s.style.display="flex",s.style.flexWrap="wrap",s.style.gap="0.5rem";const a=document.createElement("rowan-toaster");a.placement=i,a.maxVisible=r,a.duration=t;const g=document.createElement("rowan-button");g.textContent="Show success",g.setAttribute("size","sm"),g.addEventListener("rowan-click",()=>{a.show({tone:"success",title:"Sync complete",message:"42 invoices were synced."})});const b=document.createElement("rowan-button");b.textContent="Show warning",b.setAttribute("size","sm"),b.setAttribute("variant","secondary"),b.addEventListener("rowan-click",()=>{a.show({tone:"warning",title:"Partial import",message:"3 records need manual review."})});const h=document.createElement("rowan-button");return h.textContent="Show danger",h.setAttribute("size","sm"),h.setAttribute("variant","danger"),h.addEventListener("rowan-click",()=>{a.show({tone:"danger",title:"Export failed",message:"Connection to reporting service was interrupted.",duration:0})}),s.append(g,b,h),e.append(s,a),e}};var T,E,X;B.parameters={...B.parameters,docs:{...(T=B.parameters)==null?void 0:T.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click each trigger button to enqueue notifications.", "Dismiss one manually or wait for timeout.", "Confirm rowan-toast-show and rowan-toast-dismiss appear in Event Trace."],
    events: ["rowan-toast-show", "rowan-toast-dismiss"]
  }),
  render: ({
    placement,
    maxVisible,
    duration
  }) => {
    const shell = document.createElement("div");
    shell.style.display = "grid";
    shell.style.gap = "0.75rem";
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.flexWrap = "wrap";
    controls.style.gap = "0.5rem";
    const toaster = document.createElement("rowan-toaster");
    toaster.placement = placement;
    toaster.maxVisible = maxVisible;
    toaster.duration = duration;
    const successButton = document.createElement("rowan-button");
    successButton.textContent = "Show success";
    successButton.setAttribute("size", "sm");
    successButton.addEventListener("rowan-click", () => {
      toaster.show({
        tone: "success",
        title: "Sync complete",
        message: "42 invoices were synced."
      });
    });
    const warningButton = document.createElement("rowan-button");
    warningButton.textContent = "Show warning";
    warningButton.setAttribute("size", "sm");
    warningButton.setAttribute("variant", "secondary");
    warningButton.addEventListener("rowan-click", () => {
      toaster.show({
        tone: "warning",
        title: "Partial import",
        message: "3 records need manual review."
      });
    });
    const dangerButton = document.createElement("rowan-button");
    dangerButton.textContent = "Show danger";
    dangerButton.setAttribute("size", "sm");
    dangerButton.setAttribute("variant", "danger");
    dangerButton.addEventListener("rowan-click", () => {
      toaster.show({
        tone: "danger",
        title: "Export failed",
        message: "Connection to reporting service was interrupted.",
        duration: 0
      });
    });
    controls.append(successButton, warningButton, dangerButton);
    shell.append(controls, toaster);
    return shell;
  }
}`,...(X=(E=B.parameters)==null?void 0:E.docs)==null?void 0:X.source}}};const ot=["Playground"];export{B as Playground,ot as __namedExportsOrder,st as default};
