(() => {
 'use strict';
 const dialog=document.querySelector('.photo-lightbox');
 if(dialog){
  const image=dialog.querySelector('img');let opener;
  document.querySelectorAll('[data-documentary]').forEach(link=>link.addEventListener('click',event=>{
   if(event.ctrlKey||event.metaKey||event.shiftKey)return;
   event.preventDefault();opener=link;image.src=link.href;image.alt=link.querySelector('img').alt;
   dialog.showModal();dialog.querySelector('.lightbox-close').focus();
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
 }
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 if(reduce.matches||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);
   entry.target.animate([{opacity:.65,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.2,.7,.2,1)'});
  });
 },{threshold:.12});
 document.querySelectorAll('[data-reveal]').forEach(e=>observer.observe(e));
})();
