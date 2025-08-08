// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Micro-animations for items
const ioItems = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); ioItems.unobserve(e.target); } });
}, { threshold: 0.25 });
document.querySelectorAll('.micro-animate .anim-item').forEach(el=> ioItems.observe(el));

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

// Theme toggle
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

// Scrollspy highlight
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

// Mobile hamburger
const navEl = document.querySelector('.nav');
const navToggle = document.getElementById('nav-toggle');
navToggle?.addEventListener('click', (ev)=>{
  ev.stopPropagation();
  const open = navEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav-links a').forEach(el=> el.addEventListener('click', ()=> navEl.classList.remove('open')));
document.querySelector('.nav-links')?.addEventListener('click', e=> e.stopPropagation());
document.addEventListener('click', ()=> navEl.classList.remove('open'));

// Typed text
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
window.addEventListener('DOMContentLoaded', ()=>{
  const saved = localStorage.getItem('lang') || 'en';
  window.startTyped(saved);
});

// Testimonials carousel
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

// Mouse follower
(function(){
  const dot = document.getElementById('dot'); if(!dot) return;
  let x=0, y=0, tx=0, ty=0;
  document.addEventListener('mousemove', (e)=>{ tx=e.clientX; ty=e.clientY; });
  function loop(){
    x += (tx - x)*0.15; y += (ty - y)*0.15;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  }
  loop();
})();

// Back to top + scroll progress
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

// Perlin-noise Topography
(function(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=0, h=0, dpr=1, t=0;

  function fit(){
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio||1, 2);
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.floor(w*dpr);
    canvas.height = Math.floor(h*dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  const ro = new ResizeObserver(fit); ro.observe(canvas.parentElement); fit();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced) return;

  // tiny perlin
  const perm = new Uint8Array(512);
  for(let i=0;i<256;i++) perm[i]=i;
  for(let i=255;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=perm[i]; perm[i]=perm[j]; perm[j]=t; }
  for(let i=0;i<256;i++) perm[i+256]=perm[i];
  function fade(t){ return t*t*t*(t*(t*6-15)+10); }
  function lerp(a,b,t){ return a + (b-a)*t; }
  function grad(hash, x,y){ const h=hash&3; const u=h<2?x:y; const v=h<2?y:x; return ((h&1)?-u:u) + ((h&2)?-2*v:2*v)/2; }
  function perlin(x,y){
    const X=Math.floor(x)&255, Y=Math.floor(y)&255;
    x-=Math.floor(x); y-=Math.floor(y);
    const u=fade(x), v=fade(y);
    const aa=perm[perm[X]+Y], ab=perm[perm[X]+Y+1], ba=perm[perm[X+1]+Y], bb=perm[perm[X+1]+Y+1];
    return lerp(lerp(grad(aa,x,y), grad(ba,x-1,y), u), lerp(grad(ab,x,y-1), grad(bb,x-1,y-1), u), v);
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#2c4f87';
    ctx.lineWidth = 1;
    const density = 22; // vertical spacing of contour bands
    const scale = 0.012; // noise scale
    for(let y=0; y<h + density; y += density){
      ctx.beginPath();
      for(let x=0; x<=w; x+=8){
        const n = perlin((x+t*0.5)*scale, (y-t*0.3)*scale);
        const m = perlin((x-500-t*0.2)*scale*0.6, (y+200+t*0.4)*scale*0.6);
        const offset = (n*18 + m*10);
        const yy = y + offset;
        if(x===0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = brand + '55';
      ctx.stroke();
    }
    t += 0.8;
    requestAnimationFrame(draw);
  }
  draw();
})();