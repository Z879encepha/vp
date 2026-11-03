
(function(){
  const body=document.body;
  const menuButton=document.querySelector('[data-menu-toggle]');
  const nav=document.querySelector('[data-primary-nav]');
  const groups=Array.from(document.querySelectorAll('.nav-group'));
  function setGroupOpen(group,open){
    group.classList.toggle('is-open',open);
    const button=group.querySelector('.nav-group-toggle');
    if(button)button.setAttribute('aria-expanded',String(open));
  }
  function closeGroups(except){groups.forEach(group=>{if(group!==except)setGroupOpen(group,false);});}
  function closeMenu(){
    closeGroups();
    if(nav)nav.classList.remove('is-open');
    if(menuButton)menuButton.setAttribute('aria-expanded','false');
    body.classList.toggle('menu-open',Boolean(lightbox&&!lightbox.hidden));
  }
  if(menuButton&&nav){
    menuButton.addEventListener('click',()=>{
      const open=!nav.classList.contains('is-open');
      closeGroups();nav.classList.toggle('is-open',open);
      menuButton.setAttribute('aria-expanded',String(open));
      body.classList.toggle('menu-open',open);
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  }
  groups.forEach(group=>{
    const button=group.querySelector('.nav-group-toggle');
    if(button)button.addEventListener('click',e=>{
      e.stopPropagation();const open=!group.classList.contains('is-open');
      closeGroups(group);setGroupOpen(group,open);
    });
    group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget))setGroupOpen(group,false);});
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))closeGroups();});
  document.addEventListener('keydown',e=>{
    if(lightbox&&!lightbox.hidden){
      if(e.key==='Escape'){e.preventDefault();closeLightbox();return;}
      if(e.key==='Tab'){
        const controls=Array.from(lightbox.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')).filter(el=>!el.disabled&&el.tabIndex>=0&&!el.hidden&&el.getClientRects().length);
        const first=controls[0]||lbClose,last=controls[controls.length-1]||lbClose;
        if(e.shiftKey&&(document.activeElement===first||!lightbox.contains(document.activeElement))){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&(document.activeElement===last||!lightbox.contains(document.activeElement))){e.preventDefault();first.focus();}
      }
      return;
    }
    if(e.key==='Escape'){
      const group=groups.find(g=>g.classList.contains('is-open')&&g.contains(document.activeElement));
      if(group){e.preventDefault();setGroupOpen(group,false);group.querySelector('.nav-group-toggle').focus();}
      else if(nav&&nav.classList.contains('is-open')){e.preventDefault();closeMenu();if(menuButton)menuButton.focus();}
      else closeGroups();
    }
  });
  const back=document.querySelector('[data-back-to-top]');if(back){const update=()=>back.classList.toggle('is-visible',window.scrollY>600);window.addEventListener('scroll',update,{passive:true});update();back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}
  const observer=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08}):null;document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('is-visible'));
  const lightbox=document.querySelector('[data-lightbox]'),lbImg=document.querySelector('[data-lightbox-image]'),lbCaption=document.querySelector('[data-lightbox-caption]'),lbClose=document.querySelector('[data-lightbox-close]');let lastTrigger=null;let inertSiblings=[];
  function openLightbox(trigger){
    if(!lightbox||!lbClose||!lightbox.hidden)return;
    closeMenu();lastTrigger=trigger;
    lbImg.src=trigger.dataset.src;lbImg.alt=trigger.dataset.alt||'';
    lbCaption.textContent=trigger.dataset.caption||'';lightbox.hidden=false;
    inertSiblings=Array.from(body.children).filter(el=>el!==lightbox&&!el.contains(lightbox)).map(el=>({el,inert:el.inert}));
    inertSiblings.forEach(({el})=>{el.inert=true;});
    body.classList.add('menu-open');lbClose.focus();
  }
  function closeLightbox(){
    if(!lightbox||lightbox.hidden)return;
    lightbox.hidden=true;lbImg.src='';
    inertSiblings.forEach(({el,inert})=>{el.inert=inert;});inertSiblings=[];
    body.classList.toggle('menu-open',Boolean(nav&&nav.classList.contains('is-open')));
    if(lastTrigger&&lastTrigger.isConnected)lastTrigger.focus();
  }
  document.addEventListener('focusin',e=>{if(lightbox&&!lightbox.hidden&&!lightbox.contains(e.target)&&lbClose)lbClose.focus();});
  document.querySelectorAll('[data-lightbox-trigger]').forEach(btn=>btn.addEventListener('click',()=>openLightbox(btn)));if(lbClose)lbClose.addEventListener('click',closeLightbox);if(lightbox)lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
})();
