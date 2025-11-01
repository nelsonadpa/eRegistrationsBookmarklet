/* formio-keys.js — eRegistrations Bookmarklet (Form.io Keys Finder) Enhanced */
(function(){
  if(window.__formioKeysFinderRunning){ try{document.getElementById('__fi_key_modal')?.remove();}catch(e){} }
  window.__formioKeysFinderRunning = Date.now();

  const HIGHLIGHT_CLASS = '__fi_key_highlight';
  const MODAL_ID = '__fi_key_modal';
  const GO_ACTIVE_CLASS = '__fi_go_active';

  // ---------- Styles Enhanced ----------
  const styles = `
    .${HIGHLIGHT_CLASS}{box-shadow:0 0 0 3px rgba(255,200,0,.9)!important;border-radius:6px!important;position:relative;z-index:9999999!important}
    .${GO_ACTIVE_CLASS}{box-shadow:0 0 0 4px rgba(11,116,222,.9)!important;border-radius:6px!important;position:relative;z-index:10000001!important}
    #${MODAL_ID}{position:fixed;right:18px;top:18px;width:560px;max-height:85vh;overflow:auto;background:#fff;color:#111;border:1px solid #ddd;box-shadow:0 8px 30px rgba(0,0,0,.25);z-index:10000000;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;border-radius:8px}
    #${MODAL_ID} header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #eee;background:linear-gradient(to right, #f8f9fa, #fff)}
    #${MODAL_ID} .title{font-weight:600;font-size:14px}
    #${MODAL_ID} .count{color:#666;font-size:12px;margin-left:8px}
    #${MODAL_ID} .controls{padding:8px 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;border-bottom:1px solid #eee}
    #${MODAL_ID} button{padding:6px 10px;border-radius:6px;border:1px solid #bbb;background:#fafafa;cursor:pointer;transition:all 0.2s;font-size:12px}
    #${MODAL_ID} button:hover{background:#f0f0f0;transform:translateY(-1px)}
    #${MODAL_ID} button.primary{background:#0b74de;color:#fff;border-color:#0b74de}
    #${MODAL_ID} button.primary:hover{background:#0960b8}
    #${MODAL_ID} button.active{background:#e8f4fd;border-color:#0b74de;color:#0b74de}
    #${MODAL_ID} .filter-bar{padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;border-bottom:1px solid #eee;background:#f8f9fa}
    #${MODAL_ID} .filter-btn{padding:4px 8px;border-radius:16px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:11px;transition:all 0.2s}
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
    #${MODAL_ID} .group-toggle{margin-right:6px;transition:transform 0.2s}
    #${MODAL_ID} .group-toggle.collapsed{transform:rotate(-90deg)}
    #${MODAL_ID} .group-name{font-weight:600;flex:1}
    #${MODAL_ID} .group-count{color:#666;font-size:11px}
    #${MODAL_ID} .group-actions{display:flex;gap:6px}
    #${MODAL_ID} .group-action{color:#0b74de;font-size:11px;cursor:pointer;padding:2px 6px;border-radius:4px}
    #${MODAL_ID} .group-action:hover{background:#e8f4fd}
    #${MODAL_ID} .group-content{margin-left:20px}
    #${MODAL_ID} .group-content.collapsed{display:none}
    #${MODAL_ID} .keyrow{display:flex;justify-content:space-between;align-items:center;padding:6px 4px;border-bottom:1px dashed #efefef;transition:background 0.2s}
    #${MODAL_ID} .keyrow:hover{background:#f8f9fa}
    #${MODAL_ID} .keyrow.hidden{display:none}
    #${MODAL_ID} .key-info{display:flex;align-items:center;flex:1;gap:6px}
    #${MODAL_ID} .key-type{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:4px;background:#f0f0f0;font-size:11px}
    #${MODAL_ID} .key-type.text{background:#e3f2fd}
    #${MODAL_ID} .key-type.number{background:#f3e5f5}
    #${MODAL_ID} .key-type.date{background:#fff3e0}
    #${MODAL_ID} .key-type.select{background:#e8f5e9}
    #${MODAL_ID} .key-type.textarea{background:#fce4ec}
    #${MODAL_ID} .key-type.checkbox{background:#f1f8e9}
    #${MODAL_ID} .key-type.radio{background:#fff8e1}
    #${MODAL_ID} .keyname{word-break:break-all;flex:1}
    #${MODAL_ID} .key-badges{display:flex;gap:4px;margin-left:6px}
    #${MODAL_ID} .badge{padding:1px 4px;border-radius:3px;font-size:10px;font-weight:600}
    #${MODAL_ID} .badge.required{background:#fee;color:#c00}
    #${MODAL_ID} .badge.disabled{background:#f0f0f0;color:#666}
    #${MODAL_ID} .badge.filled{background:#efe;color:#080}
    #${MODAL_ID} .badge.dependent{background:#e8f4fd;color:#0b74de}
    #${MODAL_ID} .actions{display:flex;align-items:center}
    #${MODAL_ID} .actionlink{margin-left:8px;color:#0b74de;cursor:pointer;font-size:11px;user-select:none;padding:2px 4px;border-radius:3px}
    #${MODAL_ID} .actionlink:hover{background:#e8f4fd}
    #${MODAL_ID} .dependency-info{position:absolute;z-index:10000002;background:#333;color:#fff;padding:6px 10px;border-radius:6px;font-size:11px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.2s}
    #${MODAL_ID} .dependency-info.show{opacity:1}
    #${MODAL_ID} footer{padding:8px 12px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#666;background:#f8f9fa}
    #${MODAL_ID} .controls input[type="search"]{flex:1;min-width:140px;padding:6px 8px;border:1px solid #bbb;border-radius:6px}
    #${MODAL_ID} .controls input[type="search"]::placeholder{color:#888}
    #${MODAL_ID} .view-toggle{display:flex;gap:4px;margin-left:auto}
    #${MODAL_ID} .view-btn{padding:4px 8px;border-radius:4px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:11px}
    #${MODAL_ID} .view-btn.active{background:#0b74de;color:#fff;border-color:#0b74de}
  `;
  const styleTag = document.createElement('style');
  styleTag.id = '__fi_style_inject';
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  // ---------- Enhanced Helpers ----------
  const s = v => (v||'').toString().trim();

  // Type detection icons
  const TYPE_ICONS = {
    text: '📝',
    number: '🔢',
    date: '📅',
    email: '📧',
    tel: '☎️',
    select: '📋',
    textarea: '📄',
    checkbox: '☑️',
    radio: '⭕',
    file: '📎',
    hidden: '👁️',
    password: '🔒',
    color: '🎨',
    range: '📊',
    unknown: '❓'
  };

  // Detect field type
  function detectFieldType(elements) {
    if (!elements || elements.length === 0) return 'unknown';
    
    const el = elements[0];
    const tagName = el.tagName?.toLowerCase();
    
    if (tagName === 'select') return 'select';
    if (tagName === 'textarea') return 'textarea';
    if (tagName === 'input') {
      const type = el.type?.toLowerCase() || 'text';
      return TYPE_ICONS[type] ? type : 'text';
    }
    
    // Check for Form.io specific classes
    const classes = el.className || '';
    if (classes.includes('formio-component-select')) return 'select';
    if (classes.includes('formio-component-textarea')) return 'textarea';
    if (classes.includes('formio-component-number')) return 'number';
    if (classes.includes('formio-component-datetime')) return 'date';
    if (classes.includes('formio-component-checkbox')) return 'checkbox';
    if (classes.includes('formio-component-radio')) return 'radio';
    
    return 'unknown';
  }

  // Get field metadata
  function getFieldMetadata(elements) {
    if (!elements || elements.length === 0) return {};
    
    const el = elements[0];
    const metadata = {
      type: detectFieldType(elements),
      required: false,
      disabled: false,
      readonly: false,
      value: '',
      placeholder: '',
      filled: false,
      hasError: false
    };
    
    // Check actual input element
    let inputEl = el;
    if (el.querySelector('input, select, textarea')) {
      inputEl = el.querySelector('input, select, textarea');
    }
    
    if (inputEl) {
      metadata.required = inputEl.hasAttribute('required') || inputEl.hasAttribute('aria-required');
      metadata.disabled = inputEl.disabled || inputEl.hasAttribute('disabled');
      metadata.readonly = inputEl.readOnly || inputEl.hasAttribute('readonly');
      metadata.placeholder = inputEl.placeholder || '';
      metadata.value = inputEl.value || '';
      metadata.filled = !!metadata.value;
    }
    
    // Check for Form.io validation classes
    if (el.classList.contains('has-error') || el.querySelector('.has-error')) {
      metadata.hasError = true;
    }
    
    return metadata;
  }

  // Detect dependencies (basic implementation)
  function detectDependencies(key, elements) {
    const deps = {
      dependsOn: [],
      enables: [],
      condition: ''
    };
    
    if (!elements || elements.length === 0) return deps;
    
    const el = elements[0];
    
    // Check for conditional attributes
    const conditional = el.getAttribute('data-conditional') || 
                       el.getAttribute('ng-if') || 
                       el.getAttribute('v-if');
    
    if (conditional) {
      // Basic parsing of conditions
      const matches = conditional.match(/data\.(\w+)/g);
      if (matches) {
        deps.dependsOn = matches.map(m => m.replace('data.', '')).filter((v, i, a) => a.indexOf(v) === i);
        deps.condition = conditional;
      }
    }
    
    // Check if this field is referenced in other conditions
    document.querySelectorAll('[data-conditional*="' + key + '"], [ng-if*="' + key + '"], [v-if*="' + key + '"]').forEach(depEl => {
      const depKey = depEl.getAttribute('data-key') || depEl.getAttribute('data-component-key');
      if (depKey && depKey !== key) {
        deps.enables.push(depKey);
      }
    });
    
    return deps;
  }

  // Group keys by prefix
  function groupKeysByPrefix(keysData) {
    const groups = {};
    const ungrouped = [];
    
    keysData.forEach(data => {
      const key = data.key;
      // Try to find a prefix pattern
      let grouped = false;
      
      // Pattern 1: applicant123Name -> group "applicant"
      const prefixMatch = key.match(/^([a-zA-Z]+)\d+[A-Z]/);
      if (prefixMatch) {
        const group = prefixMatch[1];
        if (!groups[group]) groups[group] = [];
        groups[group].push(data);
        grouped = true;
      }
      
      // Pattern 2: address_street -> group "address"
      if (!grouped) {
        const underscoreMatch = key.match(/^([a-zA-Z]+)[_\-]/);
        if (underscoreMatch) {
          const group = underscoreMatch[1];
          if (!groups[group]) groups[group] = [];
          groups[group].push(data);
          grouped = true;
        }
      }
      
      // Pattern 3: common Form.io patterns (CO2, CH4, etc)
      if (!grouped && key.match(/^[A-Z]{2,}\d*$/)) {
        if (!groups['emissions']) groups['emissions'] = [];
        groups['emissions'].push(data);
        grouped = true;
      }
      
      if (!grouped) {
        ungrouped.push(data);
      }
    });
    
    // Add ungrouped items
    if (ungrouped.length > 0) {
      groups['otros'] = ungrouped;
    }
    
    return groups;
  }

  function findElementsByKey(key){
    const sels = [
      `.formio-component-${CSS.escape(key)}`,
      `[data-component-key="${CSS.escape(key)}"]`,
      `[data-key="${CSS.escape(key)}"]`,
      `[ref="component-${CSS.escape(key)}"]`,
      `#${CSS.escape(key)}`,
      `[name="data[${CSS.escape(key)}]"]`,
      `[name="data['${CSS.escape(key)}']"]`,
      `[name="data[\\"${CSS.escape(key)}\\"]"]`,
      `[name^="data["][name$="${CSS.escape(key)}]"]`,
      `[data-component*="${CSS.escape(key)}"]`,
      `[id*="${CSS.escape(key)}"]`,
      `input[name*="${CSS.escape(key)}"]`,
      `textarea[name*="${CSS.escape(key)}"]`,
      `select[name*="${CSS.escape(key)}"]`
    ];
    const els = new Set();
    for(const sel of sels){
      try{ document.querySelectorAll(sel).forEach(e=>els.add(e)); }catch(e){}
    }
    return Array.from(els);
  }

  function highlightElement(el, key){
    if(!el) return;
    el.classList.add(HIGHLIGHT_CLASS);
    if(!el.__fi_label){
      try{
        const badge = document.createElement('div');
        badge.innerText = key;
        badge.style.cssText = 'position:absolute;z-index:10000001;font-size:11px;padding:2px 6px;border-radius:6px;background:rgba(11,116,222,.95);color:#fff;top:4px;left:4px;';
        badge.className = '__fi_key_badge';
        const prevPos = window.getComputedStyle(el).position;
        if(prevPos === 'static' || !prevPos) el.style.position = 'relative';
        el.appendChild(badge);
        el.__fi_label = badge;
      }catch(e){}
    }
  }

  function clearGoSelection(){
    document.querySelectorAll('.'+GO_ACTIVE_CLASS).forEach(el=>{
      el.classList.remove(GO_ACTIVE_CLASS);
    });
  }

  function cleanup(){
    try{
      clearGoSelection();
      document.querySelectorAll('.'+HIGHLIGHT_CLASS).forEach(el=>{
        el.classList.remove(HIGHLIGHT_CLASS);
        if(el.__fi_label){ try{ el.__fi_label.remove(); delete el.__fi_label; }catch(e){} }
      });
      document.getElementById(MODAL_ID)?.remove();
      styleTag?.remove();
      delete window.__formioKeysFinderRunning;
    }catch(e){}
  }
  window.__formioKeysFinderCleanup = cleanup;

  // ---------- Enhanced Key Discovery ----------
  function computeKeysWithMetadata(includeIds){
    const base = new Set();

    // classes formio-component-*
    document.querySelectorAll('[class]').forEach(el=>{
      const cl = el.className || '';
      const re = /(?:^|\s)formio-component-([A-Za-z0-9_\-:]+)/g;
      let m;
      while((m = re.exec(cl)) !== null){ base.add(s(m[1])); }
    });

    // data-component-key / data-key
    document.querySelectorAll('[data-component-key], [data-key]').forEach(el=>{
      const k1 = el.getAttribute('data-component-key');
      const k2 = el.getAttribute('data-key');
      if(k1) base.add(s(k1));
      if(k2) base.add(s(k2));
    });

    // name="data[xxx]" & name="data.xxx"
    document.querySelectorAll('[name]').forEach(el=>{
      const name = el.getAttribute('name') || '';
      const re = /data\[(?:'|")?([^\]\['"]+)(?:'|")?\]/g;
      let m; while((m = re.exec(name)) !== null) base.add(s(m[1]));
      if(/^data\.[A-Za-z0-9_]+$/.test(name)) base.add(name.split('.')[1]);
    });

    // ref="component-xxx"
    document.querySelectorAll('[ref]').forEach(el=>{
      const ref = el.getAttribute('ref') || '';
      const mm = ref.match(/component-([A-Za-z0-9_\-:]+)/);
      if(mm) base.add(s(mm[1]));
    });

    if(includeIds){
      // include heuristic IDs
      document.querySelectorAll('[id]').forEach(el=>{
        const id = el.getAttribute('id') || '';
        if(!id) return;
        if(/^[0-9a-f]{8}\-/.test(id)) return; // GUID-ish
        id.split(/[-_:.]/).forEach(p=>{
          if(p && p.length>3 && /[A-Za-z]/.test(p)) base.add(s(p));
        });
      });
    }

    // Convert to array with metadata
    const keysWithData = Array.from(base).filter(Boolean).map(key => {
      const elements = findElementsByKey(key);
      const metadata = getFieldMetadata(elements);
      const dependencies = detectDependencies(key, elements);
      
      return {
        key,
        elements,
        ...metadata,
        dependencies,
        elementCount: elements.length
      };
    });

    return keysWithData.sort((a, b) => a.key.localeCompare(b.key));
  }

  // ---------- Enhanced UI ----------
  const modal = document.createElement('div'); 
  modal.id = MODAL_ID;
  modal.innerHTML = `
    <header>
      <div><span class="title">🔍 Form.io Keys Finder Enhanced</span> <span class="count"></span></div>
      <div class="view-toggle">
        <button class="view-btn active" data-view="list">📝 Lista</button>
        <button class="view-btn" data-view="grouped">🗂️ Agrupado</button>
        <button class="view-btn" data-view="stats">📊 Análisis</button>
        <button id="__fi_closebtn" title="Close">✕</button>
      </div>
    </header>
    <div class="filter-bar" id="__fi_filters">
      <button class="filter-btn active" data-filter="all">🔘 Todos <span class="count"></span></button>
      <button class="filter-btn" data-filter="text">📝 Text <span class="count"></span></button>
      <button class="filter-btn" data-filter="number">🔢 Number <span class="count"></span></button>
      <button class="filter-btn" data-filter="select">📋 Select <span class="count"></span></button>
      <button class="filter-btn" data-filter="textarea">📄 Textarea <span class="count"></span></button>
      <button class="filter-btn" data-filter="date">📅 Date <span class="count"></span></button>
      <button class="filter-btn" data-filter="checkbox">☑️ Check <span class="count"></span></button>
      <button class="filter-btn" data-filter="required">⚠️ Required <span class="count"></span></button>
      <button class="filter-btn" data-filter="filled">✅ Filled <span class="count"></span></button>
      <button class="filter-btn" data-filter="empty">⭕ Empty <span class="count"></span></button>
    </div>
    <div class="stats-panel" id="__fi_stats">
      <div class="stat-row">
        <span class="stat-label">📊 Total campos:</span>
        <span class="stat-value" id="stat-total">0</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">✅ Completados:</span>
        <span class="stat-value" id="stat-filled">0 (0%)</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">⚠️ Requeridos vacíos:</span>
        <span class="stat-value" id="stat-required-empty">0</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🔗 Con dependencias:</span>
        <span class="stat-value" id="stat-deps">0</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🔒 Deshabilitados:</span>
        <span class="stat-value" id="stat-disabled">0</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">📝 Por tipo más común:</span>
        <span class="stat-value" id="stat-common-type">-</span>
      </div>
    </div>
    <div class="controls">
      <input id="__fi_search" type="search" placeholder="🔍 Buscar key…">
      <button id="__fi_copy" class="primary">📋 Copiar</button>
      <button id="__fi_export_full">📊 Export Full</button>
      <button id="__fi_select_all">✨ Resaltar todos</button>
      <button id="__fi_clear">🧹 Limpiar</button>
    </div>
    <div class="list" id="__fi_list"></div>
    <footer>🚀 Enhanced version • Click rows to highlight • Hover badges for info</footer>
  `;
  document.body.appendChild(modal);

  const listEl = modal.querySelector('#__fi_list');
  const countEl = modal.querySelector('.count');
  const searchInput = modal.querySelector('#__fi_search');
  const filterBar = modal.querySelector('#__fi_filters');
  const statsPanel = modal.querySelector('#__fi_stats');

  let includeIds = false;
  let keysData = computeKeysWithMetadata(includeIds);
  let currentView = 'list';
  let activeFilters = new Set(['all']);
  const cycles = new Map();

  function download(filename, content, mime){
    const a = document.createElement('a');
    const blob = new Blob([content], {type: mime||'text/plain'});
    a.href = URL.createObjectURL(blob); 
    a.download = filename;
    document.body.appendChild(a); 
    a.click(); 
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1500);
  }

  // Update filter counts
  function updateFilterCounts() {
    const counts = {
      all: keysData.length,
      text: 0, number: 0, select: 0, textarea: 0, date: 0,
      checkbox: 0, radio: 0, required: 0, filled: 0, empty: 0
    };
    
    keysData.forEach(data => {
      if (data.type) counts[data.type] = (counts[data.type] || 0) + 1;
      if (data.required) counts.required++;
      if (data.filled) counts.filled++;
      if (!data.filled) counts.empty++;
    });
    
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const countSpan = btn.querySelector('.count');
      if (countSpan && counts[filter] !== undefined) {
        countSpan.textContent = `(${counts[filter]})`;
      }
    });
  }

  // Update statistics
  function updateStats() {
    const total = keysData.length;
    const filled = keysData.filter(d => d.filled).length;
    const requiredEmpty = keysData.filter(d => d.required && !d.filled).length;
    const withDeps = keysData.filter(d => d.dependencies.dependsOn.length > 0 || d.dependencies.enables.length > 0).length;
    const disabled = keysData.filter(d => d.disabled).length;
    
    const typeCounts = {};
    keysData.forEach(d => {
      typeCounts[d.type] = (typeCounts[d.type] || 0) + 1;
    });
    const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-filled').textContent = `${filled} (${Math.round(filled/total*100)}%)`;
    document.getElementById('stat-required-empty').textContent = requiredEmpty;
    document.getElementById('stat-deps').textContent = withDeps;
    document.getElementById('stat-disabled').textContent = disabled;
    document.getElementById('stat-common-type').textContent = mostCommon ? `${TYPE_ICONS[mostCommon[0]] || ''} ${mostCommon[0]} (${mostCommon[1]})` : '-';
  }

  // Check if item passes filters
  function passesFilters(data) {
    if (activeFilters.has('all')) return true;
    
    for (let filter of activeFilters) {
      if (filter === data.type) return true;
      if (filter === 'required' && data.required) return true;
      if (filter === 'filled' && data.filled) return true;
      if (filter === 'empty' && !data.filled) return true;
    }
    
    return false;
  }

  // Build enhanced row
  function buildEnhancedRow(data){
    const row = document.createElement('div'); 
    row.className = 'keyrow';
    row.dataset.key = data.key;
    row.dataset.type = data.type;
    
    const keyInfo = document.createElement('div');
    keyInfo.className = 'key-info';
    
    // Type icon
    const typeIcon = document.createElement('span');
    typeIcon.className = `key-type ${data.type}`;
    typeIcon.textContent = TYPE_ICONS[data.type] || '❓';
    typeIcon.title = `Tipo: ${data.type}`;
    
    // Key name
    const name = document.createElement('div');
    name.className = 'keyname';
    name.textContent = data.key;
    
    // Badges
    const badges = document.createElement('div');
    badges.className = 'key-badges';
    
    if (data.required) {
      const req = document.createElement('span');
      req.className = 'badge required';
      req.textContent = 'REQ';
      req.title = 'Campo requerido';
      badges.appendChild(req);
    }
    
    if (data.disabled) {
      const dis = document.createElement('span');
      dis.className = 'badge disabled';
      dis.textContent = 'DIS';
      dis.title = 'Campo deshabilitado';
      badges.appendChild(dis);
    }
    
    if (data.filled) {
      const fill = document.createElement('span');
      fill.className = 'badge filled';
      fill.textContent = '✓';
      fill.title = `Valor: ${data.value.substring(0, 50)}${data.value.length > 50 ? '...' : ''}`;
      badges.appendChild(fill);
    }
    
    if (data.dependencies.dependsOn.length > 0 || data.dependencies.enables.length > 0) {
      const dep = document.createElement('span');
      dep.className = 'badge dependent';
      dep.textContent = '🔗';
      
      let depInfo = '';
      if (data.dependencies.dependsOn.length > 0) {
        depInfo += `Depende de: ${data.dependencies.dependsOn.join(', ')}\n`;
      }
      if (data.dependencies.enables.length > 0) {
        depInfo += `Habilita: ${data.dependencies.enables.join(', ')}`;
      }
      dep.title = depInfo;
      badges.appendChild(dep);
    }
    
    keyInfo.appendChild(typeIcon);
    keyInfo.appendChild(name);
    keyInfo.appendChild(badges);
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'actions';

    // Enhanced Go button
    const goBtn = document.createElement('span');
    goBtn.className = 'actionlink __go';
    goBtn.textContent = 'Ir';
    goBtn.title = 'Navegar al campo';
    
    if(!cycles.has(data.key)) cycles.set(data.key, {idx:0});

    goBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const els = data.elements;
      if(els.length === 0){ 
        alert('No se encontraron elementos para: ' + data.key); 
        return; 
      }

      clearGoSelection();

      const st = cycles.get(data.key);
      const el = els[st.idx % els.length];

      el.classList.add(GO_ACTIVE_CLASS);

      try{
        el.scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
        el.animate(
          [
            { boxShadow:'0 0 0 8px rgba(11,116,222,0)' },
            { boxShadow:'0 0 0 8px rgba(11,116,222,.6)' },
            { boxShadow:'0 0 0 8px rgba(11,116,222,0)' }
          ],
          { duration:700 }
        );
      }catch(e){}

      st.idx++;

      // Show field info
      const metadata = getFieldMetadata(els);
      actions.querySelector('.foundcount')?.remove();
      const fc = document.createElement('span');
      fc.className='foundcount';
      fc.style.marginLeft='8px';
      fc.style.color='#666';
      fc.style.fontSize='10px';
      
      let info = `(${((st.idx-1)%els.length)+1}/${els.length})`;
      if (metadata.value) {
        info += ` [${metadata.value.substring(0, 20)}${metadata.value.length > 20 ? '...' : ''}]`;
      }
      fc.textContent = info;
      actions.appendChild(fc);
    });

    // Highlight button
    const showBtn = document.createElement('span');
    showBtn.className = 'actionlink';
    showBtn.textContent = 'Resaltar';
    showBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const els = data.elements;
      if(els.length===0){ 
        alert('No se encontraron elementos para: ' + data.key); 
        return; 
      }
      els.forEach(el=>highlightElement(el, data.key));
    });

    // Copy button
    const copyBtn = document.createElement('span');
    copyBtn.className = 'actionlink';
    copyBtn.textContent = 'Copiar';
    copyBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      navigator.clipboard?.writeText(data.key);
      
      // Visual feedback
      copyBtn.textContent = '✓';
      copyBtn.style.color = '#0a0';
      setTimeout(() => {
        copyBtn.textContent = 'Copiar';
        copyBtn.style.color = '';
      }, 1000);
    });

    actions.appendChild(goBtn);
    actions.appendChild(showBtn);
    actions.appendChild(copyBtn);
    
    row.appendChild(keyInfo);
    row.appendChild(actions);

    // Click on row -> highlight + scroll to first
    row.addEventListener('click',(ev)=>{
      if(ev.target?.classList?.contains('actionlink')) return;
      const els = data.elements;
      if(els.length===0){ 
        alert('No se encontraron elementos para: ' + data.key); 
        return; 
      }
      els[0].scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
      els.forEach(e=>highlightElement(e, data.key));
    });

    return row;
  }

  // Build grouped view
  function buildGroupedView() {
    listEl.innerHTML = '';
    const groups = groupKeysByPrefix(keysData);
    
    Object.entries(groups).forEach(([groupName, groupItems]) => {
      // Group header
      const header = document.createElement('div');
      header.className = 'group-header';
      
      const toggle = document.createElement('span');
      toggle.className = 'group-toggle';
      toggle.textContent = '▼';
      
      const name = document.createElement('span');
      name.className = 'group-name';
      name.textContent = groupName.charAt(0).toUpperCase() + groupName.slice(1);
      
      const count = document.createElement('span');
      count.className = 'group-count';
      count.textContent = `(${groupItems.length})`;
      
      const actions = document.createElement('div');
      actions.className = 'group-actions';
      
      const highlightGroup = document.createElement('span');
      highlightGroup.className = 'group-action';
      highlightGroup.textContent = 'Resaltar grupo';
      highlightGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        groupItems.forEach(data => {
          data.elements.forEach(el => highlightElement(el, data.key));
        });
      });
      
      const copyGroup = document.createElement('span');
      copyGroup.className = 'group-action';
      copyGroup.textContent = 'Copiar keys';
      copyGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        const keys = groupItems.map(d => d.key).join(',');
        navigator.clipboard?.writeText(keys);
        copyGroup.textContent = '✓';
        setTimeout(() => copyGroup.textContent = 'Copiar keys', 1000);
      });
      
      actions.appendChild(highlightGroup);
      actions.appendChild(copyGroup);
      
      header.appendChild(toggle);
      header.appendChild(name);
      header.appendChild(count);
      header.appendChild(actions);
      
      // Group content
      const content = document.createElement('div');
      content.className = 'group-content';
      
      groupItems.forEach(data => {
        if (passesFilters(data)) {
          content.appendChild(buildEnhancedRow(data));
        }
      });
      
      // Toggle collapse
      header.addEventListener('click', (e) => {
        if (!e.target.classList.contains('group-action')) {
          toggle.classList.toggle('collapsed');
          content.classList.toggle('collapsed');
        }
      });
      
      listEl.appendChild(header);
      listEl.appendChild(content);
    });
  }

  // Render list
  function renderList(){
    if (currentView === 'grouped') {
      buildGroupedView();
    } else {
      listEl.innerHTML = '';
      keysData.forEach(data => {
        if (passesFilters(data)) {
          listEl.appendChild(buildEnhancedRow(data));
        }
      });
    }
    applyFilter();
    updateVisibleCount();
  }

  // Apply search filter
  function applyFilter(){
    const q = (searchInput.value||'').toLowerCase();
    let visible = 0;
    
    listEl.querySelectorAll('.keyrow').forEach(row=>{
      const key = row.dataset.key;
      const matchesSearch = !q || key.toLowerCase().includes(q);
      const matchesFilter = passesFilters(keysData.find(d => d.key === key));
      const show = matchesSearch && matchesFilter;
      
      row.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    
    updateVisibleCount();
  }

  // Update visible count
  function updateVisibleCount() {
    const visible = Array.from(listEl.querySelectorAll('.keyrow')).filter(r => r.style.display !== 'none').length;
    countEl.textContent = `(${visible} visible de ${keysData.length})`;
  }

  // Initial setup
  updateFilterCounts();
  updateStats();
  renderList();

  // ---------- Event Handlers ----------
  modal.querySelector('#__fi_closebtn').addEventListener('click', cleanup);

  modal.querySelector('#__fi_clear').addEventListener('click', ()=>{
    document.querySelectorAll('.'+HIGHLIGHT_CLASS).forEach(el=>{
      el.classList.remove(HIGHLIGHT_CLASS);
      if(el.__fi_label){ try{ el.__fi_label.remove(); delete el.__fi_label; }catch(e){} }
    });
    clearGoSelection();
  });

  modal.querySelector('#__fi_select_all').addEventListener('click', ()=>{
    keysData.forEach(data => {
      if (passesFilters(data)) {
        data.elements.forEach(el => highlightElement(el, data.key));
      }
    });
  });

  modal.querySelector('#__fi_copy').addEventListener('click', ()=>{
    const visibleKeys = keysData
      .filter(data => passesFilters(data))
      .map(d => d.key);
    const txt = visibleKeys.join(',');
    if(navigator.clipboard?.writeText){
      navigator.clipboard.writeText(txt).then(()=>{
        const btn = modal.querySelector('#__fi_copy');
        btn.textContent = '✓ Copiado';
        setTimeout(() => btn.textContent = '📋 Copiar', 1500);
      });
    } else { 
      prompt('Copia manualmente:', txt); 
    }
  });

  // Export full data with metadata
  modal.querySelector('#__fi_export_full').addEventListener('click', ()=>{
    const exportData = keysData.map(d => ({
      key: d.key,
      type: d.type,
      required: d.required,
      disabled: d.disabled,
      filled: d.filled,
      value: d.value,
      elementCount: d.elementCount,
      dependsOn: d.dependencies.dependsOn.join(','),
      enables: d.dependencies.enables.join(',')
    }));
    
    // Create CSV
    const headers = ['key', 'type', 'required', 'disabled', 'filled', 'value', 'elementCount', 'dependsOn', 'enables'];
    const csv = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');
    
    download('formio-keys-analysis.csv', csv, 'text/csv');
  });

  // Filter buttons
  filterBar.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    
    const filter = e.target.getAttribute('data-filter');
    
    if (filter === 'all') {
      // Clear all and set only 'all'
      filterBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      activeFilters = new Set(['all']);
    } else {
      // Toggle specific filter
      filterBar.querySelector('[data-filter="all"]').classList.remove('active');
      activeFilters.delete('all');
      
      if (activeFilters.has(filter)) {
        activeFilters.delete(filter);
        e.target.classList.remove('active');
      } else {
        activeFilters.add(filter);
        e.target.classList.add('active');
      }
      
      // If no filters, activate 'all'
      if (activeFilters.size === 0) {
        activeFilters.add('all');
        filterBar.querySelector('[data-filter="all"]').classList.add('active');
      }
    }
    
    renderList();
  });

  // View toggle
  modal.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const view = btn.getAttribute('data-view');
      currentView = view;
      
      // Show/hide panels
      statsPanel.classList.toggle('show', view === 'stats');
      listEl.style.display = view === 'stats' ? 'none' : 'block';
      
      if (view !== 'stats') {
        renderList();
      }
    });
  });

  // Search
  searchInput.addEventListener('input', applyFilter);
  
  searchInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const firstVisible = Array.from(listEl.querySelectorAll('.keyrow')).find(r => r.style.display !== 'none');
      if(firstVisible){
        const go = firstVisible.querySelector('.actionlink.__go');
        if(go) go.dispatchEvent(new MouseEvent('click', {bubbles:true}));
      }
    }
  });

  // ESC to close
  window.addEventListener('keydown', function escHandler(e){
    if(e.key === 'Escape') cleanup();
  });

})();
