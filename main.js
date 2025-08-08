// Basic reveals & interactions (unchanged essentials)
const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); } }); }, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const ioItems = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); ioItems.unobserve(e.target); } }); }, { threshold: 0.25 });
document.querySelectorAll('.micro-animate .anim-item').forEach(el=> ioItems.observe(el));

document.querySelectorAll('.magnetic').forEach(btn=>{
  const k = 16;
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x=e.clientX-(r.left+r.width/2), y=e.clientY-(r.top+r.height/2);
    btn.style.transform=`translate(${x/k}px,${y/k}px)`;
  });
  btn.addEventListener('mouseleave', ()=> btn.style.transform='');
});

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

const ids=['home','product','about','contact'];
const links = new Map(ids.map(id=>[id, document.querySelector(`a[href="#${id}"]`)]));
const spy=new IntersectionObserver((es)=>{
  es.forEach(en=>{ if(en.isIntersecting){ const id=en.target.id; links.forEach(l=>l?.classList.remove('active')); links.get(id)?.classList.add('active'); } });
},{rootMargin:'-40% 0px -50% 0px', threshold:0.01});
ids.forEach(id=>{ const el=document.getElementById(id); if(el) spy.observe(el); });

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

document.getElementById('newsletter-form')?.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Subscribed!'); });

const navEl = document.querySelector('.nav');
const navToggle = document.getElementById('nav-toggle');
navToggle?.addEventListener('click', (ev)=>{ ev.stopPropagation(); const open = navEl.classList.toggle('open'); navToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); });
document.querySelectorAll('.nav-links a').forEach(el=> el.addEventListener('click', ()=> navEl.classList.remove('open')));
document.querySelector('.nav-links')?.addEventListener('click', e=> e.stopPropagation());
document.addEventListener('click', ()=> navEl.classList.remove('open'));

window.startTyped = function(lang){
  const el = document.getElementById('typed');
  if(!el) return;
  const dict = (window.translations && window.translations[lang]) || {};
  const set = dict.typed_variants || ["Build. Scale. Dominate."];
  let i=0, j=0, dir=1;
  function tick(){
    const word = set[i];
    j += dir;
    el.textContent = word.slice(0, j);
    if(j === word.length){ dir = -1; setTimeout(tick, 1200); return; }
    if(j === 0){ dir = 1; i = (i+1) % set.length; }
    setTimeout(tick, dir>0 ? 55 : 25);
  }
  tick();
};
window.addEventListener('DOMContentLoaded', ()=>{ const saved = localStorage.getItem('lang') || 'en'; window.startTyped(saved); });

(function(){
  const carousel = document.getElementById('testimonial-carousel');
  if(!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  let index = 0;
  function update(){ track.style.transform = `translateX(${-index*100}%)`; }
  carousel.querySelector('.prev')?.addEventListener('click', ()=>{ index = (index-1+slides.length)%slides.length; update(); });
  carousel.querySelector('.next')?.addEventListener('click', ()=>{ index = (index+1)%slides.length; update(); });
  let timer = setInterval(()=>{ index = (index+1)%slides.length; update(); }, 5000);
  carousel.addEventListener('mouseenter', ()=> clearInterval(timer));
  carousel.addEventListener('mouseleave', ()=> timer = setInterval(()=>{ index = (index+1)%slides.length; update(); }, 5000));
})();

(function(){ const dot = document.getElementById('dot'); if(!dot) return; let x=0, y=0, tx=0, ty=0; document.addEventListener('mousemove', (e)=>{ tx=e.clientX; ty=e.clientY; }); function loop(){ x += (tx - x)*0.15; y += (ty - y)*0.15; dot.style.transform = `translate(${x}px, ${y}px)`; requestAnimationFrame(loop);} loop(); })();

(function(){
  const btn = document.getElementById('to-top');
  const bar = document.getElementById('scroll-progress');
  function onScroll(){
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, y / (h || 1)));
    if(y > 400){ btn.classList.add('show'); } else { btn.classList.remove('show'); }
    if(bar) bar.style.width = (p*100).toFixed(1) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn?.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
})();

