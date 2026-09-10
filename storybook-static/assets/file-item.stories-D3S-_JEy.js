import"./file-item-_o_Z7P7X.js";import{c as f}from"./event-script-39NhYcVW.js";import"./define-C1bbOtVV.js";import"./events-CaQanPdG.js";const z={title:"Components/File Item",tags:["autodocs"],argTypes:{filename:{control:"text"},filesize:{control:"number"},status:{control:"select",options:["queued","uploading","success","failed"]},progress:{control:"number"},disabled:{control:"boolean"}},args:{filename:"report-q3.csv",filesize:183200,status:"queued",progress:0,disabled:!1}},i={parameters:f({steps:["Trigger file actions based on current status."],events:["rowan-remove","rowan-retry","rowan-cancel"]}),render:({filename:s,filesize:t,status:e,progress:n,disabled:r})=>{const a=document.createElement("rowan-file-item");return a.filename=s,a.filesize=t,a.status=e,a.progress=n,a.disabled=r,a}},o={render:()=>{const s=document.createElement("div");s.style.display="grid",s.style.gap="0.75rem";const t=document.createElement("rowan-file-item");t.filename="queued.csv",t.filesize=24e3,t.status="queued";const e=document.createElement("rowan-file-item");e.filename="uploading.csv",e.filesize=99e3,e.status="uploading",e.progress=62;const n=document.createElement("rowan-file-item");n.filename="success.csv",n.filesize=31200,n.status="success";const r=document.createElement("rowan-file-item");return r.filename="failed.csv",r.filesize=1800,r.status="failed",s.append(t,e,n,r),s}};var l,c,u;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Trigger file actions based on current status."],
    events: ["rowan-remove", "rowan-retry", "rowan-cancel"]
  }),
  render: ({
    filename,
    filesize,
    status,
    progress,
    disabled
  }) => {
    const item = document.createElement("rowan-file-item");
    item.filename = filename;
    item.filesize = filesize;
    item.status = status;
    item.progress = progress;
    item.disabled = disabled;
    return item;
  }
}`,...(u=(c=i.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var d,m,p;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "0.75rem";
    const queued = document.createElement("rowan-file-item");
    queued.filename = "queued.csv";
    queued.filesize = 24000;
    queued.status = "queued";
    const uploading = document.createElement("rowan-file-item");
    uploading.filename = "uploading.csv";
    uploading.filesize = 99000;
    uploading.status = "uploading";
    uploading.progress = 62;
    const success = document.createElement("rowan-file-item");
    success.filename = "success.csv";
    success.filesize = 31200;
    success.status = "success";
    const failed = document.createElement("rowan-file-item");
    failed.filename = "failed.csv";
    failed.filesize = 1800;
    failed.status = "failed";
    wrapper.append(queued, uploading, success, failed);
    return wrapper;
  }
}`,...(p=(m=o.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const q=["Playground","States"];export{i as Playground,o as States,q as __namedExportsOrder,z as default};
