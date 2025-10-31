javascript:(function(){
  if(window.__formioKeysFinderRunning){ window.__formioKeysFinderRunning++ ; console.warn('Formio Keys Finder ya estaba corriendo. contador:', window.__formioKeysFinderRunning); return; }
  window.__formioKeysFinderRunning = 1;

  const HIGHLIGHT_CLASS = '__fi_key_highlight';
  const MODAL_ID = '__fi_key_modal';
  const styles = `
    .${HIGHLIGHT_CLASS} { box-shadow: 0 0 0 3px rgba(255,200,0,0.9) !important; border-radius: 6px !important; position: relative; z-index: 9999999 !important; }
    #${MODAL_ID} { position: fixed; right: 18px; top: 18px; width: 420px; max-height: 70vh; overflow:auto; background: #fff; color:#111; border: 1px solid #ddd; box-shadow: 0 8px 30px rgba(0,0,0,0.25); z-index: 10000000; font-family: Arial, sans-serif; font-size:13px; border-radius:8px; }
    #${MODAL_ID} header { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid #eee; }
    #${MODAL_ID} .title { font-weight:600; }
    #${MODAL_ID} .count { color:#666; font-size:12px; margin-left:8px; }
    #${MODAL_ID} .controls { padding:8px 12px; display:flex; gap:8px; flex-wrap:wrap; }
    #${MODAL_ID} button { padding:6px 8px; border-radius:6px; border:1px solid #bbb; background:#fafafa; cursor:pointer; }
    #${MODAL_ID} button.primary { background:#0b74de; color:white; border-color:#0b74de; }
    #${MODAL_ID} .list { padding:8px 12px; max-height:46vh; overflow:auto; }
    #${MODAL_ID} .keyrow { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed #efefef; }
    #${MODAL_ID} .keyname { word-break:break-all; flex:1; }
    #${MODAL_ID} .actionlink { margin-left:8px; color:#0b74de; cursor:pointer; font-size:12px; }
    #${MODAL_ID} footer { padding:8px 12px; border-top:1px solid #eee; text-align:right; font-size:12px; color:#666; }
  `;

  // inject styles
  const styleTag = document.createElement('style');
  styleTag.id = '__fi_style_inject';
  styleTag.innerText = styles;
  document.head.appendChild(styleTag);

  // Helper: safe text
  const s = v => (v||'').toString().trim();

  // Find keys via many selectors / heuristics
  function findKeys(){
    const keys = new Set();

    // 1) class names like formio-component-<key>
    document.querySelectorAll('[class]').forEach(el=>{
      const cl = el.className;
      if(!cl) return;
      // match formio-component-xxx or formio-component-xxx_y
      const re = /(?:\b|^)formio-component-([A-Za-z0-9_\-:]+)/g;
      let m;
      while((m=re.exec(cl)) !== null) keys.add(s(m[1]));
    });

    // 2) data-component-key / data-key
    document.querySelectorAll('[data-component-key], [data-key]').forEach(el=>{
      const k1 = el.getAttribute('data-component-key');
      const k2 = el.getAttribute('data-key');
      if(k1) keys.add(s(k1));
      if(k2) keys.add(s(k2));
    });

    // 3) name attributes like name="data[<key>]" or name="data[<path>][<key>]"
    document.querySelectorAll('[name]').forEach(el=>{
      const name = el.getAttribute('name') || '';
      // find data[xxx] occurrences
      const re = /data\[(?:'|")?([^\]\['"]+)(?:'|")?\]/g;
      let m;
      while((m=re.exec(name)) !== null) keys.add(s(m[1]));
      // also try simple name equal to key
      if(/^data\.[A-Za-z0-9_]+$/.test(name)) keys.add(name.split('.')[1]);
    });

    // 4) ref attributes like ref="component-<key>" or ref="component-<key>-..."
    document.querySelectorAll('[ref]').forEach(el=>{
      const ref = el.getAttribute('ref') || '';
      const re = /component-([A-Za-z0-9_\-:]+)/;
      const m = ref.match(re);
      if(m) keys.add(s(m[1]));
    });

    // 5) id attributes that include the key pattern (fallback)
    document.querySelectorAll('[id]').forEach(el=>{
      const id = el.getAttribute('id') || '';
      const re = /(?:component-)?([A-Za-z0-9_:-]{3,})/;
      const m = id.match(re);
      if(m) {
        // add heuristically but keep short ids (>3)
        if(m[1] && m[1].length>3) keys.add(s(m[1]));
      }
    });

    // 6) inline data-component or other attributes
    document.querySelectorAll('[data-component], [data-field], [data-key-path]').forEach(el=>{
      ['data-component','data-field','data-key-path'].forEach(att=>{
        const v = el.getAttribute(att);
        if(v) {
          // split common separators
          v.split(/[ ,;|\/]+/).forEach(p=>{ if(p && p.length>0) keys.add(s(p)); });
        }
      });
    });

    // 7) text nodes that look like "key: <something>" inside labels (rare)
    // skip for performance

    return Array.from(keys).filter(x=>x && x.length>0).sort();
  }

  // Highlight elements that match a given key (all possible selectors)
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
    // unique elements
    const els = new Set();
    sels.forEach(s=> {
      try {
        document.querySelectorAll(s).forEach(e=>els.add(e));
      } catch(e) { /* ignore bad selector */ }
    });
    return Array.from(els);
  }

  // Add highlight class and attach click to scroll/focus + tooltip
  function highlightElement(el, key){
    if(!el) return;
    el.classList.add(HIGHLIGHT_CLASS);
    // add small overlay label if not present
    if(!el.__fi_label){
      try{
        const badge = document.createElement('div');
        badge.innerText = key;
        badge.style.cssText = 'position:absolute;z-index:10000001;font-size:11px;padding:2px 6px;border-radius:6px;background:rgba(11,116,222,0.95);color:white;top:4px;left:4px;';
        badge.className = '__fi_key_badge';
        // position parent relative if not already
        const prevPos = window.getComputedStyle(el).position;
        if(prevPos === 'static' || !prevPos) el.style.position = 'relative';
        el.appendChild(badge);
        el.__fi_label = badge;
      }catch(e){}
    }
    // on click: scrollIntoView and flash
    el.addEventListener('click', function handler(ev){
      ev.stopPropagation(); ev.preventDefault();
      try{ el.scrollIntoView({behavior:'smooth', block:'center', inline:'center'}); 
        el.animate([{boxShadow:'0 0 0 8px rgba(255,200,0,0.0)'},{boxShadow:'0 0 0 8px rgba(255,200,0,0.95)'},{boxShadow:'0 0 0 8px rgba(255,200,0,0.0)'}], {duration:700});
      }catch(e){}
      return false;
    }, {once:true});
  }

  // Remove highlights & modal cleanup
  function cleanup(){
    document.querySelectorAll('.'+HIGHLIGHT_CLASS).forEach(el=>{
      el.classList.remove(HIGHLIGHT_CLASS);
      // remove badge
      if(el.__fi_label){ try{ el.__fi_label.remove(); delete el.__fi_label; }catch(e){} }
    });
    const m = document.getElementById(MODAL_ID);
    if(m) m.remove();
    if(styleTag) styleTag.remove();
    delete window.__formioKeysFinderRunning;
  }

  // Build modal UI
  function buildModal(keys){
    // remove old if exists
    const old = document.getElementById(MODAL_ID);
    if(old) old.remove();

    const modal = document.createElement('div');
    modal.id = MODAL_ID;

    modal.innerHTML = `
      <header>
        <div>
          <span class="title">Form.io Keys Finder</span>
          <span class="count">(${keys.length} unique)</span>
        </div>
        <div>
          <button id="__fi_closebtn" title="Cerrar">✕</button>
        </div>
      </header>
      <div class="controls">
        <button id="__fi_copy" class="primary">Copiar (clipboard)</button>
        <button id="__fi_download_csv">Descargar CSV</button>
        <button id="__fi_download_json">Descargar JSON</button>
        <button id="__fi_select_all">Resaltar todos</button>
        <button id="__fi_clear">Limpiar resaltados</button>
        <button id="__fi_toggle_ids">Incluir IDs heurísticos</button>
      </div>
      <div class="list" id="__fi_list"></div>
      <footer>Click en cada fila para resaltar y hacer scroll. Export disponible.</footer>
    `;
    document.body.appendChild(modal);

    const list = modal.querySelector('#__fi_list');

    if(keys.length === 0){
      list.innerHTML = '<div style="padding:12px;color:#666">No se detectaron keys con los heurísticos. Prueba abrir el builder o el form cargado.</div>';
    } else {
      keys.forEach(k=>{
        const row = document.createElement('div');
        row.className = 'keyrow';
        const name = document.createElement('div');
        name.className = 'keyname';
        name.innerText = k;
        const actions = document.createElement('div');
        actions.style.display='flex';

        const showBtn = document.createElement('span');
        showBtn.className = 'actionlink';
        showBtn.innerText = 'Resaltar';
        showBtn.title = 'Resaltar elementos para esta key en la página';
        showBtn.addEventListener('click', ()=> {
          const els = findElementsByKey(k);
          if(els.length===0){
            alert('No se encontraron elementos para: ' + k);
            return;
          }
          els.forEach(e=>highlightElement(e,k));
          // update counter
          row.querySelector('.foundcount') && row.querySelector('.foundcount').remove();
          const fc = document.createElement('span'); fc.className='foundcount'; fc.style.marginLeft='8px'; fc.style.color='#666'; fc.innerText = '('+els.length+' encontrados)';
          actions.appendChild(fc);
        });

        const copyBtn = document.createElement('span');
        copyBtn.className = 'actionlink';
        copyBtn.innerText = 'Copiar';
        copyBtn.title = 'Copiar solo esta key';
        copyBtn.addEventListener('click', ()=> {
          navigator.clipboard && navigator.clipboard.writeText(k);
          alert('Copiado: ' + k);
        });

        actions.appendChild(showBtn);
        actions.appendChild(copyBtn);
        row.appendChild(name);
        row.appendChild(actions);

        // click on row -> highlight + scroll
        row.addEventListener('click', (ev)=>{
          if(ev.target && ev.target.classList && ev.target.classList.contains('actionlink')) return; // ignore if clicked actionlink
          const els = findElementsByKey(k);
          if(els.length===0){ alert('No se encontraron elementos para: ' + k); return; }
          els[0].scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
          els.forEach(e=>highlightElement(e,k));
        });

        list.appendChild(row);
      });
    }

    // Buttons
    modal.querySelector('#__fi_closebtn').addEventListener('click', cleanup);
    modal.querySelector('#__fi_clear').addEventListener('click', ()=> {
      document.querySelectorAll('.'+HIGHLIGHT_CLASS).forEach(el=>{
        el.classList.remove(HIGHLIGHT_CLASS);
        if(el.__fi_label){ try{ el.__fi_label.remove(); delete el.__fi_label; }catch(e){} }
      });
    });

    modal.querySelector('#__fi_select_all').addEventListener('click', ()=> {
      keys.forEach(k=>{
        const els = findElementsByKey(k);
        els.forEach(e=>highlightElement(e,k));
      });
    });

    modal.querySelector('#__fi_copy').addEventListener('click', ()=> {
      const txt = keys.join(',');
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(()=>{ alert('Keys copiadas al portapapeles'); }).catch(()=>{ prompt('Copia manualmente:', txt); });
      } else { prompt('Copia manualmente:', txt); }
    });

    function download(filename, content, type){
      const a = document.createElement('a');
      const blob = new Blob([content], {type: type||'text/plain'});
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href), 3000);
    }

    modal.querySelector('#__fi_download_csv').addEventListener('click', ()=> {
      const csv = keys.map(k=>`"${k.replace(/"/g,'""')}"`).join('\\n');
      download('formio-keys.csv', csv, 'text/csv');
    });

    modal.querySelector('#__fi_download_json').addEventListener('click', ()=> {
      download('formio-keys.json', JSON.stringify(keys, null, 2), 'application/json');
    });

    // toggle heuristic IDs (re-run search that included id heuristics)
    let idsIncluded = false;
    modal.querySelector('#__fi_toggle_ids').addEventListener('click', ()=>{
      idsIncluded = !idsIncluded;
      const btn = modal.querySelector('#__fi_toggle_ids');
      btn.innerText = idsIncluded ? 'Excluir IDs heurísticos' : 'Incluir IDs heurísticos';
      // rebuild keys list
      const nkeys = computeKeys(idsIncluded);
      // replace list
      const newList = modal.querySelector('#__fi_list');
      newList.innerHTML = '';
      if(nkeys.length===0){
        newList.innerHTML = '<div style="padding:12px;color:#666">No se detectaron keys.</div>';
      } else {
        nkeys.forEach(k=>{
          const row = document.createElement('div'); row.className='keyrow';
          const name = document.createElement('div'); name.className='keyname'; name.innerText=k;
          const actions = document.createElement('div'); actions.style.display='flex';
          const showBtn = document.createElement('span'); showBtn.className='actionlink'; showBtn.innerText='Resaltar';
          showBtn.addEventListener('click', ()=> { const els=findElementsByKey(k); if(els.length===0){ alert('No se encontraron elementos para: '+k); return; } els.forEach(e=>highlightElement(e,k)); actions.querySelector('.foundcount') && actions.querySelector('.foundcount').remove(); const fc=document.createElement('span'); fc.className='foundcount'; fc.style.marginLeft='8px'; fc.style.color='#666'; fc.innerText='('+els.length+' encontrados)'; actions.appendChild(fc); });
          const copyBtn = document.createElement('span'); copyBtn.className='actionlink'; copyBtn.innerText='Copiar'; copyBtn.addEventListener('click', ()=>{ navigator.clipboard && navigator.clipboard.writeText(k); alert('Copiado: '+k); });
          actions.appendChild(showBtn); actions.appendChild(copyBtn);
          row.appendChild(name); row.appendChild(actions);
          row.addEventListener('click', (ev)=>{ if(ev.target && ev.target.classList && ev.target.classList.contains('actionlink')) return; const els=findElementsByKey(k); if(els.length===0){ alert('No se encontraron elementos para: '+k); return;} els[0].scrollIntoView({behavior:'smooth', block:'center'}); els.forEach(e=>highlightElement(e,k)); });
          newList.appendChild(row);
        });
      }
      // update count
      modal.querySelector('.count').innerText = '('+nkeys.length+' unique)';
      // update copy/download buttons to use this list
      modal.querySelector('#__fi_copy').onclick = ()=>{ const txt = nkeys.join(','); navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(txt).then(()=>alert('Keys copiadas al portapapeles')) : prompt('Copia manualmente:', txt); };
      modal.querySelector('#__fi_download_csv').onclick = ()=>{ const csv = nkeys.map(k=>`"${k.replace(/"/g,'""')}"`).join('\\n'); download('formio-keys.csv', csv, 'text/csv'); };
      modal.querySelector('#__fi_download_json').onclick = ()=>{ download('formio-keys.json', JSON.stringify(nkeys, null, 2), 'application/json'); };
    });

    return modal;
  }

  // compute keys (optionally include id heuristics)
  function computeKeys(includeIds){
    // Base findKeys (without step 5 id fallback)
    const baseKeys = (function(){
      const keys = new Set();

      // class names formio-component-*
      document.querySelectorAll('[class]').forEach(el=>{
        const cl = el.className;
        if(!cl) return;
        const re = /(?:\b|^)formio-component-([A-Za-z0-9_\-:]+)/g;
        let m;
        while((m=re.exec(cl)) !== null) keys.add(s(m[1]));
      });

      // data-component-key / data-key
      document.querySelectorAll('[data-component-key], [data-key]').forEach(el=>{
        const k1 = el.getAttribute('data-component-key');
        const k2 = el.getAttribute('data-key');
        if(k1) keys.add(s(k1));
        if(k2) keys.add(s(k2));
      });

      // name attributes like data[xxx]
      document.querySelectorAll('[name]').forEach(el=>{
        const name = el.getAttribute('name') || '';
        const re = /data\[(?:'|")?([^\]\['"]+)(?:'|")?\]/g;
        let m;
        while((m=re.exec(name)) !== null) keys.add(s(m[1]));
        if(/^data\.[A-Za-z0-9_]+$/.test(name)) keys.add(name.split('.')[1]);
      });

      // ref attributes
      document.querySelectorAll('[ref]').forEach(el=>{
        const ref = el.getAttribute('ref') || '';
        const re = /component-([A-Za-z0-9_\-:]+)/;
        const m = ref.match(re);
        if(m) keys.add(s(m[1]));
      });

      return Array.from(keys);
    })();

    if(!includeIds) return baseKeys.sort();

    // include id heuristics (IDs that might be keys but are heuristic)
    const idKeys = new Set(baseKeys);
    document.querySelectorAll('[id]').forEach(el=>{
      const id = el.getAttribute('id') || '';
      if(!id) return;
      // skip long auto guids
      if(/^[0-9a-f]{8}\-/.test(id)) return;
      // try to find parts that look like keys (words separated by - or _)
      id.split(/[-_:.]/).forEach(p=>{
        if(p && p.length>3 && /[A-Za-z]/.test(p)) idKeys.add(s(p));
      });
    });
    return Array.from(idKeys).sort();
  }

  // initial run
  const keys = computeKeys(false); // by default not include id heuristics
  const modal = buildModal(keys);
  // place modal if body is too narrow (mobile)
  // highlight nothing initially

  // Convenience: expose cleanup to global for dev
  window.__formioKeysFinderCleanup = cleanup;

  // accessibility: close with ESC
  window.addEventListener('keydown', function escHandler(e){
    if(e.key === 'Escape') cleanup();
  }, {once:false});

})();
