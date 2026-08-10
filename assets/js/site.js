
(function(){
  const body=document.body;
  const menuButton=document.querySelector('[data-menu-toggle]');
  const nav=document.querySelector('[data-primary-nav]');
  function closeMenu(){if(!nav||!menuButton)return;nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');body.classList.remove('menu-open');}
  if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(open));body.classList.toggle('menu-open',open);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));}
  document.querySelectorAll('.nav-group-toggle').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const group=btn.closest('.nav-group');const open=group.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));}));
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))document.querySelectorAll('.nav-group').forEach(g=>{g.classList.remove('is-open');const b=g.querySelector('.nav-group-toggle');if(b)b.setAttribute('aria-expanded','false');});});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.querySelectorAll('.nav-group').forEach(g=>g.classList.remove('is-open'));closeLightbox();}});
  const back=document.querySelector('[data-back-to-top]');if(back){const update=()=>back.classList.toggle('is-visible',window.scrollY>600);window.addEventListener('scroll',update,{passive:true});update();back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}
  const observer=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08}):null;document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('is-visible'));
  const lightbox=document.querySelector('[data-lightbox]'),lbImg=document.querySelector('[data-lightbox-image]'),lbCaption=document.querySelector('[data-lightbox-caption]'),lbClose=document.querySelector('[data-lightbox-close]');let lastTrigger=null;
  function openLightbox(trigger){if(!lightbox)return;lastTrigger=trigger;lbImg.src=trigger.dataset.src;lbImg.alt=trigger.dataset.alt||'';lbCaption.textContent=trigger.dataset.caption||'';lightbox.hidden=false;body.classList.add('menu-open');lbClose.focus();}
  function closeLightbox(){if(!lightbox||lightbox.hidden)return;lightbox.hidden=true;lbImg.src='';body.classList.remove('menu-open');if(lastTrigger)lastTrigger.focus();}
  document.querySelectorAll('[data-lightbox-trigger]').forEach(btn=>btn.addEventListener('click',()=>openLightbox(btn)));if(lbClose)lbClose.addEventListener('click',closeLightbox);if(lightbox)lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
})();
