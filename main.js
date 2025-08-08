// --- Common interactions (reveal, parallax, etc.) ---
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const ioItems = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); ioItems.unobserve(e.target); } });
}, { threshold: 0.25 });
document.querySelectorAll('.micro-animate .anim-item').forEach(el=> ioItems.observe(el));

const px = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  px.forEach(el=>{
    const s = parseFloat(el.getAttribute('data-speed'))||0.1;
    el.style.transform = `translateY(${y*s}px)`;
  });
}, { passive: true });

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
  es.forEach(en=>{
    if(en.isIntersecting){
      const id=en.target.id;
      links.forEach(l=>l?.classList.remove('active'));
      links.get(id)?.classList.add('active');
    }
  });
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

document.getElementById('newsletter-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Subscribed!');
});

const navEl = document.querySelector('.nav');
const navToggle = document.getElementById('nav-toggle');
navToggle?.addEventListener('click', (ev)=>{
  ev.stopPropagation();
  const open = navEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav-links a').forEach(el=>{
  el.addEventListener('click', ()=> navEl.classList.remove('open'));
});
document.querySelector('.nav-links')?.addEventListener('click', e=> e.stopPropagation());
document.addEventListener('click', ()=> navEl.classList.remove('open'));

// Typed text (language aware)
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

// --- Topography Canvas Animation ---
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
  const ro = new ResizeObserver(fit); ro.observe(canvas.parentElement);
  fit();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced) return;

  function noise2D(x,y){
    // simple value noise via sine; visually smooth and very cheap
    return Math.sin(x*0.0018 + y*0.0012) + Math.sin(x*0.0009 - y*0.0014);
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#2c4f87';
    ctx.lineWidth = 1;
    ctx.strokeStyle = brand + '55';
    const step = 18; // contour step (px)
    const amp = 28;  // wave amplitude
    for(let y=0; y<h+step; y+=step){
      ctx.beginPath();
      for(let x=0; x<=w; x+=8){
        const n = noise2D(x + t*0.6, y - t*0.35);
        const oy = Math.sin((x*0.012) + t*0.02) * 3 + n * 4;
        const yy = y + Math.sin((y*0.02)+t*0.02)*1.2 + oy;
        if(x===0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    t += 1.2;
    requestAnimationFrame(draw);
  }
  draw();
})();