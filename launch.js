(() => {
 const dialog=document.querySelector('.message-lightbox');
 if(!dialog)return;
 const image=dialog.querySelector('img');
 let opener;
 document.querySelectorAll('[data-message]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();opener=link;image.src=link.href;image.alt=link.querySelector('img')?.alt||'Mensagem original ampliada.';
  dialog.showModal();dialog.querySelector('.message-close').focus();
 }));
 dialog.querySelector('.message-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();
