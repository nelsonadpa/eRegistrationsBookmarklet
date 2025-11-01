javascript:(function(){
  if(window.__formioKeysFinderRunning){try{document.getElementById('__fi_key_modal')?.remove();}catch(e){}}
  window.__formioKeysFinderRunning=Date.now();

  const HIGHLIGHT_CLASS='__fi_key_highlight';
  const MODAL_ID='__fi_key_modal';
  const GO_ACTIVE_CLASS='__fi_go_active';

  // Inyectar Font Awesome si no existe
  if (!document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]')) {
    const fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fa);
  }

  const styles=`
    .${HIGHLIGHT_CLASS}{box-shadow:0 0 0 3px rgba(255,200,0,.9)!important;border-radius:6px!important;position:relative;z-index:9999999!important}
    .${GO_ACTIVE_CLASS}{box-shadow:0 0 0 4px rgba(11,116,222,.9)!important;border-radius:6px!important;position:relative;z-index:10000001!important}
    #${MODAL_ID}{position:fixed;right:18px;top:18px;width:720px;max-height:85vh;overflow:auto;background:#fff;color:#111;border:1px solid #ddd;box-shadow:0 8px 30px rgba(0,0,0,.25);z-index:10000000;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;border-radius:8px}
    #${MODAL_ID} header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #eee;background:linear-gradient(to right,#f8f9fa,#fff)}
    #${MODAL_ID} .title{font-weight:600;font-size:14px}
    #${MODAL_ID} .count{color:#666;font-size:12px;margin-left:8px}
    #${MODAL_ID} .controls{padding:8px 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;border-bottom:1px solid #eee}
    #${MODAL_ID} button{padding:6px 10px;border-radius:6px;border:1px solid #bbb;background:#fafafa;cursor:pointer;transition:all .2s;font-size:12px}
    #${MODAL_ID} button:hover{background:#f0f0f0;transform:translateY(-1px)}
    #${MODAL_ID} button.primary{background:#0b74de;color:#fff;border-color:#0b74de}
    #${MODAL_ID} button.primary:hover{background:#0960b8}
    #${MODAL_ID} button.active{background:#e8f4fd;border-color:#0b74de;color:#0b74de}
    #${MODAL_ID} .filter-bar{padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;border-bottom:1px solid #eee;background:#f8f9fa}
    #${MODAL_ID} .filter-btn{padding:4px 8px;border-radius:16px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:11px;transition:all .2s}
    #${MODAL_ID} .filter-btn:hover{background:#f0f0f0}
    #${MODAL_ID} .filter-btn.active{background:#0b74de;color:#fff;border-color:#0b74de}
    #${MODAL_ID} .filter-btn .count{opacity:0.7;margin-left:3px}
    #${MODAL_ID} .stats-panel{padding:10px 12px;background:#f0f8ff;border-bottom:1px solid #ddd;display:none}
    #${MODAL_ID} .stats-panel.show{display:block}
    #${MODAL_ID} .stat-row{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}
    #${MODAL_ID} .stat-label{color:#666}
    #${MODAL_ID} .stat-value{font-weight:600;color:#333}
    #${MODAL_ID} .list{padding:8px 12px;max-height:50vh;overflow:auto}
    #${MODAL_ID} .group-header{display:flex;align-items:center;padding:8px 4px;background:#f8f9fa;border-radius:6px;margin:8px 0 4px 0;cursor:pointer;user-select:none}
    #${MODAL_ID} .group-header:hover{background:#e8f4fd}
    #${MODAL_ID} .group-toggle{margin-right:6px;transition:transform .2s}
    #${MODAL_ID} .group-toggle.collapsed{transform:rotate(-90deg)}
    #${MODAL_ID} .group-name{font-weight:600;flex:1}
    #${MODAL_ID} .group-count{color:#666;font-size:11px}
    #${MODAL_ID} .group-actions{display:flex;gap:6px}
    #${MODAL_ID} .group-action{color:#0b74de;font-size:11px;cursor:pointer;padding:2px 6px;border-radius:4px}
    #${MODAL_ID} .group-action:hover{background:#e8f4fd}
    #${MODAL_ID} .group-content{margin-left:20px}
    #${MODAL_ID} .group-content.collapsed{display:none}
    #${MODAL_ID} .keyrow{display:grid;grid-template-columns:28px 1fr 1fr 140px;gap:8px;align-items:center;padding:8px 4px;border-bottom:1px dashed #efefef;transition:background .2s}
    #${MODAL_ID} .keyrow:hover{background:#f8f9fa}
    #${MODAL_ID} .key-type i{font-size:14px;color:inherit}
    #${MODAL_ID} .key-column{display:flex;flex-direction:column;min-width:0}
    #${MODAL_ID} .keyname{font-weight:500;font-size:12px;color:#111;word-break:break-all;overflow:hidden;text-overflow:ellipsis}
    #${MODAL_ID} .key-badges{display:flex;gap:4px;margin-top:2px;flex-wrap:wrap}
    #${MODAL_ID} .badge{padding:1px 5px;border-radius:3px;font-size:10px;font-weight:600;white-space:nowrap}
    #${MODAL_ID} .badge.required{background:#fee;color:#c00}
    #${MODAL_ID} .badge.disabled{background:#f0f0f0;color:#666}
    #${MODAL_ID} .badge.filled{background:#efe;color:#080}
    #${MODAL_ID} .badge.dependent{background:#e8f4fd;color:#0b74de}
    #${MODAL_ID} .label-column{display:flex;flex-direction:column;min-width:0}
    #${MODAL_ID} .field-label{font-size:12px;color:#333;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #${MODAL_ID} .field-type-text{font-size:10px;color:#888;margin-top:2px}
    #${MODAL_ID} .actions{display:flex;align-items:center;gap:6px;justify-content:flex-end}
    #${MODAL_ID} .actionlink{color:#0b74de;cursor:pointer;font-size:11px;user-select:none;padding:3px 6px;border-radius:3px;white-space:nowrap}
    #${MODAL_ID} .actionlink:hover{background:#e8f4fd}
    #${MODAL_ID} footer{padding:8px 12px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#666;background:#f8f9fa}
    #${MODAL_ID} .controls input[type="search"]{flex:1;min-width:140px;padding:6px 8px;border:1px solid #bbb;border-radius:6px}
    #${MODAL_ID} .controls input[type="search"]::placeholder{color:#888}
    #${MODAL_ID} .view-toggle{display:flex;gap:4px;margin-left:auto}
    #${MODAL_ID} .view-btn{padding:4px 8px;border-radius:4px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:11px}
    #${MODAL_ID} .view-btn.active{background:#0b74de;color:#fff;border-color:#0b74de}
    #${MODAL_ID} .foundcount{margin-left:0!important;color:#666!important;font-size:10px!important}
  `;
  const styleTag=document.createElement('style');styleTag.id='__fi_style_inject';styleTag.textContent=styles;document.head.appendChild(styleTag);

  const s=v=>(v||'').toString().trim();

  // Iconos reales de Font Awesome (del builder)
  const TYPE_ICONS={
    textfield:'<i class="fa fa-terminal"></i>',
    button:'<i class="fa fa-stop"></i>',
    number:'<i class="fa fa-hashtag"></i>',
    currency:'<i class="far fa-usd-circle"></i>',
    datetime:'<i class="far fa-calendar-plus"></i>',
    textarea:'<i class="fa fa-font"></i>',
    checkbox:'<i class="fa fa-check-square"></i>',
    selectboxes:'<i class="fa fa-plus-square"></i>',
    select:'<i class="fas fa-server"></i>',
    mycontent:'<i class="fab fa-html5"></i>',
    content:'<i class="fab fa-html5"></i>',
    radio:'<i class="far fa-dot-circle"></i>',
    file:'<i class="fa fa-file"></i>',
    email:'<i class="fa fa-at"></i>',
    url:'<i class="fa fa-link"></i>',
    phoneNumber:'<i class="fa fa-phone-square"></i>',
    day:'<i class="fa fa-calendar"></i>',
    time:'<i class="fal fa-clock"></i>',
    htmlelement:'<i class="fa fa-code"></i>',
    resource:'<i class="far fa-file"></i>',
    form:'<i class="fab fa-wpforms"></i>',
    signature:'<i class="fa fa-pencil"></i>',
    address:'<i class="fa fa-home"></i>',
    hidden:'<i class="fa fa-user-secret"></i>',
    panel:'<i class="fa fa-th-large"></i>',
    columns:'<i class="fa fa-columns"></i>',
    tabs:'<i class="fa fa-folder"></i>',
    fieldset:'<i class="fa fa-list-alt"></i>',
    unknown:'<i class="fa fa-cubes"></i>'
  };

  const TYPE_NAMES={
    textfield:'Text Field',number:'Number',currency:'Currency',textarea:'Textarea',checkbox:'Checkbox',radio:'Radio',select:'Select',selectboxes:'Select Boxes',password:'Password',button:'Button',
    email:'Email',url:'URL',phoneNumber:'Phone Number',datetime:'Date/Time',day:'Day',time:'Time',file:'File',signature:'Signature',address:'Address',
    content:'Content',mycontent:'My Content',htmlelement:'HTML Element',hidden:'Hidden',resource:'Resource',form:'Form',nestedform:'Nested Form',
    panel:'Panel',columns:'Columns',tabs:'Tabs',fieldset:'Fieldset',unknown:'Unknown'
  };

  function getFieldLabel(e){if(!e||!e.length)return'';const el=e[0];let l=document.querySelector(`label[for="${el.id}"]`);if(l)return l.textContent.trim().replace(/\*\s*$/,'');l=el.closest('label');if(l){const c=l.cloneNode(!0);c.querySelectorAll('input,select,textarea').forEach(i=>i.remove());return c.textContent.trim().replace(/\*\s*$/,'')}let s=el.previousElementSibling;while(s){if(s.tagName==='LABEL')return s.textContent.trim().replace(/\*\s*$/,'');s=s.previousElementSibling}const lbl=el.querySelector('.formio-component-label,.control-label,.field-label,.form-label');if(lbl)return lbl.textContent.trim().replace(/\*\s*$/,'');const p=el.closest('.formio-component,.form-group,.field-wrapper');if(p){const pl=p.querySelector('.formio-component-label,.control-label,.field-label,.form-label');if(pl)return pl.textContent.trim().replace(/\*\s*$/,'')}return el.getAttribute('aria-label')||el.getAttribute('title')||el.getAttribute('placeholder')||''}

  function detectFieldType(e){if(!e||!e.length)return'unknown';const el=e[0],c=el.className||'',types=['panel','columns','tabs','fieldset','email','url','phoneNumber','datetime','day','time','file','signature','address','textfield','number','currency','textarea','checkbox','radio','select','selectboxes','password','button','content','mycontent','htmlelement','hidden','resource','form','nestedform'];for(const t of types)if(c.includes(`formio-component-${t}`))return t;const tag=el.tagName?.toLowerCase();if(tag==='select')return'select';if(tag==='textarea')return'textarea';if(tag==='button')return'button';if(tag==='input'){const t=el.type?.toLowerCase()||'text';return t==='text'?'textfield':t==='email'?'email':t==='tel'?'phoneNumber':t==='number'?'number':t==='date'||t==='datetime-local'?'datetime':t==='time'?'time':t==='checkbox'?'checkbox':t==='radio'?'radio':t==='password'?'password':t==='file'?'file':t==='hidden'?'hidden':t==='color'?'color':t==='range'?'range':t==='url'?'url':t}const i=el.querySelector('input,select,textarea,button');return i?detectFieldType([i]):'unknown'}

  function getFieldMetadata(e){if(!e||!e.length)return{};const el=e[0],m={type:detectFieldType(e),label:getFieldLabel(e),required:!1,disabled:!1,readonly:!1,value:'',placeholder:'',filled:!1,hasError:!1};let i=el;if(el.querySelector('input,select,textarea'))i=el.querySelector('input,select,textarea');if(i){m.required=i.hasAttribute('required')||i.hasAttribute('aria-required');m.disabled=i.disabled||i.hasAttribute('disabled');m.readonly=i.readOnly||i.hasAttribute('readonly');m.placeholder=i.placeholder||'';m.value=i.value||'';m.filled=!!m.value}if(el.classList.contains('has-error')||el.querySelector('.has-error'))m.hasError=!0;return m}

  function detectDependencies(k,e){const d={dependsOn:[],enables:[],condition:''};if(!e||!e.length)return d;const el=e[0],c=el.getAttribute('data-conditional')||el.getAttribute('ng-if')||el.getAttribute('v-if');if(c){const m=c.match(/data\.(\w+)/g);if(m){d.dependsOn=m.map(x=>x.replace('data.','')).filter((v,i,a)=>a.indexOf(v)===i);d.condition=c}}document.querySelectorAll(`[data-conditional*="${k}"],[ng-if*="${k}"],[v-if*="${k}"]`).forEach(dep=>{const dk=dep.getAttribute('data-key')||dep.getAttribute('data-component-key');if(dk&&dk!==k)d.enables.push(dk)});return d}

  function groupKeysByPrefix(d){const g={},u=[];d.forEach(x=>{let done=!1;const m=x.key.match(/^([a-zA-Z]+)\d+[A-Z]/);if(m){const n=m[1];g[n]||(g[n]=[]);g[n].push(x);done=!0}if(!done){const m=x.key.match(/^([a-zA-Z]+)[_\-]/);if(m){const n=m[1];g[n]||(g[n]=[]);g[n].push(x);done=!0}}if(!done&&x.key.match(/^[A-Z]{2,}\d*$/)){g.emissions||(g.emissions=[]);g.emissions.push(x);done=!0}if(!done)u.push(x)});if(u.length)g.other=u;return g}

  function findElementsByKey(k){const s=[`.formio-component-${CSS.escape(k)}`,`[data-component-key="${CSS.escape(k)}"]`,`[data-key="${CSS.escape(k)}"]`,`[ref="component-${CSS.escape(k)}"]`,`#${CSS.escape(k)}`,`[name="data[${CSS.escape(k)}]"]`,`[name="data['${CSS.escape(k)}']"]`,`[name="data[\\"${CSS.escape(k)}\\"]"]`,`[name^="data["][name$="${CSS.escape(k)}]"]`,`[data-component*="${CSS.escape(k)}"]`,`[id*="${CSS.escape(k)}"]`,`input[name*="${CSS.escape(k)}"]`,`textarea[name*="${CSS.escape(k)}"]`,`select[name*="${CSS.escape(k)}"]`],els=new Set();s.forEach(sel=>{try{document.querySelectorAll(sel).forEach(e=>els.add(e))}catch{}});return Array.from(els)}

  function highlightElement(el,k){if(!el)return;el.classList.add(HIGHLIGHT_CLASS);if(!el.__fi_label){try{const b=document.createElement('div');b.innerHTML=k;b.style.cssText='position:absolute;z-index:10000001;font-size:11px;padding:2px 6px;border-radius:6px;background:rgba(11,116,222,.95);color:#fff;top:4px;left:4px;';b.className='__fi_key_badge';if(['static',''].includes(getComputedStyle(el).position))el.style.position='relative';el.appendChild(b);el.__fi_label=b}catch{}}}

  function clearGoSelection(){document.querySelectorAll('.'+GO_ACTIVE_CLASS).forEach(el=>el.classList.remove(GO_ACTIVE_CLASS))}

  function cleanup(){try{clearGoSelection();document.querySelectorAll('.'+HIGHLIGHT_CLASS).forEach(el=>{el.classList.remove(HIGHLIGHT_CLASS);el.__fi_label?.remove();delete el.__fi_label});document.getElementById(MODAL_ID)?.remove();styleTag?.remove();delete window.__formioKeysFinderRunning}catch{}}window.__formioKeysFinderCleanup=cleanup;

  function computeKeysWithMetadata(i){const b=new Set();document.querySelectorAll('[class]').forEach(el=>{const c=el.className||'',r=/(?:^|\s)formio-component-([A-Za-z0-9_\-:]+)/g,m=[];let x;while((x=r.exec(c))!==null)b.add(s(x[1]))});document.querySelectorAll('[data-component-key],[data-key]').forEach(el=>{const k1=el.getAttribute('data-component-key'),k2=el.getAttribute('data-key');k1&&b.add(s(k1));k2&&b.add(s(k2))});document.querySelectorAll('[name]').forEach(el=>{const n=el.getAttribute('name')||'',r=/data\[(?:'|")?([^\]\['"]+)(?:'|")?\]/g,m=[];let x;while((x=r.exec(n))!==null)b.add(s(x[1]));if(/^data\.[A-Za-z0-9_]+$/.test(n))b.add(n.split('.')[1])});document.querySelectorAll('[ref]').forEach(el=>{const r=el.getAttribute('ref')||'',m=r.match(/component-([A-Za-z0-9_\-:]+)/);m&&b.add(s(m[1]))});if(i)document.querySelectorAll('[id]').forEach(el=>{const id=el.getAttribute('id')||'';if(!id||/^[0-9a-f]{8}\-/.test(id))return;id.split(/[-_:.]/).forEach(p=>{p&&p.length>3&&/[A-Za-z]/.test(p)&&b.add(s(p))})});return Array.from(b).filter(Boolean).map(k=>{const e=findElementsByKey(k),m=getFieldMetadata(e),d=detectDependencies(k,e);return{key:k,elements:e,...m,dependencies:d,elementCount:e.length}}).sort((a,b)=>a.key.localeCompare(b.key))}

  const modal=document.createElement('div');modal.id=MODAL_ID;modal.innerHTML=`
    <header><div><span class="title">eRegistrations Key Analyzer</span> <span class="count"></span></div>
      <div class="view-toggle">
        <button class="view-btn active" data-view="list">List</button>
        <button class="view-btn" data-view="grouped">Grouped</button>
        <button class="view-btn" data-view="stats">Stats</button>
        <button id="__fi_closebtn" title="Close">X</button>
      </div>
    </header>
    <div class="filter-bar" id="__fi_filters">
      <button class="filter-btn active" data-filter="all">All <span class="count"></span></button>
      <button class="filter-btn" data-filter="textfield">Text <span class="count"></span></button>
      <button class="filter-btn" data-filter="number">Number <span class="count"></span></button>
      <button class="filter-btn" data-filter="select">Select <span class="count"></span></button>
      <button class="filter-btn" data-filter="textarea">Textarea <span class="count"></span></button>
      <button class="filter-btn" data-filter="datetime">Date/Time <span class="count"></span></button>
      <button class="filter-btn" data-filter="checkbox">Checkbox <span class="count"></span></button>
      <button class="filter-btn" data-filter="email">Email <span class="count"></span></button>
      <button class="filter-btn" data-filter="panel">Panel <span class="count"></span></button>
      <button class="filter-btn" data-filter="required">Required <span class="count"></span></button>
      <button class="filter-btn" data-filter="filled">Filled <span class="count"></span></button>
      <button class="filter-btn" data-filter="empty">Empty <span class="count"></span></button>
    </div>
    <div class="stats-panel" id="__fi_stats">
      <div class="stat-row"><span class="stat-label">Total fields:</span><span class="stat-value" id="stat-total">0</span></div>
      <div class="stat-row"><span class="stat-label">Completed:</span><span class="stat-value" id="stat-filled">0 (0%)</span></div>
      <div class="stat-row"><span class="stat-label">Required empty:</span><span class="stat-value" id="stat-required-empty">0</span></div>
      <div class="stat-row"><span class="stat-label">With dependencies:</span><span class="stat-value" id="stat-deps">0</span></div>
      <div class="stat-row"><span class="stat-label">Disabled:</span><span class="stat-value" id="stat-disabled">0</span></div>
      <div class="stat-row"><span class="stat-label">Most common:</span><span class="stat-value" id="stat-common-type">-</span></div>
    </div>
    <div class="controls">
      <input id="__fi_search" type="search" placeholder="Search key or label…">
      <button id="__fi_copy" class="primary">Copy</button>
      <button id="__fi_export_full">Export</button>
      <button id="__fi_select_all">Highlight All</button>
      <button id="__fi_clear">Clear</button>
    </div>
    <div class="list" id="__fi_list"></div>
    <footer>Click rows to highlight • Hover badges for info</footer>
  `;document.body.appendChild(modal);

  const listEl=modal.querySelector('#__fi_list'),countEl=modal.querySelector('.count'),searchInput=modal.querySelector('#__fi_search'),filterBar=modal.querySelector('#__fi_filters'),statsPanel=modal.querySelector('#__fi_stats');
  let includeIds=!1,keysData=computeKeysWithMetadata(includeIds),currentView='list',activeFilters=new Set(['all']),cycles=new Map();

  function download(f,c,m){const a=document.createElement('a'),b=new Blob([c],{type:m||'text/plain'});a.href=URL.createObjectURL(b);a.download=f;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}

  function updateFilterCounts(){const c={all:keysData.length,textfield:0,number:0,currency:0,select:0,selectboxes:0,textarea:0,datetime:0,day:0,time:0,checkbox:0,radio:0,email:0,phoneNumber:0,url:0,password:0,file:0,signature:0,address:0,button:0,panel:0,columns:0,tabs:0,fieldset:0,content:0,mycontent:0,htmlelement:0,hidden:0,resource:0,form:0,nestedform:0,required:0,filled:0,empty:0};keysData.forEach(d=>{c[d.type]=(c[d.type]||0)+1;d.required&&c.required++;d.filled&&c.filled++;!d.filled&&c.empty++});filterBar.querySelectorAll('.filter-btn').forEach(b=>{const f=b.dataset.filter,s=b.querySelector('.count');s&&c[f]!==void 0&&(s.textContent=`(${c[f]})`)})}

  function updateStats(){const t=keysData.length,f=keysData.filter(d=>d.filled).length,r=keysData.filter(d=>d.required&&!d.filled).length,w=keysData.filter(d=>d.dependencies.dependsOn.length>0||d.dependencies.enables.length>0).length,dis=keysData.filter(d=>d.disabled).length;const tc={};keysData.forEach(d=>tc[d.type]=(tc[d.type]||0)+1);const mc=Object.entries(tc).sort((a,b)=>b[1]-a[1])[0];document.getElementById('stat-total').textContent=t;document.getElementById('stat-filled').textContent=`${f} (${Math.round(f/t*100)}%)`;document.getElementById('stat-required-empty').textContent=r;document.getElementById('stat-deps').textContent=w;document.getElementById('stat-disabled').textContent=dis;document.getElementById('stat-common-type').innerHTML=mc?`${TYPE_ICONS[mc[0]]||''} ${TYPE_NAMES[mc[0]]||mc[0]} (${mc[1]})`:'-'}

  function passesFilters(d){if(activeFilters.has('all'))return!0;for(const f of activeFilters){if(f===d.type||f==='required'&&d.required||f==='filled'&&d.filled||f==='empty'&&!d.filled)return!0}return!1}

  function buildEnhancedRow(d){const r=document.createElement('div');r.className='keyrow';r.dataset.key=d.key;r.dataset.type=d.type;r.dataset.label=d.label||'';const ti=document.createElement('span');ti.className='key-type';ti.innerHTML=TYPE_ICONS[d.type]||'?';ti.title=`Type: ${TYPE_NAMES[d.type]||d.type}`;const kc=document.createElement('div');kc.className='key-column';const kn=document.createElement('div');kn.className='keyname';kn.textContent=d.key;kn.title=d.key;const b=document.createElement('div');b.className='key-badges';d.required&&(()=>{const x=document.createElement('span');x.className='badge required';x.textContent='REQ';x.title='Required field';b.appendChild(x)})();d.disabled&&(()=>{const x=document.createElement('span');x.className='badge disabled';x.textContent='DIS';x.title='Disabled field';b.appendChild(x)})();d.filled&&(()=>{const x=document.createElement('span');x.className='badge filled';x.textContent='Check';x.title=`Value: ${d.value.substring(0,50)}${d.value.length>50?'...':''}`;b.appendChild(x)})();(d.dependencies.dependsOn.length>0||d.dependencies.enables.length>0)&&(()=>{const x=document.createElement('span');x.className='badge dependent';x.textContent='D';let i='';d.dependencies.dependsOn.length>0&&(i+=`Depends on: ${d.dependencies.dependsOn.join(', ')}\n`);d.dependencies.enables.length>0&&(i+=`Enables: ${d.dependencies.enables.join(', ')}`);x.title=i;b.appendChild(x)})();kc.appendChild(kn);kc.appendChild(b);const lc=document.createElement('div');lc.className='label-column';const fl=document.createElement('div');fl.className='field-label';fl.textContent=d.label||'(no label)';fl.title=d.label||'';!d.label&&(fl.style.color='#999');const ft=document.createElement('div');ft.className='field-type-text';ft.textContent=TYPE_NAMES[d.type]||d.type;lc.appendChild(fl);lc.appendChild(ft);const a=document.createElement('div');a.className='actions';cycles.has(d.key)||cycles.set(d.key,{idx:0});const go=document.createElement('span');go.className='actionlink __go';go.textContent='Go';go.title='Navigate to field';go.addEventListener('click',e=>{e.stopPropagation();const els=d.elements;if(!els.length){alert('No elements found for: '+d.key);return}clearGoSelection();const st=cycles.get(d.key),el=els[st.idx%els.length];el.classList.add(GO_ACTIVE_CLASS);try{el.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});el.animate([{boxShadow:'0 0 0 8px rgba(11,116,222,0)'},{boxShadow:'0 0 0 8px rgba(11,116,222,.6)'},{boxShadow:'0 0 0 8px rgba(11,116,222,0)'}],{duration:700})}catch{}st.idx++;a.querySelectorAll('.foundcount').forEach(x=>x.remove());const fc=document.createElement('span');fc.className='foundcount';fc.textContent=`(${((st.idx-1)%els.length)+1}/${els.length})`;go.appendChild(fc)});const cp=document.createElement('span');cp.className='actionlink';cp.textContent='Copy';cp.addEventListener('click',e=>{e.stopPropagation();navigator.clipboard?.writeText(d.key);cp.textContent='Check';cp.style.color='#0a0';setTimeout(()=>{cp.textContent='Copy';cp.style.color=''},1000)});a.appendChild(go);a.appendChild(cp);r.appendChild(ti);r.appendChild(kc);r.appendChild(lc);r.appendChild(a);r.addEventListener('click',ev=>{if(ev.target?.classList?.contains('actionlink'))return;const els=d.elements;if(!els.length){alert('No elements found for: '+d.key);return}els[0].scrollIntoView({behavior:'smooth',block:'center',inline:'center'});els.forEach(e=>highlightElement(e,d.key))});return r}

  function buildGroupedView(){listEl.innerHTML='';const g=groupKeysByPrefix(keysData);Object.entries(g).forEach(([n,i])=>{const h=document.createElement('div');h.className='group-header';const t=document.createElement('span');t.className='group-toggle';t.textContent='Down';const nm=document.createElement('span');nm.className='group-name';nm.textContent=n.charAt(0).toUpperCase()+n.slice(1);const c=document.createElement('span');c.className='group-count';c.textContent=`(${i.length})`;const ac=document.createElement('div');ac.className='group-actions';const hg=document.createElement('span');hg.className='group-action';hg.textContent='Highlight';hg.addEventListener('click',e=>{e.stopPropagation();i.forEach(d=>d.elements.forEach(el=>highlightElement(el,d.key)))});const cg=document.createElement('span');cg.className='group-action';cg.textContent='Copy Keys';cg.addEventListener('click',e=>{e.stopPropagation();const k=i.map(d=>d.key).join(',');navigator.clipboard?.writeText(k);cg.textContent='Check';setTimeout(()=>cg.textContent='Copy Keys',1000)});ac.appendChild(hg);ac.appendChild(cg);h.appendChild(t);h.appendChild(nm);h.appendChild(c);h.appendChild(ac);const co=document.createElement('div');co.className='group-content';i.forEach(d=>{passesFilters(d)&&co.appendChild(buildEnhancedRow(d))});h.addEventListener('click',e=>{if(e.target.classList.contains('group-action'))return;t.classList.toggle('collapsed');co.classList.toggle('collapsed')});listEl.appendChild(h);listEl.appendChild(co)})}

  function renderList(){currentView==='grouped'?buildGroupedView():(listEl.innerHTML='',keysData.forEach(d=>passesFilters(d)&&listEl.appendChild(buildEnhancedRow(d)))),applyFilter(),updateVisibleCount()}

  function applyFilter(){const q=(searchInput.value||'').toLowerCase();let v=0;listEl.querySelectorAll('.keyrow').forEach(r=>{const k=r.dataset.key.toLowerCase(),l=r.dataset.label.toLowerCase(),ms=!q||k.includes(q)||l.includes(q),mf=passesFilters(keysData.find(d=>d.key===r.dataset.key)),show=ms&&mf;r.style.display=show?'':'none';show&&v++});updateVisibleCount()}

  function updateVisibleCount(){const v=Array.from(listEl.querySelectorAll('.keyrow')).filter(r=>r.style.display!=='none').length;countEl.textContent=`(${v} visible of ${keysData.length})`}

  updateFilterCounts();updateStats();renderList();

  modal.querySelector('#__fi_closebtn').addEventListener('click',cleanup);
  modal.querySelector('#__fi_clear').addEventListener('click',()=>{document.querySelectorAll('.'+HIGHLIGHT_CLASS).forEach(el=>{el.classList.remove(HIGHLIGHT_CLASS);el.__fi_label?.remove();delete el.__fi_label});clearGoSelection()});
  modal.querySelector('#__fi_select_all').addEventListener('click',()=>{keysData.forEach(d=>passesFilters(d)&&d.elements.forEach(el=>highlightElement(el,d.key)))});
  modal.querySelector('#__fi_copy').addEventListener('click',()=>{const k=keysData.filter(d=>passesFilters(d)).map(d=>d.key).join(',');navigator.clipboard?.writeText(k).then(()=>{const b=modal.querySelector('#__fi_copy');b.textContent='Check Copied';setTimeout(()=>b.textContent='Copy',1500)})||prompt('Copy manually:',k)});
  modal.querySelector('#__fi_export_full').addEventListener('click',()=>{const d=keysData.map(x=>({key:x.key,label:x.label||'',type:x.type,typeName:TYPE_NAMES[x.type]||x.type,required:x.required,disabled:x.disabled,filled:x.filled,value:x.value,placeholder:x.placeholder,elementCount:x.elementCount,dependsOn:x.dependencies.dependsOn.join(','),enables:x.dependencies.enables.join(',')})),h=['key','label','type','typeName','required','disabled','filled','value','placeholder','elementCount','dependsOn','enables'],csv=[h.join(','),...d.map(r=>h.map(c=>`"${(r[c]||'').toString().replace(/"/g,'""')}"`).join(','))].join('\n');download('formio-keys-analysis.csv',csv,'text/csv')});
  filterBar.addEventListener('click',e=>{if(!e.target.classList.contains('filter-btn'))return;const f=e.target.dataset.filter;if(f==='all'){filterBar.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');activeFilters=new Set(['all'])}else{filterBar.querySelector('[data-filter="all"]').classList.remove('active');activeFilters.delete('all');activeFilters.has(f)?activeFilters.delete(f)&&e.target.classList.remove('active'):activeFilters.add(f)&&e.target.classList.add('active');activeFilters.size===0&&(activeFilters.add('all'),filterBar.querySelector('[data-filter="all"]').classList.add('active'))}renderList()});
  modal.querySelectorAll('.view-btn').forEach(b=>b.addEventListener('click',()=>{modal.querySelectorAll('.view-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');const v=b.dataset.view;currentView=v;statsPanel.classList.toggle('show',v==='stats');listEl.style.display=v==='stats'?'none':'block';v!=='stats'&&renderList()}));
  searchInput.addEventListener('input',applyFilter);
  searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){const f=Array.from(listEl.querySelectorAll('.keyrow')).find(r=>r.style.display!=='none');f&&f.querySelector('.actionlink.__go')?.dispatchEvent(new MouseEvent('click',{bubbles:!0}))}});
  window.addEventListener('keydown',e=>{e.key==='Escape'&&cleanup()});
})();
