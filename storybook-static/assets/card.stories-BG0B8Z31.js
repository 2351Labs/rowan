var m=Object.defineProperty;var C=(e,t,o)=>t in e?m(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var r=(e,t,o)=>C(e,typeof t!="symbol"?t+"":t,o);import{B as p,d as g}from"./define-C1bbOtVV.js";import"./button-Cnv2b6fF.js";import"./events-CaQanPdG.js";class l extends p{render(){this.renderRoot.firstElementChild||(this.renderRoot.innerHTML=`
      <article class="card" part="card">
        <div class="media" part="media"><slot name="media"></slot></div>
        <div class="header" part="header"><slot name="header"></slot></div>
        <div class="title" part="title"><slot name="title"></slot></div>
        <div class="body" part="body"><slot></slot></div>
        <div class="footer" part="footer"><slot name="footer"></slot></div>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
      </article>
    `)}}r(l,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi5jYXJkIHsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1jYXJkLWJnLCAjZmZmZmZmKTsKICBib3JkZXI6IHZhcigtLXJvd2FuLWJvcmRlci13aWR0aCkgc29saWQgdmFyKC0tcm93YW4tY2FyZC1ib3JkZXIsIHZhcigtLXJvd2FuLWNvbG9yLWJvcmRlcikpOwogIGJvcmRlci1yYWRpdXM6IHZhcigtLXJvd2FuLXJhZGl1cy1sZyk7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBkaXNwbGF5OiBncmlkOwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtNCk7CiAgcGFkZGluZzogdmFyKC0tcm93YW4tc3BhY2UtNCk7Cn0KCi5tZWRpYSwKLmhlYWRlciwKLnRpdGxlLAouZm9vdGVyLAouYWN0aW9ucyB7CiAgbWluLXdpZHRoOiAwOwp9CgoudGl0bGUgewogIGZvbnQtc2l6ZTogdmFyKC0tcm93YW4tZm9udC1zaXplLWxnKTsKICBmb250LXdlaWdodDogNjAwOwogIGxpbmUtaGVpZ2h0OiAxLjI7Cn0KCi5ib2R5IHsKICBjb2xvcjogdmFyKC0tcm93YW4tY29sb3ItZmcpOwogIGxpbmUtaGVpZ2h0OiB2YXIoLS1yb3dhbi1saW5lLWhlaWdodCk7Cn0KCi5hY3Rpb25zIHsKICBkaXNwbGF5OiBmbGV4OwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtMik7CiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDsKfQo=",import.meta.url).href);g("rowan-card",l);const w={title:"Components/Card",tags:["autodocs"]},n={render:()=>{const e=document.createElement("rowan-card"),t=document.createElement("h3");t.slot="title",t.textContent="Evergreen Trail";const o=document.createElement("p");o.textContent="A quiet route through old-growth cedar groves with two scenic overlooks.";const a=document.createElement("small");a.slot="footer",a.textContent="Updated 2h ago";const c=document.createElement("rowan-button");return c.slot="actions",c.textContent="View details",e.append(t,o,a,c),e}};var s,d,i;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => {
    const card = document.createElement("rowan-card");
    const title = document.createElement("h3");
    title.slot = "title";
    title.textContent = "Evergreen Trail";
    const body = document.createElement("p");
    body.textContent = "A quiet route through old-growth cedar groves with two scenic overlooks.";
    const footer = document.createElement("small");
    footer.slot = "footer";
    footer.textContent = "Updated 2h ago";
    const action = document.createElement("rowan-button");
    action.slot = "actions";
    action.textContent = "View details";
    card.append(title, body, footer, action);
    return card;
  }
}`,...(i=(d=n.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};const I=["Composition"];export{n as Composition,I as __namedExportsOrder,w as default};
