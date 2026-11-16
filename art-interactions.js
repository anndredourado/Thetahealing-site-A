(() => {
 'use strict';
 const track=document.querySelector('.testimonial-track');
 if(!track)return;
 const prev=document.querySelector('[data-testimonial-prev]');
 const next=document.querySelector('[data-testimonial-next]');
 const count=document.querySelector('.testimonial-count');
 const cards=[...track.children];
 const step=()=>cards[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(track).gap)||0);
 const max=()=>Math.max(0,track.scrollWidth-track.clientWidth);
 const update=()=>{const current=Math.min(cards.length-1,Math.round(track.scrollLeft/step()));count.textContent=String(current+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=max()-2;};
 const move=delta=>track.scrollTo({left:Math.max(0,Math.min(max(),track.scrollLeft+delta*step())),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',update,{passive:true});
 track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
 addEventListener('resize',update);update();
})();

/* User-controlled documentary gallery, with a keyboard-accessible native dialog. */
(() => {
 'use strict';
 const track=document.querySelector('.documentary-pair');
 if(!track)return;
 const slides=[...track.querySelectorAll('.photo-slide')];
 const controls=document.querySelector('.photo-controls');
 const prev=controls.querySelector('[data-photo-prev]');
 const next=controls.querySelector('[data-photo-next]');
 const dots=[...controls.querySelectorAll('[data-photo-go]')];
 const counter=controls.querySelector('.photo-count');
 const dialog=document.querySelector('.photo-lightbox');
 const expanded=dialog.querySelector('img');
 const close=dialog.querySelector('.lightbox-close');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,lightboxIndex=0,opener=null;
 const step=()=>slides[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(track).gap)||0);
 const countText=index=>String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
 const update=()=>{
  const distance=step();if(!slides.length||!Number.isFinite(distance)||distance<=0)return;
  current=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/distance)));
  counter.textContent=countText(current);
  track.style.height=(slides[current].getBoundingClientRect().height+8)+'px';
  prev.disabled=current===0;next.disabled=current===slides.length-1;
  dots.forEach((dot,index)=>dot.setAttribute('aria-current',String(index===current)));
 };
 const go=index=>track.scrollTo({left:Math.max(0,Math.min(slides.length-1,index))*step(),behavior:reduce.matches?'instant':'smooth'});
 prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
 dots.forEach((dot,index)=>dot.addEventListener('click',()=>go(index)));
 track.addEventListener('scroll',update,{passive:true});
 track.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(current+(event.key==='ArrowRight'?1:-1));}
 });
 const showPhoto=index=>{
  lightboxIndex=(index+slides.length)%slides.length;
  const image=slides[lightboxIndex].querySelector('img');
  expanded.src=slides[lightboxIndex].href;expanded.alt=image.alt;
  dialog.dataset.portrait=String(slides[lightboxIndex].classList.contains('photo-slide-portrait'));
  dialog.querySelector('.lightbox-count').textContent=countText(lightboxIndex);
 };
 slides.forEach((slide,index)=>slide.addEventListener('click',event=>{
  if(!dialog.showModal||event.ctrlKey||event.metaKey||event.shiftKey)return;
  event.preventDefault();opener=slide;showPhoto(index);dialog.showModal();
  document.documentElement.classList.add('photo-dialog-open');close.focus();
 }));
 close.addEventListener('click',()=>dialog.close());
 dialog.querySelector('.lightbox-prev').addEventListener('click',()=>showPhoto(lightboxIndex-1));
 dialog.querySelector('.lightbox-next').addEventListener('click',()=>showPhoto(lightboxIndex+1));
 dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();showPhoto(lightboxIndex+(event.key==='ArrowRight'?1:-1));}
 });
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.documentElement.classList.remove('photo-dialog-open');opener?.focus({preventScroll:true});});
 addEventListener('resize',update);
 if('ResizeObserver' in window){const observer=new ResizeObserver(update);slides.forEach(slide=>observer.observe(slide));}
 controls.hidden=false;update();
})();
