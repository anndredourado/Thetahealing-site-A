(() => {
 'use strict';
 const root=document.documentElement;
 const header=document.querySelector('.site-header');
 const toggle=document.querySelector('.menu-toggle');
 const nav=document.querySelector('#navigation');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const closeMenu=()=>{toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');nav.classList.remove('is-open');};
 const updateOffset=()=>{
  const position=getComputedStyle(header).position;
  const fixed=position==='fixed'||position==='sticky';
  root.style.setProperty('--anchor-offset',(fixed?Math.ceil(header.getBoundingClientRect().height)+16:20)+'px');
 };
 updateOffset();
 new ResizeObserver(updateOffset).observe(header);
 addEventListener('resize',updateOffset);
 toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(expanded));toggle.setAttribute('aria-label',expanded?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',expanded);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
 matchMedia('(min-width:1200px)').addEventListener('change',closeMenu);
 document.addEventListener('click',event=>{
  if(!nav.contains(event.target)&&!toggle.contains(event.target))closeMenu();
  const link=event.target.closest('a[href^="#"]');
  if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  let id;try{id=decodeURIComponent(link.hash.slice(1));}catch{return;}
  const anchor=document.getElementById(id);if(!anchor)return;
  event.preventDefault();closeMenu();updateOffset();
  const target=anchor.classList.contains('anchor-alias')?anchor.closest('section'):anchor;
  if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');
  target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
  target.focus({preventScroll:true});
  if(location.hash!==link.hash)history.pushState(null,'',link.hash);
 });
})();
