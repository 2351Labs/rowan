import"./table-D7X9VhMA.js";import{c as w}from"./event-script-39NhYcVW.js";import"./define-DJLCbHkD.js";import"./events-CaQanPdG.js";import"./badge-DJNEAxWR.js";import"./button-CGChjj4D.js";import"./checkbox-fj_5NbHF.js";import"./switch-DXn8pfkr.js";import"./icon-button-BleMU4gX.js";import"./avatar-CZsSYhKN.js";import"./chip-UtNVQjfs.js";import"./progress-BI56pUeX.js";import"./empty-state-B88FaBkb.js";const g=["none","single","multiple"],b=["sm","md","lg"],C=["info","success","warning","danger"],se=[{id:"name",header:"Name",type:"link",sortable:!0,cell:{href:(e,n)=>`/users/${n.id}`,label:e=>e}},{id:"role",header:"Role",type:"badge",cell:{tone:e=>e==="Admin"?"warning":"info"}},{id:"active",header:"Active",type:"switch",align:"center"},{id:"quota",header:"Quota",type:"progress"},{id:"edit",header:"",type:"icon-button",cell:{label:"Edit",icon:"edit"},width:"3rem"}],k=[{id:"1",name:"Ada",role:"Admin",active:!0,quota:72},{id:"2",name:"Alan",role:"Editor",active:!1,quota:18}],L=[{id:"1",name:"Trail Mix",price:"$10",status:"Live"},{id:"2",name:"Camp Mug",price:"$25",status:"Draft"}],I=[{id:"1",name:"Ada",score:11,joined:"2026-01-04"},{id:"2",name:"Alan",score:19,joined:"2026-03-11"},{id:"3",name:"Grace",score:7,joined:"2026-02-22"},{id:"4",name:"Linus",score:24,joined:"2026-04-17"},{id:"5",name:"Ken",score:15,joined:"2026-05-02"}],M=[{id:"owner",header:"Owner",type:"avatar"},{id:"name",header:"Name",type:"text",sortable:!0},{id:"team",header:"Team",type:"chip"},{id:"score",header:"Score",type:"number",align:"end",sortable:!0},{id:"active",header:"Active",type:"switch",align:"center"}],R=[{id:"1",owner:"Ada",name:"Ada",team:"Platform",score:87,active:!0},{id:"2",owner:"Alan",name:"Alan",team:"Research",score:74,active:!1},{id:"3",owner:"Grace",name:"Grace",team:"Ops",score:92,active:!0}],ie=[{id:"name",header:"Name",type:"link",sortable:!0,cell:{href:(e,n)=>`/profiles/${n.id}`,label:(e,n)=>`${e} (${n.id})`}},{id:"role",header:"Role",type:"badge",cell:{tone:e=>e==="Admin"?"warning":"info"}},{id:"score",header:"Score",type:"number",sortable:!0},{id:"active",header:"Active",type:"switch",align:"center"}],P=[{id:"name",header:"Name",type:"link",sortable:!0,cell:{href:"/profiles",label:"Open"}},{id:"role",header:"Role",type:"badge",cell:{tone:"warning"}},{id:"score",header:"Score",type:"number",sortable:!0},{id:"active",header:"Active",type:"switch",align:"center"}],F=[{id:"1",name:"Ada",role:"Admin",score:98,active:!0},{id:"2",name:"Alan",role:"Editor",score:77,active:!1},{id:"3",name:"Grace",role:"Editor",score:89,active:!0}],z='<span class="price-pill" style="font-weight: 600; color: var(--rowan-color-accent)">Price</span>';function h(e){return e.map(n=>({...n}))}function ee(e){return e.map(n=>({...n,cell:n&&typeof n.cell=="object"&&!Array.isArray(n.cell)?{...n.cell}:n==null?void 0:n.cell,headerCell:n&&typeof n.headerCell=="object"&&!Array.isArray(n.headerCell)?{...n.headerCell}:n==null?void 0:n.headerCell}))}function T(e,n){return(Array.isArray(e)?e:n).filter(t=>t&&typeof t=="object"&&!Array.isArray(t)).map(t=>({...t}))}function ne(e,n){return(Array.isArray(e)?e:n).filter(t=>t&&typeof t=="object"&&!Array.isArray(t)).map((t,o)=>{const a=typeof t.id=="string"&&t.id.trim().length>0?t.id:`column-${o+1}`,i=typeof t.header=="string"&&t.header.trim().length>0?t.header:`Column ${o+1}`;return{...t,id:a,header:i,cell:t&&typeof t.cell=="object"&&!Array.isArray(t.cell)?{...t.cell}:t.cell,headerCell:t&&typeof t.headerCell=="object"&&!Array.isArray(t.headerCell)?{...t.headerCell}:t.headerCell}})}function x(e,n,r=0){const t=Number(e);return Number.isFinite(t)?Math.max(r,Math.trunc(t)):n}function m(e,n,r){return n.includes(e)?e:r}function ce(e,n){return typeof e!="string"?n:e.trim().length>0?e:n}function f(e){return JSON.stringify(e,(n,r)=>typeof r=="function"?r.toString():r,2)}function y(e,n){const r=document.createElement("details");r.open=!0,r.style.border="1px solid var(--rowan-color-border, #ced3ca)",r.style.borderRadius="8px",r.style.background="var(--rowan-color-bg, #ffffff)";const t=document.createElement("summary");t.textContent=e,t.style.cursor="pointer",t.style.fontWeight="600",t.style.padding="0.5rem 0.75rem",t.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)",t.style.fontSize="0.85rem";const o=document.createElement("pre");return o.textContent=n,o.style.margin="0",o.style.padding="0.75rem",o.style.overflow="auto",o.style.fontSize="0.75rem",o.style.lineHeight="1.45",o.style.fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",o.style.background="#f6f8f5",o.style.borderTop="1px solid var(--rowan-color-border, #ced3ca)",r.append(t,o),r}function te(e){const n=document.createElement("p");return n.textContent=e,n.style.margin="0 0 1rem 0",n.style.padding="0.6rem 0.75rem",n.style.border="1px solid #e5cc8e",n.style.borderRadius="8px",n.style.background="#fff7e8",n.style.color="#6f4c00",n.style.fontSize="0.82rem",n.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)",n}function A({title:e,description:n,config:r,notice:t="",templateMarkup:o="",beforeAttach:a}){const i=document.createElement("rowan-table");typeof a=="function"&&a(i),i.config=r;const s=document.createElement("section");s.style.display="grid",s.style.gap="1rem",s.style.alignItems="start",s.style.gridTemplateColumns=window.matchMedia("(max-width: 1100px)").matches?"1fr":"minmax(0, 1.8fr) minmax(19rem, 1fr)";const c=document.createElement("div");c.style.padding="1rem",c.style.border="1px solid var(--rowan-color-border, #ced3ca)",c.style.borderRadius="10px",c.style.background="var(--rowan-color-bg, #ffffff)";const p=document.createElement("p");p.textContent=e,p.style.margin="0 0 0.375rem 0",p.style.fontWeight="700",p.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)";const l=document.createElement("p");l.textContent=n,l.style.margin="0 0 1rem 0",l.style.color="var(--rowan-color-muted, #5f6d62)",l.style.fontSize="0.9rem",l.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)",c.append(p,l),t&&c.append(te(t)),c.append(i);const d=document.createElement("aside");d.style.display="grid",d.style.gap="0.75rem",d.style.alignContent="start";const{rows:u=[],..._}=r;return d.append(y("Config",f(_)),y("Rows",f(u))),o&&d.append(y("Cell Template Markup",o)),s.append(c,d),s}function U(e,n,r){const t=document.createElement("article");t.style.padding="0.85rem",t.style.border="1px solid var(--rowan-color-border, #ced3ca)",t.style.borderRadius="8px",t.style.background="var(--rowan-color-bg, #ffffff)";const o=document.createElement("p");o.textContent=e,o.style.margin="0",o.style.fontWeight="700",o.style.fontSize="0.84rem",o.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)";const a=document.createElement("p");return a.textContent=n,a.style.margin="0.4rem 0 0.85rem 0",a.style.color="var(--rowan-color-muted, #5f6d62)",a.style.fontSize="0.8rem",a.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)",t.append(o,a,r),t}function le({title:e,description:n,notice:r,sourceConfig:t,controlsConfig:o}){const a=document.createElement("rowan-table");a.config=t;const i=document.createElement("rowan-table");i.config=o;const s=document.createElement("section");s.style.display="grid",s.style.gap="1rem",s.style.alignItems="start",s.style.gridTemplateColumns=window.matchMedia("(max-width: 1240px)").matches?"1fr":"minmax(0, 1.95fr) minmax(19rem, 1fr)";const c=document.createElement("div");c.style.padding="1rem",c.style.border="1px solid var(--rowan-color-border, #ced3ca)",c.style.borderRadius="10px",c.style.background="var(--rowan-color-bg, #ffffff)";const p=document.createElement("p");p.textContent=e,p.style.margin="0 0 0.375rem 0",p.style.fontWeight="700",p.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)";const l=document.createElement("p");l.textContent=n,l.style.margin="0 0 1rem 0",l.style.color="var(--rowan-color-muted, #5f6d62)",l.style.fontSize="0.9rem",l.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)";const d=document.createElement("div");d.style.display="grid",d.style.gap="0.8rem",d.style.gridTemplateColumns=window.matchMedia("(max-width: 980px)").matches?"1fr":"1fr 1fr",d.append(U("Source-defined callbacks","Uses real function callbacks declared in this file.",a),U("Controls-edited columns","Uses the object you edit in Controls.",i)),c.append(p,l,te(r),d);const u=document.createElement("aside");u.style.display="grid",u.style.gap="0.75rem",u.style.alignContent="start";const{rows:_,...oe}=t,{rows:re,...ae}=o;return u.append(y("Source Config",f(oe)),y("Controls Config",f(ae)),y("Rows",f(re||[]))),s.append(c,u),s}const Ee={title:"Components/Table",tags:["autodocs"],parameters:{controls:{expanded:!0}}},S={parameters:w({steps:["Click the Name header to trigger sorting.","Toggle the first selection checkbox.","Toggle the Active switch and click the Edit icon button."],events:["rowan-sort","rowan-select","rowan-cell-change","rowan-cell-action"]}),args:{caption:"Team roster",selectable:"multiple",stickyHeader:!0,density:"md",rows:h(k)},argTypes:{caption:{control:"text",description:"Caption shown above the table."},selectable:{control:"inline-radio",options:g,description:"Selection mode."},stickyHeader:{control:"boolean",description:"Pin table header while scrolling."},density:{control:"inline-radio",options:b,description:"Vertical spacing profile."},rows:{control:"object",description:"Editable row data for this story."}},render:e=>{const n=T(e.rows,k),r={caption:e.caption,selectable:m(e.selectable,g,"multiple"),stickyHeader:!!e.stickyHeader,density:m(e.density,b,"md"),rowId:"id",columns:se,rows:n};return A({title:"Exact config mode",description:"Shows the Step 5 config-only setup, including sortable and selectable behavior.",config:r})}},E={parameters:w({steps:["Double-click a table row.","Focus a row and press Enter.","Observe row activation payload details in Event Trace."],events:["rowan-row-activate"]}),args:{liveTone:"success",draftTone:"warning",templateMarkup:z,rows:h(L)},argTypes:{liveTone:{control:"select",options:C,description:"Tone used when status is Live."},draftTone:{control:"select",options:C,description:"Tone used for any non-Live status."},templateMarkup:{control:"text",description:"HTML markup cloned for each custom slot cell."},rows:{control:"object",description:"Editable row data for custom cell rendering."}},render:e=>{const n=T(e.rows,L),r=m(e.liveTone,C,"success"),t=m(e.draftTone,C,"warning"),o=ce(e.templateMarkup,z);return A({title:"Custom slot cells",description:"Template slot configuration and source data are visible in the inspector panel.",config:{rowId:"id",columns:[{id:"name",header:"Name",type:"text"},{id:"price",header:"Price",type:"custom",cell:{slot:"price-cell"}},{id:"status",header:"Status",type:"chip",cell:{tone:i=>i==="Live"?r:t}}],rows:n},templateMarkup:o,beforeAttach:i=>{const s=document.createElement("template");s.slot="price-cell",s.innerHTML=o,i.append(s)}})}},O={parameters:w({steps:["Click Next page.","Click Previous page.","Confirm page index and size changes in Event Trace."],events:["rowan-page-change"]}),args:{caption:"Leaderboard",pageIndex:0,pageSize:2,pageTotal:5,rows:h(I)},argTypes:{caption:{control:"text",description:"Caption shown above the table."},pageIndex:{control:{type:"number",min:0,step:1},description:"Current page index."},pageSize:{control:{type:"number",min:1,step:1},description:"Rows per page."},pageTotal:{control:{type:"number",min:0,step:1},description:"Total rows available."},rows:{control:"object",description:"Editable row data for paged rendering."}},render:e=>{const n=T(e.rows,I),r=x(e.pageSize,2,1),t=x(e.pageTotal,n.length,0),o=Math.max(0,Math.ceil(Math.max(t,1)/r)-1),a=Math.min(x(e.pageIndex,0,0),o),i={caption:e.caption,rowId:"id",page:{index:a,size:r,total:t},columns:[{id:"name",header:"Name",type:"text"},{id:"score",header:"Score",type:"number",sortable:!0},{id:"joined",header:"Joined",type:"date"}],rows:n};return A({title:"Paged rows",description:"Pagination input and row data are shown beside the rendered table.",config:i})}},v={parameters:w({steps:["Click the Score header to sort.","Toggle an Active switch cell.","Edit rows or columns in Controls and repeat interactions."],events:["rowan-sort","rowan-cell-change"]}),args:{caption:"Columns sandbox",selectable:"none",stickyHeader:!1,density:"md",columns:ee(M),rows:h(R)},argTypes:{caption:{control:"text",description:"Caption shown above the table."},selectable:{control:"inline-radio",options:g,description:"Selection mode."},stickyHeader:{control:"boolean",description:"Pin table header while scrolling."},density:{control:"inline-radio",options:b,description:"Vertical spacing profile."},columns:{control:"object",description:"Full editable columns array."},rows:{control:"object",description:"Full editable rows array."}},render:e=>{const n={caption:e.caption,selectable:m(e.selectable,g,"none"),stickyHeader:!!e.stickyHeader,density:m(e.density,b,"md"),rowId:"id",columns:ne(e.columns,M),rows:T(e.rows,R)};return A({title:"Columns object sandbox",description:"Edit the full columns and rows objects live using Storybook Controls.",notice:"Controls serialize functions as strings. Function-based fields such as cell.href callbacks will not execute when edited from Controls.",config:n})}},N={parameters:w({steps:["Click Name in either table to sort.","Click a name link and then toggle Active.","Edit the right-side columns object and compare emitted events and behavior."],events:["rowan-sort","rowan-cell-action","rowan-cell-change"]}),args:{caption:"Function comparison",selectable:"single",stickyHeader:!1,density:"md",columns:ee(P),rows:h(F)},argTypes:{caption:{control:"text",description:"Caption for both tables."},selectable:{control:"inline-radio",options:g,description:"Selection mode for both tables."},stickyHeader:{control:"boolean",description:"Pin table headers while scrolling."},density:{control:"inline-radio",options:b,description:"Vertical spacing profile for both tables."},columns:{control:"object",description:"Editable columns object used by the right-hand table."},rows:{control:"object",description:"Editable rows object used by both tables."}},render:e=>{const n=T(e.rows,F),r=m(e.selectable,g,"single"),t=m(e.density,b,"md"),o=!!e.stickyHeader,a={caption:`${e.caption} - source`,rowId:"id",selectable:r,stickyHeader:o,density:t,columns:ie,rows:n},i={caption:`${e.caption} - controls`,rowId:"id",selectable:r,stickyHeader:o,density:t,columns:ne(e.columns,P),rows:n};return le({title:"Function-capable columns vs Controls object",description:"Left table uses callback functions from source code. Right table uses the live object from Storybook Controls.",notice:"Function fields edited in Controls are serialized as strings, so callback-like text does not execute as JavaScript.",sourceConfig:a,controlsConfig:i})}};var j,D,H;S.parameters={...S.parameters,docs:{...(j=S.parameters)==null?void 0:j.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the Name header to trigger sorting.", "Toggle the first selection checkbox.", "Toggle the Active switch and click the Edit icon button."],
    events: ["rowan-sort", "rowan-select", "rowan-cell-change", "rowan-cell-action"]
  }),
  args: {
    caption: "Team roster",
    selectable: "multiple",
    stickyHeader: true,
    density: "md",
    rows: cloneRows(EXACT_DEFAULT_ROWS)
  },
  argTypes: {
    caption: {
      control: "text",
      description: "Caption shown above the table."
    },
    selectable: {
      control: "inline-radio",
      options: SELECTABLE_OPTIONS,
      description: "Selection mode."
    },
    stickyHeader: {
      control: "boolean",
      description: "Pin table header while scrolling."
    },
    density: {
      control: "inline-radio",
      options: DENSITY_OPTIONS,
      description: "Vertical spacing profile."
    },
    rows: {
      control: "object",
      description: "Editable row data for this story."
    }
  },
  render: args => {
    const rows = normalizeRows(args.rows, EXACT_DEFAULT_ROWS);
    const config = {
      caption: args.caption,
      selectable: normalizeOption(args.selectable, SELECTABLE_OPTIONS, "multiple"),
      stickyHeader: Boolean(args.stickyHeader),
      density: normalizeOption(args.density, DENSITY_OPTIONS, "md"),
      rowId: "id",
      columns: EXACT_COLUMNS,
      rows
    };
    return createStoryLayout({
      title: "Exact config mode",
      description: "Shows the Step 5 config-only setup, including sortable and selectable behavior.",
      config
    });
  }
}`,...(H=(D=S.parameters)==null?void 0:D.docs)==null?void 0:H.source}}};var W,B,$;E.parameters={...E.parameters,docs:{...(W=E.parameters)==null?void 0:W.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Double-click a table row.", "Focus a row and press Enter.", "Observe row activation payload details in Event Trace."],
    events: ["rowan-row-activate"]
  }),
  args: {
    liveTone: "success",
    draftTone: "warning",
    templateMarkup: SLOT_TEMPLATE_DEFAULT,
    rows: cloneRows(SLOT_DEFAULT_ROWS)
  },
  argTypes: {
    liveTone: {
      control: "select",
      options: TONE_OPTIONS,
      description: "Tone used when status is Live."
    },
    draftTone: {
      control: "select",
      options: TONE_OPTIONS,
      description: "Tone used for any non-Live status."
    },
    templateMarkup: {
      control: "text",
      description: "HTML markup cloned for each custom slot cell."
    },
    rows: {
      control: "object",
      description: "Editable row data for custom cell rendering."
    }
  },
  render: args => {
    const rows = normalizeRows(args.rows, SLOT_DEFAULT_ROWS);
    const liveTone = normalizeOption(args.liveTone, TONE_OPTIONS, "success");
    const draftTone = normalizeOption(args.draftTone, TONE_OPTIONS, "warning");
    const templateMarkup = normalizeTemplateMarkup(args.templateMarkup, SLOT_TEMPLATE_DEFAULT);
    const config = {
      rowId: "id",
      columns: [{
        id: "name",
        header: "Name",
        type: "text"
      }, {
        id: "price",
        header: "Price",
        type: "custom",
        cell: {
          slot: "price-cell"
        }
      }, {
        id: "status",
        header: "Status",
        type: "chip",
        cell: {
          tone: value => value === "Live" ? liveTone : draftTone
        }
      }],
      rows
    };
    return createStoryLayout({
      title: "Custom slot cells",
      description: "Template slot configuration and source data are visible in the inspector panel.",
      config,
      templateMarkup,
      beforeAttach: table => {
        const priceTemplate = document.createElement("template");
        priceTemplate.slot = "price-cell";
        priceTemplate.innerHTML = templateMarkup;
        table.append(priceTemplate);
      }
    });
  }
}`,...($=(B=E.parameters)==null?void 0:B.docs)==null?void 0:$.source}}};var X,G,Y;O.parameters={...O.parameters,docs:{...(X=O.parameters)==null?void 0:X.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click Next page.", "Click Previous page.", "Confirm page index and size changes in Event Trace."],
    events: ["rowan-page-change"]
  }),
  args: {
    caption: "Leaderboard",
    pageIndex: 0,
    pageSize: 2,
    pageTotal: 5,
    rows: cloneRows(PAGINATION_DEFAULT_ROWS)
  },
  argTypes: {
    caption: {
      control: "text",
      description: "Caption shown above the table."
    },
    pageIndex: {
      control: {
        type: "number",
        min: 0,
        step: 1
      },
      description: "Current page index."
    },
    pageSize: {
      control: {
        type: "number",
        min: 1,
        step: 1
      },
      description: "Rows per page."
    },
    pageTotal: {
      control: {
        type: "number",
        min: 0,
        step: 1
      },
      description: "Total rows available."
    },
    rows: {
      control: "object",
      description: "Editable row data for paged rendering."
    }
  },
  render: args => {
    const rows = normalizeRows(args.rows, PAGINATION_DEFAULT_ROWS);
    const size = normalizeNumber(args.pageSize, 2, 1);
    const total = normalizeNumber(args.pageTotal, rows.length, 0);
    const maxIndex = Math.max(0, Math.ceil(Math.max(total, 1) / size) - 1);
    const index = Math.min(normalizeNumber(args.pageIndex, 0, 0), maxIndex);
    const config = {
      caption: args.caption,
      rowId: "id",
      page: {
        index,
        size,
        total
      },
      columns: [{
        id: "name",
        header: "Name",
        type: "text"
      }, {
        id: "score",
        header: "Score",
        type: "number",
        sortable: true
      }, {
        id: "joined",
        header: "Joined",
        type: "date"
      }],
      rows
    };
    return createStoryLayout({
      title: "Paged rows",
      description: "Pagination input and row data are shown beside the rendered table.",
      config
    });
  }
}`,...(Y=(G=O.parameters)==null?void 0:G.docs)==null?void 0:Y.source}}};var V,J,q;v.parameters={...v.parameters,docs:{...(V=v.parameters)==null?void 0:V.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click the Score header to sort.", "Toggle an Active switch cell.", "Edit rows or columns in Controls and repeat interactions."],
    events: ["rowan-sort", "rowan-cell-change"]
  }),
  args: {
    caption: "Columns sandbox",
    selectable: "none",
    stickyHeader: false,
    density: "md",
    columns: cloneColumns(COLUMNS_SANDBOX_DEFAULT_COLUMNS),
    rows: cloneRows(COLUMNS_SANDBOX_DEFAULT_ROWS)
  },
  argTypes: {
    caption: {
      control: "text",
      description: "Caption shown above the table."
    },
    selectable: {
      control: "inline-radio",
      options: SELECTABLE_OPTIONS,
      description: "Selection mode."
    },
    stickyHeader: {
      control: "boolean",
      description: "Pin table header while scrolling."
    },
    density: {
      control: "inline-radio",
      options: DENSITY_OPTIONS,
      description: "Vertical spacing profile."
    },
    columns: {
      control: "object",
      description: "Full editable columns array."
    },
    rows: {
      control: "object",
      description: "Full editable rows array."
    }
  },
  render: args => {
    const config = {
      caption: args.caption,
      selectable: normalizeOption(args.selectable, SELECTABLE_OPTIONS, "none"),
      stickyHeader: Boolean(args.stickyHeader),
      density: normalizeOption(args.density, DENSITY_OPTIONS, "md"),
      rowId: "id",
      columns: normalizeColumns(args.columns, COLUMNS_SANDBOX_DEFAULT_COLUMNS),
      rows: normalizeRows(args.rows, COLUMNS_SANDBOX_DEFAULT_ROWS)
    };
    return createStoryLayout({
      title: "Columns object sandbox",
      description: "Edit the full columns and rows objects live using Storybook Controls.",
      notice: "Controls serialize functions as strings. Function-based fields such as cell.href callbacks will not execute when edited from Controls.",
      config
    });
  }
}`,...(q=(J=v.parameters)==null?void 0:J.docs)==null?void 0:q.source}}};var K,Q,Z;N.parameters={...N.parameters,docs:{...(K=N.parameters)==null?void 0:K.docs,source:{originalSource:`{
  parameters: createEventScriptParameters({
    steps: ["Click Name in either table to sort.", "Click a name link and then toggle Active.", "Edit the right-side columns object and compare emitted events and behavior."],
    events: ["rowan-sort", "rowan-cell-action", "rowan-cell-change"]
  }),
  args: {
    caption: "Function comparison",
    selectable: "single",
    stickyHeader: false,
    density: "md",
    columns: cloneColumns(FUNCTION_COMPARE_CONTROLS_COLUMNS),
    rows: cloneRows(FUNCTION_COMPARE_ROWS)
  },
  argTypes: {
    caption: {
      control: "text",
      description: "Caption for both tables."
    },
    selectable: {
      control: "inline-radio",
      options: SELECTABLE_OPTIONS,
      description: "Selection mode for both tables."
    },
    stickyHeader: {
      control: "boolean",
      description: "Pin table headers while scrolling."
    },
    density: {
      control: "inline-radio",
      options: DENSITY_OPTIONS,
      description: "Vertical spacing profile for both tables."
    },
    columns: {
      control: "object",
      description: "Editable columns object used by the right-hand table."
    },
    rows: {
      control: "object",
      description: "Editable rows object used by both tables."
    }
  },
  render: args => {
    const rows = normalizeRows(args.rows, FUNCTION_COMPARE_ROWS);
    const selectable = normalizeOption(args.selectable, SELECTABLE_OPTIONS, "single");
    const density = normalizeOption(args.density, DENSITY_OPTIONS, "md");
    const stickyHeader = Boolean(args.stickyHeader);
    const sourceConfig = {
      caption: \`\${args.caption} - source\`,
      rowId: "id",
      selectable,
      stickyHeader,
      density,
      columns: FUNCTION_COMPARE_SOURCE_COLUMNS,
      rows
    };
    const controlsConfig = {
      caption: \`\${args.caption} - controls\`,
      rowId: "id",
      selectable,
      stickyHeader,
      density,
      columns: normalizeColumns(args.columns, FUNCTION_COMPARE_CONTROLS_COLUMNS),
      rows
    };
    return createFunctionComparisonLayout({
      title: "Function-capable columns vs Controls object",
      description: "Left table uses callback functions from source code. Right table uses the live object from Storybook Controls.",
      notice: "Function fields edited in Controls are serialized as strings, so callback-like text does not execute as JavaScript.",
      sourceConfig,
      controlsConfig
    });
  }
}`,...(Z=(Q=N.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};const Oe=["ExactConfig","CustomSlotCell","Pagination","ColumnsSandbox","FunctionColumnsComparison"];export{v as ColumnsSandbox,E as CustomSlotCell,S as ExactConfig,N as FunctionColumnsComparison,O as Pagination,Oe as __namedExportsOrder,Ee as default};
