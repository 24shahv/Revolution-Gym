/* ================================================================
   REVOLUTION GYM — main.js  (shared across all pages)
   ================================================================ */
'use strict';

/* ── UTILS ──────────────────────────────────────────────── */
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const lerp = (a,b,t) => a + (b-a)*t;

/* ── RAF POOL ────────────────────────────────────────────── */
const raf = { fns:[], add(fn){this.fns.push(fn);}, tick(t){this.fns.forEach(f=>f(t));} };
requestAnimationFrame(function loop(t){ raf.tick(t); requestAnimationFrame(loop); });

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor(){
  const dot  = $('#cur-dot');
  const ring = $('#cur-ring');
  if(!dot||!ring||window.innerWidth<768) return;

  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });

  raf.add(()=>{
    dot.style.left  = mx+'px'; dot.style.top  = my+'px';
    rx=lerp(rx,mx,.1); ry=lerp(ry,my,.1);
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
  });

  document.addEventListener('mouseleave',()=>{ dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter',()=>{ dot.style.opacity='1'; ring.style.opacity='1'; });

  /* hover state */
  document.addEventListener('mouseover', e=>{
    if(e.target.closest('a,button,.card,.plan,.blog-card,.trainer-card,.faq-q')){
      document.body.classList.add('hover-active');
    } else {
      document.body.classList.remove('hover-active');
    }
  });
}

/* ── NAV ─────────────────────────────────────────────────── */
function initNav(){
  const nav  = $('nav');
  const ham  = $('.nav-ham');
  const drawer = $('.nav-drawer');
  if(!nav) return;

  /* scrolled style */
  const onScroll = ()=> nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .nav-drawer a').forEach(a=>{
    if(a.getAttribute('href')===page) a.classList.add('active');
  });

  /* mobile hamburger */
  if(ham && drawer){
    ham.addEventListener('click',()=>{
      const open = drawer.classList.toggle('open');
      ham.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    /* close on link click */
    $$('.nav-drawer a', drawer).forEach(a=>{
      a.addEventListener('click',()=>{
        drawer.classList.remove('open');
        ham.classList.remove('open');
        document.body.style.overflow='';
      });
    });
  }
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initReveal(){
  const els = $$('[data-r]');
  if(!els.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const delay = +(e.target.dataset.d||0);
      setTimeout(()=> e.target.classList.add('in'), delay);
      obs.unobserve(e.target);
    });
  },{threshold:.1, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>obs.observe(el));
}

/* ── COUNTERS ────────────────────────────────────────────── */
function initCounters(){
  const els = $$('[data-count]');
  if(!els.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el  = e.target;
      const end = parseFloat(el.dataset.count);
      const suf = el.dataset.suffix||'';
      const dur = 2000;
      let st = null;
      (function step(t){
        if(!st) st=t;
        const p = Math.min((t-st)/dur,1);
        const ease = 1-Math.pow(1-p,3);
        const v = end<100 ? Math.round(ease*end*10)/10 : Math.round(ease*end);
        el.textContent = v.toLocaleString()+suf;
        if(p<1) requestAnimationFrame(step);
      })(performance.now());
    });
  },{threshold:.5});
  els.forEach(el=>obs.observe(el));
}

