var b=Object.defineProperty;var i=(e,t,n)=>t in e?b(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var s=(e,t,n)=>i(e,typeof t!="symbol"?t+"":t,n);import{B as l,d as C}from"./define-Chpk02HC.js";class p extends l{render(){this.renderRoot.firstElementChild||(this.renderRoot.innerHTML='<nav class="nav" part="nav" aria-label="Breadcrumb"><slot></slot></nav>')}}s(p,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5uYXYgewogIGNvbG9yOiB2YXIoLS1yb3dhbi1jb2xvci1tdXRlZCk7CiAgZGlzcGxheTogaW5saW5lLWZsZXg7CiAgZm9udC1mYW1pbHk6IHZhcigtLXJvd2FuLWZvbnQtZmFtaWx5KTsKICBmb250LXNpemU6IHZhcigtLXJvd2FuLWZvbnQtc2l6ZS1zbSk7CiAgZ2FwOiAwLjM1cmVtOwp9CgoubmF2IDo6c2xvdHRlZChhKSB7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWFjY2VudCk7CiAgdGV4dC1kZWNvcmF0aW9uOiBub25lOwp9CgoubmF2IDo6c2xvdHRlZChzcGFuW2FyaWEtY3VycmVudD0icGFnZSJdKSB7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKfQo=",import.meta.url).href);C("rowan-breadcrumb",p);const v={title:"Components/Navigation & Layout/Breadcrumb",tags:["autodocs"]},r={render:()=>{const e=document.createElement("rowan-breadcrumb"),t=document.createElement("a");t.href="#",t.textContent="Home",e.append(t);const n=document.createElement("span");n.textContent="/",e.append(n);const a=document.createElement("a");a.href="#",a.textContent="Docs",e.append(a);const o=document.createElement("span");o.textContent="/",e.append(o);const c=document.createElement("span");return c.setAttribute("aria-current","page"),c.textContent="Buttons",e.append(c),e}};var d,m,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const breadcrumb = document.createElement("rowan-breadcrumb");
    const home = document.createElement("a");
    home.href = "#";
    home.textContent = "Home";
    breadcrumb.append(home);
    const sep1 = document.createElement("span");
    sep1.textContent = "/";
    breadcrumb.append(sep1);
    const docs = document.createElement("a");
    docs.href = "#";
    docs.textContent = "Docs";
    breadcrumb.append(docs);
    const sep2 = document.createElement("span");
    sep2.textContent = "/";
    breadcrumb.append(sep2);
    const current = document.createElement("span");
    current.setAttribute("aria-current", "page");
    current.textContent = "Buttons";
    breadcrumb.append(current);
    return breadcrumb;
  }
}`,...(u=(m=r.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const Z=["Playground"];export{r as Playground,Z as __namedExportsOrder,v as default};
