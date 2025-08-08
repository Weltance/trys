// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Parallax (mild) - disabled on mobile via CSS hiding .decor
const px = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  px.forEach(el=>{
    const s = parseFloat(el.getAttribute('data-speed'))||0.1;
    el.style.transform = `translateY(${y*s}px)`;
  });
}, { passive: true });

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(btn=>{
  const k = 16;
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x=e.clientX-(r.left+r.width/2), y=e.clientY-(r.top+r.height/2);
    btn.style.transform=`translate(${x/k}px,${y/k}px)`;
  });
  btn.addEventListener('mouseleave', ()=> btn.style.transform='');
});

// Theme toggle (persisted + emoji state)
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
const setEmoji = ()=>{ themeBtn.textContent = root.classList.contains('theme-dark') ? '☀️' : '🌙'; };
if(savedTheme === 'dark'){ root.classList.add('theme-dark'); }
if(themeBtn){ setEmoji(); themeBtn.addEventListener('click', ()=>{
  root.classList.toggle('theme-dark');
  localStorage.setItem('theme', root.classList.contains('theme-dark') ? 'dark' : 'light');
  setEmoji();
});}

// Scrollspy
const ids=['home','product','about','contact'];
const links = new Map(ids.map(id=>[id, document.querySelector(`a[href="#${id}"]`)]));
const spy=new IntersectionObserver((es)=>{
  es.forEach(en=>{
    if(en.isIntersecting){
      const id=en.target.id;
      links.forEach(l=>l?.classList.remove('active'));
      links.get(id)?.classList.add('active');
    }
  });
},{rootMargin:'-40% 0px -50% 0px', threshold:0.01});
ids.forEach(id=>{ const el=document.getElementById(id); if(el) spy.observe(el); });

// Counters
const counters=document.querySelectorAll('.count');
const io2=new IntersectionObserver((es)=>{
  es.forEach(en=>{
    if(en.isIntersecting){
      const el=en.target; const target=parseInt(el.dataset.target||'0',10);
      let n=0; const inc=Math.max(1, Math.floor(target/60));
      const t=setInterval(()=>{ n+=inc; if(n>=target){ n=target; clearInterval(t);} el.textContent=n; }, 16);
      io2.unobserve(el);
    }
  });
},{threshold:0.4});
counters.forEach(c=>io2.observe(c));

// Newsletter demo
document.getElementById('newsletter-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Subscribed!');
});

// Mobile hamburger toggle
const navEl = document.querySelector('.nav');
const navToggle = document.getElementById('nav-toggle');
navToggle?.addEventListener('click', (ev)=>{
  ev.stopPropagation();
  const open = navEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
// Close only on anchor click (not on select)
document.querySelectorAll('.nav-links a').forEach(el=>{
  el.addEventListener('click', ()=> navEl.classList.remove('open'));
});
// Avoid closing when tapping inside the panel
document.querySelector('.nav-links')?.addEventListener('click', e=> e.stopPropagation());
document.addEventListener('click', ()=> navEl.classList.remove('open'));