/* ── FAQ ACCORDION ───────────────────────────────────────── */
function initFAQ(){
  $$('.faq-item').forEach(item=>{
    const btn = item.querySelector('.faq-q');
    if(!btn) return;
    btn.addEventListener('click',()=>{
      const isOpen = item.classList.contains('open');
      $$('.faq-item').forEach(i=>i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
    });
  });
}

/* ── PROGRAM TRACK DRAG ──────────────────────────────────── */
function initDragScroll(selector){
  const track = $(selector);
  if(!track) return;
  const btnL = $('#prog-prev'), btnR = $('#prog-next');
  let off=0, drag=false, startX=0, startOff=0;
  const cardW = ()=> track.children[0]?.offsetWidth+16 || 376;
  const maxOff= ()=> -(track.scrollWidth - track.parentElement.clientWidth - 60);
  const set   = v=>{ off=Math.max(maxOff(),Math.min(0,v)); track.style.transform=`translateX(${off}px)`; };

  if(btnR) btnR.addEventListener('click',()=> set(off-cardW()));
  if(btnL) btnL.addEventListener('click',()=> set(off+cardW()));

  track.addEventListener('mousedown',e=>{ drag=true; startX=e.clientX; startOff=off; track.style.transition='none'; track.style.userSelect='none'; });
  window.addEventListener('mousemove',e=>{ if(!drag) return; set(startOff+(e.clientX-startX)); });
  window.addEventListener('mouseup',()=>{ drag=false; track.style.transition=''; track.style.userSelect=''; });
  track.addEventListener('touchstart',e=>{ startX=e.touches[0].clientX; startOff=off; track.style.transition='none'; },{passive:true});
  track.addEventListener('touchmove',e=>{ set(startOff+(e.touches[0].clientX-startX)); },{passive:true});
  track.addEventListener('touchend',()=>{ track.style.transition=''; });
}

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
function initMagnetic(){
  $$('.btn-fire,.nav-cta').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)*.28;
      const dy=(e.clientY-r.top-r.height/2)*.28;
      el.style.transform=`translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave',()=>{ el.style.transform=''; });
  });
}

/* ── CANVAS PARTICLE BG ──────────────────────────────────── */
function initCanvas(){
  const canvas = $('#bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize=()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
  resize(); window.addEventListener('resize',resize);

  const PARTS = 50;
  const ps = Array.from({length:PARTS},()=>resetP({}));
  function resetP(p){
    p.x=Math.random()*window.innerWidth;
    p.y=window.innerHeight+10;
    p.vx=(Math.random()-.5)*.5;
    p.vy=-(Math.random()*.6+.2);
    p.life=0; p.maxLife=.003+Math.random()*.003;
    p.r=Math.random()*2+.5;
    return p;
  }
  raf.add(t=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    /* glow */
    const g=ctx.createRadialGradient(canvas.width*.72,canvas.height*.5,0,canvas.width*.72,canvas.height*.5,canvas.width*.45);
    g.addColorStop(0,'rgba(255,31,0,.07)'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
    /* particles */
    ps.forEach(p=>{
      p.life+=p.maxLife; if(p.life>1){ resetP(p); return; }
      p.x+=p.vx; p.y+=p.vy;
      const a=p.life<.3?p.life/.3:1-(p.life-.3)/.7;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,${60+Math.floor(p.life*80)},0,${a*.45})`;
      ctx.fill();
    });
  });
}

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
function initAnchors(){
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth'});
    });
  });
}

/* ── HERO LINE REVEAL (home only) ────────────────────────── */
function initHeroLines(){
  const lines = $$('.hero-headline .line-inner');
  const eyebrow = $('.hero-eyebrow');
  const tagline  = $('.hero-tagline');
  const ctas     = $('.hero-ctas');
  const floats   = $$('.stat-float');

  lines.forEach((el,i)=> setTimeout(()=>el.classList.add('up'), 300+i*110));
  if(eyebrow) setTimeout(()=>eyebrow.classList.add('vis'),100);
  if(tagline) setTimeout(()=>tagline.classList.add('vis'),700);
  if(ctas)    setTimeout(()=>ctas.classList.add('vis'),900);
  floats.forEach((el,i)=> setTimeout(()=>el.classList.add('vis'),1000+i*200));
}

/* ── NAV LOGIN STATE (runs on every page) ────────────────── */
function initNavLoginState(){
  const btn = $('#navLoginBtn');
  if(!btn) return;
  try {
    const session = JSON.parse(localStorage.getItem('rg_session') || 'null');
    if(!session) return;
    const members = JSON.parse(localStorage.getItem('rg_members') || '{}');
    const user = members[session.email];
    if(!user) return;
    const firstName = user.name.split(' ')[0];
    const isAdmin   = user.role === 'admin' || user.role === 'superadmin';
    btn.textContent = isAdmin ? '⚙ Admin' : firstName + ' ▸';
    btn.href        = isAdmin ? 'admin.html' : 'dashboard.html';
    btn.style.color = isAdmin ? 'var(--gold)' : 'var(--fire)';
    btn.style.fontWeight = '700';
    // remove hover overrides since color is now set
    btn.onmouseover = null;
    btn.onmouseout  = null;
    // also update drawer sign-in link
    const drawerSignIn = document.querySelector('.nav-drawer a[href="login.html"]');
    if(drawerSignIn){
      drawerSignIn.textContent = isAdmin ? '⚙ Admin Panel' : '👤 My Dashboard — ' + firstName;
      drawerSignIn.href = isAdmin ? 'admin.html' : 'dashboard.html';
      drawerSignIn.style.color = 'var(--fire)';
    }
  } catch(e){}
}

/* ── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  initCursor();
  initNav();
  initReveal();
  initCounters();
  initFAQ();
  initMagnetic();
  initCanvas();
  initAnchors();
  initDragScroll('.prog-track');
  initNavLoginState();
  /* hero lines only if they exist */
  if($('.hero-headline')) initHeroLines();
});
