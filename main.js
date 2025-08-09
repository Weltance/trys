// v4.4.3 minimal interactions for stability

// Theme toggle
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  if(saved === 'dark') root.classList.add('theme-dark');
  const setIcon = ()=> btn && (btn.textContent = root.classList.contains('theme-dark') ? '☀️' : '🌙');
  setIcon();
  btn?.addEventListener('click', ()=>{
    root.classList.toggle('theme-dark');
    localStorage.setItem('theme', root.classList.contains('theme-dark') ? 'dark' : 'light');
    setIcon();
  });
})();

// Mobile nav (enhanced)
(function(){
  const nav=document.querySelector(".nav");
  const toggle=document.getElementById("nav-toggle");
  let backdrop=document.querySelector(".nav-backdrop");
  if(!backdrop){ backdrop=document.createElement("div"); backdrop.className="nav-backdrop"; document.body.appendChild(backdrop); }
  function isInsideNav(target){ return !!(target && (target.closest(".nav") || target.id==="language-switcher")); }
  function close(){ nav.classList.remove("open"); toggle?.setAttribute("aria-expanded","false"); toggle?.setAttribute("aria-label","Open menu"); }
  function open(){ nav.classList.add("open"); toggle?.setAttribute("aria-expanded","true"); toggle?.setAttribute("aria-label","Close menu"); }
  toggle?.addEventListener("click",(e)=>{ e.stopPropagation(); nav.classList.contains("open")?close():open(); });
  document.addEventListener("click",(e)=>{ if(!isInsideNav(e.target)) close(); });
  document.getElementById("menu")?.addEventListener("click",(e)=> e.stopPropagation());
  backdrop.addEventListener("click", ()=> close());
  const langSel = document.getElementById("language-switcher");
  if(langSel){
    ["click","mousedown","mouseup","touchstart"].forEach(ev=>{
      langSel.addEventListener(ev, (e)=> e.stopPropagation(), {passive:true});
    });
  }
})();

// i18n apply (robust) + lang/dir + typed refresh
(function(){
  const sel = document.getElementById('language-switcher');
  const rootHtml = document.documentElement;
  const supported = ['en','tr','ru','fr','ar','de'];
  const saved = localStorage.getItem('lang');
  let initial = saved && supported.includes(saved) ? saved : 'en';
  if(sel){
    // normalize options to supported
    sel.querySelectorAll('option').forEach(opt=>{
      if(!supported.includes(opt.value)) opt.remove();
    });
    if(!sel.querySelector('option[value="'+initial+'"]')) initial='en';
    sel.value = initial;
  }
  function setLangMeta(lang){ document.documentElement.setAttribute('lang', lang); document.documentElement.setAttribute('dir', lang==='ar'?'rtl':'ltr'); }
  function dictOf(lang){
    return (window.translations && window.translations[lang]) || {};
  }
  function apply(lang){
    setLangMeta(lang);
    const dict = dictOf(lang);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n'); if(dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
      const key = el.getAttribute('data-i18n-ph'); if(dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });
    // refresh typed variants
    const typedEl = document.getElementById('typed');
    if(typedEl){
      const variants = Array.isArray(dict.typed_variants) ? dict.typed_variants : [];
      // simple reset: take the first variant
      if(variants.length) typedEl.textContent = variants[0];
    }
  }
  apply(initial);
  sel && sel.addEventListener('change', (e)=>{
    e.stopPropagation();
    const v = sel.value;
    localStorage.setItem('lang', v);
    apply(v);
  });
})();

// Manual carousel only
(function(){
  const wrap = document.getElementById('testimonial-carousel');
  if(!wrap) return;
  const track = wrap.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  let index = 0;
  function update(){ track.style.transform = `translateX(${-index*100}%)`; }
  wrap.querySelector('.prev')?.addEventListener('click', ()=>{ index = (index-1+slides.length)%slides.length; update(); });
  wrap.querySelector('.next')?.addEventListener('click', ()=>{ index = (index+1)%slides.length; update(); });
})();

// Back-to-top visibility + scroll progress (rAF-throttled)
(function(){
  const btn = document.getElementById('to-top');
  const bar = document.getElementById('scroll-progress');
  let ticking = false;
  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(()=>{
        const y = window.scrollY;
        const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = Math.max(0, Math.min(1, y / h));
        if(btn){ if(y>400) btn.classList.add('show'); else btn.classList.remove('show'); }
        if(bar) bar.style.width = (p*100).toFixed(1) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn?.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
})();

// === Typed Headline (lightweight, i18n-aware) ===
(function(){
  const el = document.getElementById('typed');
  if(!el) return;
  function getSet(){
    const lang = localStorage.getItem('lang') || 'en';
    const dict = (window.translations && window.translations[lang]) || {};
    return dict.typed_variants || ["Build. Scale. Dominate.","From Nobody to Brand.","Make it unmistakable."];
  }
  let words = getSet(), i = 0, j = 0, dir = 1, hold = 0;
  function step(){
    const w = words[i];
    if(hold>0){ hold-=16; return requestAnimationFrame(step); }
    j += dir;
    el.textContent = w.slice(0, j);
    if(j >= w.length){ dir = -1; hold = 900; }
    else if(j <= 0){ dir = 1; i = (i+1)%words.length; }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  // refresh on language change
  const sel = document.getElementById('language-switcher');
  sel && sel.addEventListener('change', ()=>{ words = getSet(); i = 0; j = 0; dir = 1; hold = 0; });
})();

// === Stat Counters (IO + rAF) ===
(function(){
  const counters = document.querySelectorAll('.count');
  if(!counters.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.getAttribute('data-target')||'0',10);
      const start = performance.now(); const dur = 1200;
      function tick(t){
        const p = Math.min(1, (t - start)/dur);
        el.textContent = Math.round(target * (p*p*(3-2*p))); // smoothstep
        if(p<1) requestAnimationFrame(tick); else io.unobserve(el);
      }
      requestAnimationFrame(tick);
    });
  },{threshold:0.4});
  counters.forEach(c=> io.observe(c));
})();

// === Testimonials Auto Carousel (visibility-aware) ===
(function(){
  const wrap = document.getElementById('testimonial-carousel');
  if(!wrap) return;
  const track = wrap.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  let index = 0, timer = null, hovered = false;

  function update(){ track.style.transform = `translateX(${-index*100}%)`; }
  function start(){
    if(timer) return;
    timer = setInterval(()=>{
      if(document.hidden || hovered) return;
      index = (index+1)%slides.length; update();
    }, 6000);
  }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }

  wrap.querySelector('.prev')?.addEventListener('click', ()=>{ index = (index-1+slides.length)%slides.length; update(); });
  wrap.querySelector('.next')?.addEventListener('click', ()=>{ index = (index+1)%slides.length; update(); });

  wrap.addEventListener('mouseenter', ()=>{ hovered = true; });
  wrap.addEventListener('mouseleave', ()=>{ hovered = false; });

  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden) stop(); else start();
  });

  update(); start();
})();
