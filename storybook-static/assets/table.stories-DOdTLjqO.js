var It=Object.defineProperty;var ue=i=>{throw TypeError(i)};var vt=(i,a,t)=>a in i?It(i,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[a]=t;var D=(i,a,t)=>vt(i,typeof a!="symbol"?a+"":a,t),oe=(i,a,t)=>a.has(i)||ue("Cannot "+t);var c=(i,a,t)=>(oe(i,a,"read from private field"),t?t.call(i):a.get(i)),f=(i,a,t)=>a.has(i)?ue("Cannot add the same private member more than once"):a instanceof WeakSet?a.add(i):a.set(i,t),C=(i,a,t,e)=>(oe(i,a,"write to private field"),e?e.call(i,t):a.set(i,t),t),r=(i,a,t)=>(oe(i,a,"access private method"),t);import{B as St,d as Tt}from"./define-C1bbOtVV.js";import{e as S}from"./events-CaQanPdG.js";import"./badge-RDcK06R_.js";import"./button-Cnv2b6fF.js";import"./checkbox-Bix20Hb2.js";import"./switch-_ploQVv3.js";import"./icon-button-D0QvykjY.js";import"./avatar-Dn3fOOOP.js";import"./chip-CzDpw_Vz.js";import"./progress-DV_cJngS.js";import"./empty-state-DH5ojwR-.js";import{c as H}from"./event-script-39NhYcVW.js";const Lt=new Set(["text","number","date","badge","link","checkbox","switch","button","icon-button","avatar","chip","progress","custom"]),he="__select",be=new Set(["asc","desc"]);var p,X,z,T,E,L,W,O,Z,R,v,N,o,Me,Xe,ze,He,je,_e,De,Ue,A,Pe,Ve,Je,Qe,qe,$e,et,tt,nt,ot,st,rt,re,x,ie,ae,it,at,lt,le,ce,ct,dt,pt,mt,de,ut,ee,ht,g,bt,y,K,gt,pe,me;class $ extends St{constructor(){super(...arguments);f(this,o);f(this,p,{columns:[],rows:[],rowId:"id",selected:[],sort:null,page:null});f(this,X,null);f(this,z,null);f(this,T,null);f(this,E,null);f(this,L,null);f(this,W,null);f(this,O,null);f(this,Z,null);f(this,R,null);f(this,v,[]);f(this,N,-1)}get config(){return{columns:this.columns,rows:this.rows,rowId:c(this,p).rowId,selectable:this.selectable,selected:[...c(this,p).selected],sort:this.sort,page:this.page,density:this.density,stickyHeader:this.stickyHeader,loading:this.loading,caption:this.caption}}set config(t){const e=t??{};c(this,p).columns=Array.isArray(e.columns)?e.columns:c(this,p).columns,c(this,p).rows=Array.isArray(e.rows)?e.rows:c(this,p).rows,c(this,p).rowId=e.rowId??c(this,p).rowId,e.caption!=null&&(this.caption=String(e.caption)),e.density!=null&&(this.density=e.density),e.selectable!=null&&(this.selectable=e.selectable),e.selected!=null&&(this.selected=e.selected),e.sort!==void 0&&(this.sort=e.sort),e.page!==void 0&&(this.page=e.page),e.stickyHeader!=null&&(this.stickyHeader=!!e.stickyHeader),e.loading!=null&&(this.loading=!!e.loading),this.requestRender()}get columns(){return c(this,p).columns}set columns(t){c(this,p).columns=Array.isArray(t)?t:[],this.requestRender()}get rows(){return c(this,p).rows}set rows(t){c(this,p).rows=Array.isArray(t)?t:[],this.requestRender()}get selectable(){return this.readString("selectable","none")}set selectable(t){const e=t==="single"||t==="multiple"?t:"none";this.reflectString("selectable",e==="none"?null:e)}get selected(){return[...c(this,p).selected]}set selected(t){c(this,p).selected=Array.isArray(t)?t.map(e=>r(this,o,y).call(this,e)):[],this.requestRender()}get sort(){return c(this,p).sort?{...c(this,p).sort}:null}set sort(t){c(this,p).sort=r(this,o,le).call(this,t),this.requestRender()}get page(){return c(this,p).page?{...c(this,p).page}:null}set page(t){c(this,p).page=r(this,o,dt).call(this,t),this.requestRender()}get density(){return this.readString("density","md")}set density(t){const e=t==="sm"||t==="lg"?t:"md";this.reflectString("density",e==="md"?null:e)}get stickyHeader(){return this.readBoolean("sticky-header")}set stickyHeader(t){this.reflectBoolean("sticky-header",!!t)}get loading(){return this.readBoolean("loading")}set loading(t){this.reflectBoolean("loading",!!t)}get caption(){return this.readString("caption","")}set caption(t){this.reflectString("caption",t)}get selectedRows(){const t=new Set(c(this,p).selected);return this.rows.filter((e,n)=>t.has(r(this,o,K).call(this,e,n)))}selectAll(){if(this.selectable!=="multiple")return;const t=new Set(c(this,v).map(e=>e.rowId));c(this,p).selected=r(this,o,ae).call(this,t),this.requestRender()}clearSelection(){c(this,p).selected=[],C(this,N,-1),this.requestRender()}sortBy(t,e,n={}){const s=r(this,o,le).call(this,{id:t,dir:e});c(this,p).sort=s,this.requestRender(),n.emitEvent&&s&&S(this,"rowan-sort",{id:s.id,dir:s.dir})}render(){c(this,X)||(this.renderRoot.innerHTML=`
        <div class="wrapper">
          <div class="toolbar" part="toolbar"><slot name="toolbar"></slot></div>
          <table class="table" part="table" aria-busy="false">
            <caption class="caption" part="caption">
              <slot name="caption"></slot>
              <span class="caption-text"></span>
            </caption>
            <thead class="thead" part="thead">
              <tr part="tr"></tr>
            </thead>
            <tbody class="tbody" part="tbody"></tbody>
          </table>
          <div class="footer" part="footer">
            <slot name="footer"></slot>
            <div class="pagination" part="pagination" hidden>
              <button class="page-button" type="button" data-action="prev-page">Previous</button>
              <span class="page-status"></span>
              <button class="page-button" type="button" data-action="next-page">Next</button>
            </div>
          </div>
        </div>
      `,C(this,X,this.renderRoot.firstElementChild),C(this,z,this.renderRoot.querySelector('caption slot[name="caption"]')),C(this,T,this.renderRoot.querySelector(".caption-text")),C(this,E,this.renderRoot.querySelector("thead tr")),C(this,L,this.renderRoot.querySelector("tbody")),C(this,W,this.renderRoot.querySelector(".pagination")),C(this,O,this.renderRoot.querySelector(".page-status")),C(this,Z,this.renderRoot.querySelector('[data-action="prev-page"]')),C(this,R,this.renderRoot.querySelector('[data-action="next-page"]')),this.listen(c(this,Z),"click",()=>{var n;r(this,o,de).call(this,(((n=this.page)==null?void 0:n.index)??0)-1)}),this.listen(c(this,R),"click",()=>{var n;r(this,o,de).call(this,(((n=this.page)==null?void 0:n.index)??0)+1)})),r(this,o,ut).call(this);const t=r(this,o,it).call(this);C(this,v,t.rows),r(this,o,Xe).call(this),r(this,o,He).call(this,t.rows),r(this,o,mt).call(this,t.pageInfo),this.renderRoot.querySelector("table").setAttribute("aria-busy",this.loading?"true":"false"),r(this,o,Me).call(this)}}p=new WeakMap,X=new WeakMap,z=new WeakMap,T=new WeakMap,E=new WeakMap,L=new WeakMap,W=new WeakMap,O=new WeakMap,Z=new WeakMap,R=new WeakMap,v=new WeakMap,N=new WeakMap,o=new WeakSet,Me=function(){const t=this.querySelector('[slot="caption"]')!==null;if(c(this,z).hidden=!t,t){c(this,T).hidden=!0,c(this,T).textContent="";return}const e=this.caption.trim();c(this,T).hidden=e.length===0,c(this,T).textContent=e},Xe=function(){c(this,E).textContent="",this.selectable!=="none"&&c(this,E).append(r(this,o,ze).call(this));for(const t of this.columns){if(!t||t.hidden)continue;const e=document.createElement("th");if(e.className="th",e.part="th",e.scope="col",e.dataset.columnId=r(this,o,y).call(this,t.id),t.sortable){const n=r(this,o,ce).call(this,t);e.setAttribute("aria-sort",n==="asc"?"ascending":n==="desc"?"descending":"none");const s=document.createElement("button");s.type="button",s.className="sort-button",s.part="sort-button";const l=document.createElement("span");l.textContent=t.header??"";const d=document.createElement("span");d.className="sort-indicator",d.textContent=n==="asc"?"↑":n==="desc"?"↓":"↕",s.append(l,d),s.addEventListener("click",()=>{const m=r(this,o,ct).call(this,t);this.sortBy(t.id,m,{emitEvent:!0})}),e.append(s)}else e.textContent=t.header??"";t.width&&(e.style.width=t.width),t.minWidth&&(e.style.minWidth=t.minWidth),t.align&&(e.style.textAlign=r(this,o,pe).call(this,t.align)),t.sticky==="start"&&e.classList.add("sticky-start"),t.sticky==="end"&&e.classList.add("sticky-end"),c(this,E).append(e)}},ze=function(){const t=document.createElement("th");if(t.className="th select-column",t.part="th",t.scope="col",t.dataset.columnId=he,this.selectable!=="multiple")return t;const e=document.createElement("rowan-checkbox");e.setAttribute("aria-label","Select all rows");const n=new Set(c(this,p).selected),s=c(this,v).filter(l=>n.has(l.rowId)).length;return e.checked=c(this,v).length>0&&s===c(this,v).length,e.indeterminate=s>0&&s<c(this,v).length,e.addEventListener("rowan-change",()=>{e.checked?this.selectAll():this.clearSelection(),S(this,"rowan-select",{selected:[...c(this,p).selected],row:null,selectedRows:this.selectedRows})}),t.append(e),t},He=function(t){if(c(this,L).textContent="",this.loading){r(this,o,_e).call(this);return}if(!t.length){r(this,o,De).call(this);return}for(const e of t){const n=document.createElement("tr");n.part="tr",n.dataset.rowId=e.rowId,n.tabIndex=0,n.addEventListener("dblclick",()=>{S(this,"rowan-row-activate",{rowId:e.rowId,row:e.row})}),n.addEventListener("keydown",s=>{if(s.key==="Enter"){S(this,"rowan-row-activate",{rowId:e.rowId,row:e.row});return}if((s.key===" "||s.key==="Spacebar")&&this.selectable!=="none"){s.preventDefault();const l=!c(this,p).selected.includes(e.rowId);r(this,o,ie).call(this,e,l,{shiftKey:s.shiftKey})}}),this.selectable!=="none"&&n.append(r(this,o,je).call(this,e)),this.columns.forEach(s=>{if(!s||s.hidden)return;const l=document.createElement("td");l.className="td",l.part="td",l.dataset.columnId=s.id,s.align&&(l.style.textAlign=r(this,o,pe).call(this,s.align)),s.sticky==="start"&&l.classList.add("sticky-start"),s.sticky==="end"&&l.classList.add("sticky-end");const d=r(this,o,ee).call(this,e.row,e.rowIndex,s);r(this,o,Ue).call(this,l,{row:e.row,rowIndex:e.rowIndex,rowId:e.rowId,column:s,value:d}),n.append(l)}),c(this,L).append(n)}},je=function(t){const e=document.createElement("td");e.className="td select-column",e.part="td",e.dataset.columnId=he;const n=document.createElement("rowan-checkbox");n.setAttribute("aria-label",`Select row ${t.rowId}`),n.checked=c(this,p).selected.includes(t.rowId);let s=!1;return n.addEventListener("click",l=>{s=l.shiftKey}),n.addEventListener("rowan-change",()=>{r(this,o,ie).call(this,t,n.checked,{shiftKey:s}),s=!1}),e.append(n),e},_e=function(){const t=document.createElement("tr");t.className="loading-row",t.part="tr";const e=document.createElement("td");e.className="td",e.part="td",e.colSpan=r(this,o,me).call(this),e.textContent="Loading...",t.append(e),c(this,L).append(t)},De=function(){const t=document.createElement("tr");t.part="tr";const e=document.createElement("td");if(e.className="td empty",e.part="td",e.colSpan=r(this,o,me).call(this),this.querySelector('[slot="empty"]')){const s=document.createElement("slot");s.name="empty",e.append(s)}else{const s=document.createElement("rowan-empty-state");s.textContent="No data available.",e.append(s)}t.append(e),c(this,L).append(t)},Ue=function(t,e){switch(r(this,o,ht).call(this,e.column)){case"number":r(this,o,Pe).call(this,t,e);return;case"date":r(this,o,Ve).call(this,t,e);return;case"link":r(this,o,Je).call(this,t,e);return;case"badge":r(this,o,Qe).call(this,t,e);return;case"checkbox":r(this,o,qe).call(this,t,e);return;case"switch":r(this,o,$e).call(this,t,e);return;case"button":r(this,o,et).call(this,t,e);return;case"icon-button":r(this,o,tt).call(this,t,e);return;case"avatar":r(this,o,nt).call(this,t,e);return;case"chip":r(this,o,ot).call(this,t,e);return;case"progress":r(this,o,st).call(this,t,e);return;case"custom":r(this,o,rt).call(this,t,e);return;default:r(this,o,A).call(this,t,e)}},A=function(t,e){t.dataset.cellType="text";const n=r(this,o,bt).call(this,e.column,e.value,e.row,e.rowIndex);t.textContent=n},Pe=function(t,e){t.dataset.cellType="number";const n=e.value;if(typeof n=="number"&&Number.isFinite(n)){t.textContent=new Intl.NumberFormat().format(n);return}r(this,o,A).call(this,t,e)},Ve=function(t,e){t.dataset.cellType="date";const n=e.value,s=n instanceof Date?n:new Date(n);if(!Number.isNaN(s.getTime())){t.textContent=new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(s);return}r(this,o,A).call(this,t,e)},Je=function(t,e){const n=document.createElement("a");n.part="link",n.className="link",n.dataset.cellType="link";const s=r(this,o,g).call(this,e.column,"href",e.value,e.row);n.href=r(this,o,gt).call(this,s);const l=r(this,o,g).call(this,e.column,"target",e.value,e.row);typeof l=="string"&&l.length>0&&(n.target=l,l==="_blank"&&(n.rel="noopener noreferrer"));const d=r(this,o,g).call(this,e.column,"label",e.value,e.row);n.textContent=r(this,o,y).call(this,d??e.value),n.addEventListener("click",m=>{m.preventDefault(),r(this,o,x).call(this,e,"link",m)}),t.append(n)},Qe=function(t,e){const n=document.createElement("rowan-badge");n.dataset.cellType="badge";const s=r(this,o,g).call(this,e.column,"tone",e.value,e.row);typeof s=="string"&&s.length>0&&s!=="info"&&n.setAttribute("tone",s);const l=r(this,o,g).call(this,e.column,"label",e.value,e.row);n.textContent=r(this,o,y).call(this,l??e.value),t.append(n)},qe=function(t,e){const n=document.createElement("rowan-checkbox");n.dataset.cellType="checkbox",n.setAttribute("aria-label",e.column.header||e.column.id||"checkbox");const s=r(this,o,g).call(this,e.column,"checked",e.value,e.row);n.checked=!!(s??e.value);const l=r(this,o,g).call(this,e.column,"disabled",e.value,e.row);n.disabled=!!l,n.addEventListener("rowan-change",()=>{r(this,o,re).call(this,e,n.checked)}),t.append(n)},$e=function(t,e){const n=customElements.get("rowan-switch")?document.createElement("rowan-switch"):document.createElement("rowan-checkbox");n.dataset.cellType="switch",n.setAttribute("aria-label",e.column.header||e.column.id||"switch");const s=r(this,o,g).call(this,e.column,"checked",e.value,e.row);n.checked=!!(s??e.value);const l=r(this,o,g).call(this,e.column,"disabled",e.value,e.row);n.disabled=!!l;let d=!1;const m=()=>{d||(d=!0,queueMicrotask(()=>{d=!1}),r(this,o,re).call(this,e,!!n.checked))};n.addEventListener("rowan-change",m),n.addEventListener("change",m),t.append(n)},et=function(t,e){const n=document.createElement("rowan-button");n.dataset.cellType="button";const s=r(this,o,g).call(this,e.column,"variant",e.value,e.row);typeof s=="string"&&s.length>0&&s!=="primary"&&n.setAttribute("variant",s);const l=r(this,o,g).call(this,e.column,"label",e.value,e.row);n.textContent=r(this,o,y).call(this,l??e.value??"Action");const d=r(this,o,g).call(this,e.column,"disabled",e.value,e.row);n.disabled=!!d,n.addEventListener("rowan-click",m=>{r(this,o,x).call(this,e,"button",m)}),t.append(n)},tt=function(t,e){const n=customElements.get("rowan-icon-button"),s=n?document.createElement("rowan-icon-button"):document.createElement("rowan-button");s.dataset.cellType="icon-button";const l=r(this,o,g).call(this,e.column,"label",e.value,e.row),d=r(this,o,g).call(this,e.column,"icon",e.value,e.row),m=r(this,o,y).call(this,d||"•");if(n){l&&s.setAttribute("label",r(this,o,y).call(this,l)),s.textContent=m;const h=r(this,o,g).call(this,e.column,"disabled",e.value,e.row);s.disabled=!!h,s.addEventListener("rowan-click",u=>{r(this,o,x).call(this,e,"icon-button",u)})}else{s.variant="ghost",s.textContent=m,l&&s.setAttribute("aria-label",r(this,o,y).call(this,l));const h=r(this,o,g).call(this,e.column,"disabled",e.value,e.row);s.disabled=!!h,s.classList.add("icon-button-fallback"),s.addEventListener("rowan-click",u=>{r(this,o,x).call(this,e,"icon-button",u)})}t.append(s)},nt=function(t,e){const n=customElements.get("rowan-avatar")?document.createElement("rowan-avatar"):document.createElement("span");n.dataset.cellType="avatar";const s=r(this,o,g).call(this,e.column,"label",e.value,e.row),l=r(this,o,y).call(this,s??e.value);n.tagName==="SPAN"?(n.className="avatar-fallback",n.textContent=l.slice(0,2).toUpperCase(),n.title=l):n.textContent=l,t.append(n)},ot=function(t,e){const n=customElements.get("rowan-chip")?document.createElement("rowan-chip"):document.createElement("rowan-badge");n.dataset.cellType="chip";const s=r(this,o,g).call(this,e.column,"tone",e.value,e.row);typeof s=="string"&&s.length>0&&s!=="info"&&n.setAttribute("tone",s);const l=r(this,o,g).call(this,e.column,"label",e.value,e.row);n.textContent=r(this,o,y).call(this,l??e.value),t.append(n)},st=function(t,e){const n=customElements.get("rowan-progress")?document.createElement("rowan-progress"):document.createElement("progress");n.dataset.cellType="progress";const s=Number(e.value),l=Number.isFinite(s)?Math.max(0,Math.min(100,s)):0;n.tagName==="PROGRESS"?(n.className="progress-fallback",n.max=100,n.value=l,n.title=`${l}%`):n.value=l,t.append(n)},rt=function(t,e){var h,u,b,I;t.dataset.cellType="custom";const n=(u=(h=e.column)==null?void 0:h.cell)==null?void 0:u.render;if(typeof n=="function"){const w=n({value:e.value,row:e.row,rowIndex:e.rowIndex,column:e.column,cellEl:t});w instanceof Node?t.append(w):typeof w=="string"&&(t.textContent=w);return}const s=(I=(b=e.column)==null?void 0:b.cell)==null?void 0:I.slot;if(typeof s!="string"||s.length===0){r(this,o,A).call(this,t,e);return}const l=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(s):s.replaceAll('"','\\"'),d=this.querySelector(`template[slot="${l}"]`);if(d instanceof HTMLTemplateElement){const w=d.content.cloneNode(!0),ne=w.querySelectorAll("*");for(const Y of ne)Y instanceof HTMLElement&&(Y.dataset.rowId=e.rowId,Y.dataset.columnId=r(this,o,y).call(this,e.column.id));t.append(w);return}const m=this.querySelector(`[slot="${l}"]`);if(m instanceof HTMLElement){const w=m.cloneNode(!0);w instanceof HTMLElement&&(w.removeAttribute("slot"),w.dataset.rowId=e.rowId,w.dataset.columnId=r(this,o,y).call(this,e.column.id)),t.append(w);return}r(this,o,A).call(this,t,e)},re=function(t,e){S(this,"rowan-cell-change",{rowId:t.rowId,columnId:t.column.id,value:e,row:t.row})},x=function(t,e,n){S(this,"rowan-cell-action",{rowId:t.rowId,columnId:t.column.id,action:e,row:t.row,nativeEvent:n})},ie=function(t,e,n={}){if(this.selectable==="none")return;const s=new Set(c(this,p).selected),l=!!n.shiftKey,d=t.visibleIndex;if(this.selectable==="single")e?(s.clear(),s.add(t.rowId)):s.delete(t.rowId);else if(l&&c(this,N)>=0){const m=Math.min(c(this,N),d),h=Math.max(c(this,N),d);for(let u=m;u<=h;u+=1){const b=c(this,v)[u];b&&(e?s.add(b.rowId):s.delete(b.rowId))}}else e?s.add(t.rowId):s.delete(t.rowId);C(this,N,d),c(this,p).selected=r(this,o,ae).call(this,s),this.requestRender(),S(this,"rowan-select",{selected:[...c(this,p).selected],row:t.row,selectedRows:this.selectedRows})},ae=function(t){return this.rows.map((e,n)=>r(this,o,K).call(this,e,n)).filter(e=>t.has(e))},it=function(){const t=this.rows.map((d,m)=>({row:d,rowIndex:m,rowId:r(this,o,K).call(this,d,m)})),e=r(this,o,at).call(this,t),n=r(this,o,pt).call(this,e.length);return{rows:(n?e.slice(n.start,n.end):e).map((d,m)=>({...d,visibleIndex:m})),pageInfo:n}},at=function(t){const e=c(this,p).sort;if(!e)return t;const n=this.columns.find(d=>d&&d.id===e.id);if(!n)return t;const s=e.dir==="desc"?-1:1,l=[...t];return l.sort((d,m)=>{const h=r(this,o,ee).call(this,d.row,d.rowIndex,n),u=r(this,o,ee).call(this,m.row,m.rowIndex,n),b=r(this,o,lt).call(this,h,u,n.type);return b===0?d.rowIndex-m.rowIndex:b*s}),l},lt=function(t,e,n){if(t==null&&e==null)return 0;if(t==null)return 1;if(e==null)return-1;if(n==="number"){const s=Number(t),l=Number(e);if(Number.isFinite(s)&&Number.isFinite(l))return s-l}if(n==="date"){const s=new Date(t),l=new Date(e);if(!Number.isNaN(s.getTime())&&!Number.isNaN(l.getTime()))return s.getTime()-l.getTime()}return typeof t=="number"&&typeof e=="number"?t-e:r(this,o,y).call(this,t).localeCompare(r(this,o,y).call(this,e),void 0,{numeric:!0,sensitivity:"base"})},le=function(t){return!t||typeof t!="object"||typeof t.id!="string"||t.id.length===0||!be.has(t.dir)?null:{id:t.id,dir:t.dir}},ce=function(t){var e;return((e=c(this,p).sort)==null?void 0:e.id)===t.id?c(this,p).sort.dir:be.has(t.sortDir)?t.sortDir:null},ct=function(t){return r(this,o,ce).call(this,t)==="asc"?"desc":"asc"},dt=function(t){if(!t||typeof t!="object")return null;const e=Math.max(1,Number(t.size)||1),s={index:Math.max(0,Number(t.index)||0),size:e};return t.total!=null&&Number.isFinite(Number(t.total))&&(s.total=Math.max(0,Number(t.total))),s},pt=function(t){const e=c(this,p).page;if(!e)return null;const n=Math.max(1,e.size),s=e.total??t,l=Math.max(1,Math.ceil(s/n)),d=Math.min(Math.max(0,e.index),l-1),m=Math.min(d*n,t),h=Math.min(m+n,t);return{index:d,size:n,total:s,totalPages:l,start:m,end:h}},mt=function(t){if(!c(this,p).page||!t){c(this,W).hidden=!0,c(this,O).textContent="";return}if(c(this,W).hidden=!1,t.total===0)c(this,O).textContent="No rows";else{const e=t.start+1,n=Math.min(t.start+t.size,t.total);c(this,O).textContent=`Showing ${e}-${n} of ${t.total}`}c(this,Z).disabled=t.index<=0,c(this,R).disabled=t.index>=t.totalPages-1},de=function(t){if(!c(this,p).page)return;const e=c(this,p).page.size,n=c(this,p).page.total??this.rows.length,s=Math.max(1,Math.ceil(n/e)),l=Math.min(Math.max(0,t),s-1);l!==c(this,p).page.index&&(c(this,p).page={...c(this,p).page,index:l},this.requestRender(),S(this,"rowan-page-change",{index:l,size:c(this,p).page.size}))},ut=function(){if(!c(this,p).selected.length)return;const t=new Set(this.rows.map((e,n)=>r(this,o,K).call(this,e,n)));c(this,p).selected=c(this,p).selected.filter(e=>t.has(e))},ee=function(t,e,n){return typeof n.accessor=="function"?n.accessor(t,e):typeof n.accessor=="string"?t==null?void 0:t[n.accessor]:t==null?void 0:t[n.id]},ht=function(t){var n;const e=((n=t==null?void 0:t.cell)==null?void 0:n.type)??(t==null?void 0:t.type)??"text";return Lt.has(e)?e:"text"},g=function(t,e,n,s){var d;const l=(d=t==null?void 0:t.cell)==null?void 0:d[e];return typeof l=="function"?l(n,s):l},bt=function(t,e,n,s){return typeof t.format=="function"?r(this,o,y).call(this,t.format(e,n,s)):r(this,o,y).call(this,e)},y=function(t){return t==null?"":String(t)},K=function(t,e){const n=c(this,p).rowId;if(typeof n=="function"){const s=n(t,e);return r(this,o,y).call(this,s||e)}return typeof n=="string"&&t&&t[n]!=null?r(this,o,y).call(this,t[n]):r(this,o,y).call(this,e)},gt=function(t){if(typeof t!="string")return"#";const e=t.trim();if(e.length===0||e.toLowerCase().startsWith("javascript:"))return"#";try{const s=new URL(e,window.location.origin);if(["http:","https:","mailto:","tel:"].includes(s.protocol))return s.toString();if(!e.includes(":"))return e}catch{if(e.startsWith("/")||e.startsWith("#"))return e}return"#"},pe=function(t){return t==="center"?"center":t==="end"?"right":"left"},me=function(){const t=this.columns.filter(n=>n&&!n.hidden).length,e=this.selectable==="none"?0:1;return Math.max(1,t+e)},D($,"styleUrl",new URL("data:text/css;base64,Omhvc3QgewogIGRpc3BsYXk6IGJsb2NrOwp9Cgo6aG9zdChbaGlkZGVuXSkgewogIGRpc3BsYXk6IG5vbmU7Cn0KCi53cmFwcGVyIHsKICBkaXNwbGF5OiBncmlkOwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtMyk7Cn0KCi50b29sYmFyLAouZm9vdGVyIHsKICBkaXNwbGF5OiBibG9jazsKfQoKLnRhYmxlIHsKICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlOwogIGJvcmRlci1zcGFjaW5nOiAwOwogIGJvcmRlcjogdmFyKC0tcm93YW4tYm9yZGVyLXdpZHRoKSBzb2xpZCB2YXIoLS1yb3dhbi1jb2xvci1ib3JkZXIpOwogIGJvcmRlci1yYWRpdXM6IHZhcigtLXJvd2FuLXJhZGl1cy1sZyk7CiAgb3ZlcmZsb3c6IGhpZGRlbjsKICB3aWR0aDogMTAwJTsKfQoKLmNhcHRpb24gewogIGJhY2tncm91bmQ6IHZhcigtLXJvd2FuLWNvbG9yLWJnKTsKICBjb2xvcjogdmFyKC0tcm93YW4tY29sb3ItZmcpOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1yb3dhbi1mb250LWZhbWlseSk7CiAgZm9udC1zaXplOiB2YXIoLS1yb3dhbi1mb250LXNpemUtc20pOwogIGZvbnQtd2VpZ2h0OiA2MDA7CiAgcGFkZGluZzogdmFyKC0tcm93YW4tc3BhY2UtMykgdmFyKC0tcm93YW4tc3BhY2UtNCk7CiAgdGV4dC1hbGlnbjogbGVmdDsKfQoKLmNhcHRpb24tdGV4dFtoaWRkZW5dIHsKICBkaXNwbGF5OiBub25lOwp9Cgo6aG9zdCg6bm90KFtjYXB0aW9uXSkpIC5jYXB0aW9uOmVtcHR5IHsKICBkaXNwbGF5OiBub25lOwp9CgoudGhlYWQgewogIGJhY2tncm91bmQ6ICNmM2Y1ZjE7Cn0KCi50aCwKLnRkIHsKICBib3JkZXItYm90dG9tOiB2YXIoLS1yb3dhbi1ib3JkZXItd2lkdGgpIHNvbGlkIHZhcigtLXJvd2FuLWNvbG9yLWJvcmRlcik7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLWZnKTsKICBmb250LWZhbWlseTogdmFyKC0tcm93YW4tZm9udC1mYW1pbHkpOwogIGZvbnQtc2l6ZTogdmFyKC0tcm93YW4tZm9udC1zaXplLW1kKTsKICBsaW5lLWhlaWdodDogdmFyKC0tcm93YW4tbGluZS1oZWlnaHQpOwogIHBhZGRpbmc6IHZhcigtLXJvd2FuLXNwYWNlLTMpIHZhcigtLXJvd2FuLXNwYWNlLTQpOwogIHRleHQtYWxpZ246IGxlZnQ7CiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTsKfQoKLnRoIHsKICBmb250LXNpemU6IHZhcigtLXJvd2FuLWZvbnQtc2l6ZS1zbSk7CiAgZm9udC13ZWlnaHQ6IDYwMDsKfQoKLnNlbGVjdC1jb2x1bW4gewogIGlubGluZS1zaXplOiAzcmVtOwogIHRleHQtYWxpZ246IGNlbnRlcjsKICB3aGl0ZS1zcGFjZTogbm93cmFwOwp9Cgouc29ydC1idXR0b24gewogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGNvbG9yOiBpbmhlcml0OwogIGN1cnNvcjogcG9pbnRlcjsKICBkaXNwbGF5OiBpbmxpbmUtZmxleDsKICBmb250OiBpbmhlcml0OwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtMik7CiAgcGFkZGluZzogMDsKfQoKLnNvcnQtYnV0dG9uOmZvY3VzLXZpc2libGUgewogIGJveC1zaGFkb3c6IHZhcigtLXJvd2FuLWZvY3VzLXJpbmcpOwogIG91dGxpbmU6IG5vbmU7Cn0KCi5zb3J0LWluZGljYXRvciB7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLW11dGVkKTsKICBmb250LXNpemU6IHZhcigtLXJvd2FuLWZvbnQtc2l6ZS14cyk7CiAgaW5saW5lLXNpemU6IDFlbTsKICB0ZXh0LWFsaWduOiBjZW50ZXI7Cn0KCi50Ym9keSB0cjpsYXN0LWNoaWxkIC50ZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQoKLnRib2R5IHRyOmZvY3VzLXZpc2libGUgewogIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCB2YXIoLS1yb3dhbi1jb2xvci1hY2NlbnQpOwogIG91dGxpbmU6IG5vbmU7Cn0KCjpob3N0KFtkZW5zaXR5PSJzbSJdKSAudGgsCjpob3N0KFtkZW5zaXR5PSJzbSJdKSAudGQgewogIHBhZGRpbmc6IHZhcigtLXJvd2FuLXNwYWNlLTIpIHZhcigtLXJvd2FuLXNwYWNlLTMpOwp9Cgo6aG9zdChbZGVuc2l0eT0ibGciXSkgLnRoLAo6aG9zdChbZGVuc2l0eT0ibGciXSkgLnRkIHsKICBwYWRkaW5nOiB2YXIoLS1yb3dhbi1zcGFjZS00KSB2YXIoLS1yb3dhbi1zcGFjZS01KTsKfQoKOmhvc3QoW3N0aWNreS1oZWFkZXJdKSAudGhlYWQgewogIGluc2V0LWJsb2NrLXN0YXJ0OiAwOwogIHBvc2l0aW9uOiBzdGlja3k7CiAgei1pbmRleDogMTsKfQoKLmxpbmsgewogIGNvbG9yOiB2YXIoLS1yb3dhbi1jb2xvci1hY2NlbnQpOwogIHRleHQtZGVjb3JhdGlvbjogbm9uZTsKfQoKLmxpbms6Zm9jdXMtdmlzaWJsZSB7CiAgYm94LXNoYWRvdzogdmFyKC0tcm93YW4tZm9jdXMtcmluZyk7CiAgb3V0bGluZTogbm9uZTsKfQoKLnN0aWNreS1zdGFydCB7CiAgYmFja2dyb3VuZDogdmFyKC0tcm93YW4tY29sb3ItYmcpOwogIGluc2V0LWlubGluZS1zdGFydDogMDsKICBwb3NpdGlvbjogc3RpY2t5OwogIHotaW5kZXg6IDI7Cn0KCi5zdGlja3ktZW5kIHsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1jb2xvci1iZyk7CiAgaW5zZXQtaW5saW5lLWVuZDogMDsKICBwb3NpdGlvbjogc3RpY2t5OwogIHotaW5kZXg6IDI7Cn0KCi5wYWdpbmF0aW9uIHsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGdhcDogdmFyKC0tcm93YW4tc3BhY2UtMik7CiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDsKICB3aWR0aDogMTAwJTsKfQoKLnBhZ2UtYnV0dG9uIHsKICBiYWNrZ3JvdW5kOiB2YXIoLS1yb3dhbi1jb2xvci1iZyk7CiAgYm9yZGVyOiB2YXIoLS1yb3dhbi1ib3JkZXItd2lkdGgpIHNvbGlkIHZhcigtLXJvd2FuLWNvbG9yLWJvcmRlcik7CiAgYm9yZGVyLXJhZGl1czogdmFyKC0tcm93YW4tcmFkaXVzLW1kKTsKICBjb2xvcjogdmFyKC0tcm93YW4tY29sb3ItZmcpOwogIGN1cnNvcjogcG9pbnRlcjsKICBmb250LWZhbWlseTogdmFyKC0tcm93YW4tZm9udC1mYW1pbHkpOwogIGZvbnQtc2l6ZTogdmFyKC0tcm93YW4tZm9udC1zaXplLXNtKTsKICBwYWRkaW5nOiB2YXIoLS1yb3dhbi1zcGFjZS0xKSB2YXIoLS1yb3dhbi1zcGFjZS0zKTsKfQoKLnBhZ2UtYnV0dG9uOmRpc2FibGVkIHsKICBjdXJzb3I6IG5vdC1hbGxvd2VkOwogIG9wYWNpdHk6IDAuNjsKfQoKLnBhZ2Utc3RhdHVzIHsKICBjb2xvcjogdmFyKC0tcm93YW4tY29sb3ItbXV0ZWQpOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1yb3dhbi1mb250LWZhbWlseSk7CiAgZm9udC1zaXplOiB2YXIoLS1yb3dhbi1mb250LXNpemUtc20pOwogIG1pbi1pbmxpbmUtc2l6ZTogMTByZW07CiAgdGV4dC1hbGlnbjogY2VudGVyOwp9CgouYXZhdGFyLWZhbGxiYWNrIHsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGJhY2tncm91bmQ6ICNkY2U0ZDk7CiAgYm9yZGVyLXJhZGl1czogOTk5cHg7CiAgY29sb3I6ICMyYTNhMmQ7CiAgZGlzcGxheTogaW5saW5lLWZsZXg7CiAgZm9udC1zaXplOiB2YXIoLS1yb3dhbi1mb250LXNpemUteHMpOwogIGZvbnQtd2VpZ2h0OiA3MDA7CiAgaW5saW5lLXNpemU6IDEuOXJlbTsKICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsKICBtaW4tYmxvY2stc2l6ZTogMS45cmVtOwp9CgoucHJvZ3Jlc3MtZmFsbGJhY2sgewogIGFjY2VudC1jb2xvcjogdmFyKC0tcm93YW4tY29sb3ItYWNjZW50KTsKICBpbmxpbmUtc2l6ZTogbWluKDEwcmVtLCAxMDAlKTsKfQoKLmxvYWRpbmctcm93IC50ZCB7CiAgY29sb3I6IHZhcigtLXJvd2FuLWNvbG9yLW11dGVkKTsKfQoKLmVtcHR5IHsKICBjb2xvcjogdmFyKC0tcm93YW4tY29sb3ItbXV0ZWQpOwogIGZvbnQtc3R5bGU6IGl0YWxpYzsKfQo=",import.meta.url).href),D($,"observedAttributes",["selectable","density","sticky-header","loading","caption"]),D($,"upgradeProperties",["config","columns","rows","selectable","selected","sort","page","density","stickyHeader","loading","caption"]);Tt("rowan-table",$);const F=["none","single","multiple"],B=["sm","md","lg"],U=["info","success","warning","danger"],Nt=[{id:"name",header:"Name",type:"link",sortable:!0,cell:{href:(i,a)=>`/users/${a.id}`,label:i=>i}},{id:"role",header:"Role",type:"badge",cell:{tone:i=>i==="Admin"?"warning":"info"}},{id:"active",header:"Active",type:"switch",align:"center"},{id:"quota",header:"Quota",type:"progress"},{id:"edit",header:"",type:"icon-button",cell:{label:"Edit",icon:"edit"},width:"3rem"}],ge=[{id:"1",name:"Ada",role:"Admin",active:!0,quota:72},{id:"2",name:"Alan",role:"Editor",active:!1,quota:18}],ye=[{id:"1",name:"Trail Mix",price:"$10",status:"Live"},{id:"2",name:"Camp Mug",price:"$25",status:"Draft"}],we=[{id:"1",name:"Ada",score:11,joined:"2026-01-04"},{id:"2",name:"Alan",score:19,joined:"2026-03-11"},{id:"3",name:"Grace",score:7,joined:"2026-02-22"},{id:"4",name:"Linus",score:24,joined:"2026-04-17"},{id:"5",name:"Ken",score:15,joined:"2026-05-02"}],fe=[{id:"owner",header:"Owner",type:"avatar"},{id:"name",header:"Name",type:"text",sortable:!0},{id:"team",header:"Team",type:"chip"},{id:"score",header:"Score",type:"number",align:"end",sortable:!0},{id:"active",header:"Active",type:"switch",align:"center"}],Ce=[{id:"1",owner:"Ada",name:"Ada",team:"Platform",score:87,active:!0},{id:"2",owner:"Alan",name:"Alan",team:"Research",score:74,active:!1},{id:"3",owner:"Grace",name:"Grace",team:"Ops",score:92,active:!0}],kt=[{id:"name",header:"Name",type:"link",sortable:!0,cell:{href:(i,a)=>`/profiles/${a.id}`,label:(i,a)=>`${i} (${a.id})`}},{id:"role",header:"Role",type:"badge",cell:{tone:i=>i==="Admin"?"warning":"info"}},{id:"score",header:"Score",type:"number",sortable:!0},{id:"active",header:"Active",type:"switch",align:"center"}],Ie=[{id:"name",header:"Name",type:"link",sortable:!0,cell:{href:"/profiles",label:"Open"}},{id:"role",header:"Role",type:"badge",cell:{tone:"warning"}},{id:"score",header:"Score",type:"number",sortable:!0},{id:"active",header:"Active",type:"switch",align:"center"}],ve=[{id:"1",name:"Ada",role:"Admin",score:98,active:!0},{id:"2",name:"Alan",role:"Editor",score:77,active:!1},{id:"3",name:"Grace",role:"Editor",score:89,active:!0}],Se='<span class="price-pill" style="font-weight: 600; color: var(--rowan-color-accent)">Price</span>';function j(i){return i.map(a=>({...a}))}function yt(i){return i.map(a=>({...a,cell:a&&typeof a.cell=="object"&&!Array.isArray(a.cell)?{...a.cell}:a==null?void 0:a.cell,headerCell:a&&typeof a.headerCell=="object"&&!Array.isArray(a.headerCell)?{...a.headerCell}:a==null?void 0:a.headerCell}))}function _(i,a){return(Array.isArray(i)?i:a).filter(e=>e&&typeof e=="object"&&!Array.isArray(e)).map(e=>({...e}))}function wt(i,a){return(Array.isArray(i)?i:a).filter(e=>e&&typeof e=="object"&&!Array.isArray(e)).map((e,n)=>{const s=typeof e.id=="string"&&e.id.trim().length>0?e.id:`column-${n+1}`,l=typeof e.header=="string"&&e.header.trim().length>0?e.header:`Column ${n+1}`;return{...e,id:s,header:l,cell:e&&typeof e.cell=="object"&&!Array.isArray(e.cell)?{...e.cell}:e.cell,headerCell:e&&typeof e.headerCell=="object"&&!Array.isArray(e.headerCell)?{...e.headerCell}:e.headerCell}})}function se(i,a,t=0){const e=Number(i);return Number.isFinite(e)?Math.max(t,Math.trunc(e)):a}function k(i,a,t){return a.includes(i)?i:t}function Et(i,a){return typeof i!="string"?a:i.trim().length>0?i:a}function M(i){return JSON.stringify(i,(a,t)=>typeof t=="function"?t.toString():t,2)}function G(i,a){const t=document.createElement("details");t.open=!0,t.style.border="1px solid var(--rowan-color-border, #ced3ca)",t.style.borderRadius="8px",t.style.background="var(--rowan-color-bg, #ffffff)";const e=document.createElement("summary");e.textContent=i,e.style.cursor="pointer",e.style.fontWeight="600",e.style.padding="0.5rem 0.75rem",e.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)",e.style.fontSize="0.85rem";const n=document.createElement("pre");return n.textContent=a,n.style.margin="0",n.style.padding="0.75rem",n.style.overflow="auto",n.style.fontSize="0.75rem",n.style.lineHeight="1.45",n.style.fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",n.style.background="#f6f8f5",n.style.borderTop="1px solid var(--rowan-color-border, #ced3ca)",t.append(e,n),t}function ft(i){const a=document.createElement("p");return a.textContent=i,a.style.margin="0 0 1rem 0",a.style.padding="0.6rem 0.75rem",a.style.border="1px solid #e5cc8e",a.style.borderRadius="8px",a.style.background="#fff7e8",a.style.color="#6f4c00",a.style.fontSize="0.82rem",a.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)",a}function te({title:i,description:a,config:t,notice:e="",templateMarkup:n="",beforeAttach:s}){const l=document.createElement("rowan-table");typeof s=="function"&&s(l),l.config=t;const d=document.createElement("section");d.style.display="grid",d.style.gap="1rem",d.style.alignItems="start",d.style.gridTemplateColumns=window.matchMedia("(max-width: 1100px)").matches?"1fr":"minmax(0, 1.8fr) minmax(19rem, 1fr)";const m=document.createElement("div");m.style.padding="1rem",m.style.border="1px solid var(--rowan-color-border, #ced3ca)",m.style.borderRadius="10px",m.style.background="var(--rowan-color-bg, #ffffff)";const h=document.createElement("p");h.textContent=i,h.style.margin="0 0 0.375rem 0",h.style.fontWeight="700",h.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)";const u=document.createElement("p");u.textContent=a,u.style.margin="0 0 1rem 0",u.style.color="var(--rowan-color-muted, #5f6d62)",u.style.fontSize="0.9rem",u.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)",m.append(h,u),e&&m.append(ft(e)),m.append(l);const b=document.createElement("aside");b.style.display="grid",b.style.gap="0.75rem",b.style.alignContent="start";const{rows:I=[],...w}=t;return b.append(G("Config",M(w)),G("Rows",M(I))),n&&b.append(G("Cell Template Markup",n)),d.append(m,b),d}function Te(i,a,t){const e=document.createElement("article");e.style.padding="0.85rem",e.style.border="1px solid var(--rowan-color-border, #ced3ca)",e.style.borderRadius="8px",e.style.background="var(--rowan-color-bg, #ffffff)";const n=document.createElement("p");n.textContent=i,n.style.margin="0",n.style.fontWeight="700",n.style.fontSize="0.84rem",n.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)";const s=document.createElement("p");return s.textContent=a,s.style.margin="0.4rem 0 0.85rem 0",s.style.color="var(--rowan-color-muted, #5f6d62)",s.style.fontSize="0.8rem",s.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)",e.append(n,s,t),e}function Ot({title:i,description:a,notice:t,sourceConfig:e,controlsConfig:n}){const s=document.createElement("rowan-table");s.config=e;const l=document.createElement("rowan-table");l.config=n;const d=document.createElement("section");d.style.display="grid",d.style.gap="1rem",d.style.alignItems="start",d.style.gridTemplateColumns=window.matchMedia("(max-width: 1240px)").matches?"1fr":"minmax(0, 1.95fr) minmax(19rem, 1fr)";const m=document.createElement("div");m.style.padding="1rem",m.style.border="1px solid var(--rowan-color-border, #ced3ca)",m.style.borderRadius="10px",m.style.background="var(--rowan-color-bg, #ffffff)";const h=document.createElement("p");h.textContent=i,h.style.margin="0 0 0.375rem 0",h.style.fontWeight="700",h.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)";const u=document.createElement("p");u.textContent=a,u.style.margin="0 0 1rem 0",u.style.color="var(--rowan-color-muted, #5f6d62)",u.style.fontSize="0.9rem",u.style.fontFamily="var(--rowan-font-family, system-ui, sans-serif)";const b=document.createElement("div");b.style.display="grid",b.style.gap="0.8rem",b.style.gridTemplateColumns=window.matchMedia("(max-width: 980px)").matches?"1fr":"1fr 1fr",b.append(Te("Source-defined callbacks","Uses real function callbacks declared in this file.",s),Te("Controls-edited columns","Uses the object you edit in Controls.",l)),m.append(h,u,ft(t),b);const I=document.createElement("aside");I.style.display="grid",I.style.gap="0.75rem",I.style.alignContent="start";const{rows:w,...ne}=e,{rows:Y,...Ct}=n;return I.append(G("Source Config",M(ne)),G("Controls Config",M(Ct)),G("Rows",M(Y||[]))),d.append(m,I),d}const Ht={title:"Components/Table",tags:["autodocs"],parameters:{controls:{expanded:!0}}},P={parameters:H({steps:["Click the Name header to trigger sorting.","Toggle the first selection checkbox.","Toggle the Active switch and click the Edit icon button."],events:["rowan-sort","rowan-select","rowan-cell-change","rowan-cell-action"]}),args:{caption:"Team roster",selectable:"multiple",stickyHeader:!0,density:"md",rows:j(ge)},argTypes:{caption:{control:"text",description:"Caption shown above the table."},selectable:{control:"inline-radio",options:F,description:"Selection mode."},stickyHeader:{control:"boolean",description:"Pin table header while scrolling."},density:{control:"inline-radio",options:B,description:"Vertical spacing profile."},rows:{control:"object",description:"Editable row data for this story."}},render:i=>{const a=_(i.rows,ge),t={caption:i.caption,selectable:k(i.selectable,F,"multiple"),stickyHeader:!!i.stickyHeader,density:k(i.density,B,"md"),rowId:"id",columns:Nt,rows:a};return te({title:"Exact config mode",description:"Shows the Step 5 config-only setup, including sortable and selectable behavior.",config:t})}},V={parameters:H({steps:["Double-click a table row.","Focus a row and press Enter.","Observe row activation payload details in Event Trace."],events:["rowan-row-activate"]}),args:{liveTone:"success",draftTone:"warning",templateMarkup:Se,rows:j(ye)},argTypes:{liveTone:{control:"select",options:U,description:"Tone used when status is Live."},draftTone:{control:"select",options:U,description:"Tone used for any non-Live status."},templateMarkup:{control:"text",description:"HTML markup cloned for each custom slot cell."},rows:{control:"object",description:"Editable row data for custom cell rendering."}},render:i=>{const a=_(i.rows,ye),t=k(i.liveTone,U,"success"),e=k(i.draftTone,U,"warning"),n=Et(i.templateMarkup,Se);return te({title:"Custom slot cells",description:"Template slot configuration and source data are visible in the inspector panel.",config:{rowId:"id",columns:[{id:"name",header:"Name",type:"text"},{id:"price",header:"Price",type:"custom",cell:{slot:"price-cell"}},{id:"status",header:"Status",type:"chip",cell:{tone:l=>l==="Live"?t:e}}],rows:a},templateMarkup:n,beforeAttach:l=>{const d=document.createElement("template");d.slot="price-cell",d.innerHTML=n,l.append(d)}})}},J={parameters:H({steps:["Click Next page.","Click Previous page.","Confirm page index and size changes in Event Trace."],events:["rowan-page-change"]}),args:{caption:"Leaderboard",pageIndex:0,pageSize:2,pageTotal:5,rows:j(we)},argTypes:{caption:{control:"text",description:"Caption shown above the table."},pageIndex:{control:{type:"number",min:0,step:1},description:"Current page index."},pageSize:{control:{type:"number",min:1,step:1},description:"Rows per page."},pageTotal:{control:{type:"number",min:0,step:1},description:"Total rows available."},rows:{control:"object",description:"Editable row data for paged rendering."}},render:i=>{const a=_(i.rows,we),t=se(i.pageSize,2,1),e=se(i.pageTotal,a.length,0),n=Math.max(0,Math.ceil(Math.max(e,1)/t)-1),s=Math.min(se(i.pageIndex,0,0),n),l={caption:i.caption,rowId:"id",page:{index:s,size:t,total:e},columns:[{id:"name",header:"Name",type:"text"},{id:"score",header:"Score",type:"number",sortable:!0},{id:"joined",header:"Joined",type:"date"}],rows:a};return te({title:"Paged rows",description:"Pagination input and row data are shown beside the rendered table.",config:l})}},Q={parameters:H({steps:["Click the Score header to sort.","Toggle an Active switch cell.","Edit rows or columns in Controls and repeat interactions."],events:["rowan-sort","rowan-cell-change"]}),args:{caption:"Columns sandbox",selectable:"none",stickyHeader:!1,density:"md",columns:yt(fe),rows:j(Ce)},argTypes:{caption:{control:"text",description:"Caption shown above the table."},selectable:{control:"inline-radio",options:F,description:"Selection mode."},stickyHeader:{control:"boolean",description:"Pin table header while scrolling."},density:{control:"inline-radio",options:B,description:"Vertical spacing profile."},columns:{control:"object",description:"Full editable columns array."},rows:{control:"object",description:"Full editable rows array."}},render:i=>{const a={caption:i.caption,selectable:k(i.selectable,F,"none"),stickyHeader:!!i.stickyHeader,density:k(i.density,B,"md"),rowId:"id",columns:wt(i.columns,fe),rows:_(i.rows,Ce)};return te({title:"Columns object sandbox",description:"Edit the full columns and rows objects live using Storybook Controls.",notice:"Controls serialize functions as strings. Function-based fields such as cell.href callbacks will not execute when edited from Controls.",config:a})}},q={parameters:H({steps:["Click Name in either table to sort.","Click a name link and then toggle Active.","Edit the right-side columns object and compare emitted events and behavior."],events:["rowan-sort","rowan-cell-action","rowan-cell-change"]}),args:{caption:"Function comparison",selectable:"single",stickyHeader:!1,density:"md",columns:yt(Ie),rows:j(ve)},argTypes:{caption:{control:"text",description:"Caption for both tables."},selectable:{control:"inline-radio",options:F,description:"Selection mode for both tables."},stickyHeader:{control:"boolean",description:"Pin table headers while scrolling."},density:{control:"inline-radio",options:B,description:"Vertical spacing profile for both tables."},columns:{control:"object",description:"Editable columns object used by the right-hand table."},rows:{control:"object",description:"Editable rows object used by both tables."}},render:i=>{const a=_(i.rows,ve),t=k(i.selectable,F,"single"),e=k(i.density,B,"md"),n=!!i.stickyHeader,s={caption:`${i.caption} - source`,rowId:"id",selectable:t,stickyHeader:n,density:e,columns:kt,rows:a},l={caption:`${i.caption} - controls`,rowId:"id",selectable:t,stickyHeader:n,density:e,columns:wt(i.columns,Ie),rows:a};return Ot({title:"Function-capable columns vs Controls object",description:"Left table uses callback functions from source code. Right table uses the live object from Storybook Controls.",notice:"Function fields edited in Controls are serialized as strings, so callback-like text does not execute as JavaScript.",sourceConfig:s,controlsConfig:l})}};var Le,Ne,ke;P.parameters={...P.parameters,docs:{...(Le=P.parameters)==null?void 0:Le.docs,source:{originalSource:`{
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
}`,...(ke=(Ne=P.parameters)==null?void 0:Ne.docs)==null?void 0:ke.source}}};var Ee,Oe,Ae;V.parameters={...V.parameters,docs:{...(Ee=V.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
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
}`,...(Ae=(Oe=V.parameters)==null?void 0:Oe.docs)==null?void 0:Ae.source}}};var Ge,We,Ze;J.parameters={...J.parameters,docs:{...(Ge=J.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
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
}`,...(Ze=(We=J.parameters)==null?void 0:We.docs)==null?void 0:Ze.source}}};var Re,Fe,Be;Q.parameters={...Q.parameters,docs:{...(Re=Q.parameters)==null?void 0:Re.docs,source:{originalSource:`{
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
}`,...(Be=(Fe=Q.parameters)==null?void 0:Fe.docs)==null?void 0:Be.source}}};var Ye,xe,Ke;q.parameters={...q.parameters,docs:{...(Ye=q.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
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
}`,...(Ke=(xe=q.parameters)==null?void 0:xe.docs)==null?void 0:Ke.source}}};const jt=["ExactConfig","CustomSlotCell","Pagination","ColumnsSandbox","FunctionColumnsComparison"];export{Q as ColumnsSandbox,V as CustomSlotCell,P as ExactConfig,q as FunctionColumnsComparison,J as Pagination,jt as __namedExportsOrder,Ht as default};
