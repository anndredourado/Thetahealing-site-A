(() => {
 'use strict';
 const enrollment=document.getElementById('inscricao');
 const scrollTo=(target)=>{target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true});};
 // Capture before the old checkout handler: conversion stays on the same landing page.
 document.querySelectorAll('[data-checkout]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');document.querySelector('.menu-toggle').setAttribute('aria-label','Abrir menu');document.querySelector('#navigation').classList.remove('is-open');scrollTo(enrollment);},true));
 document.querySelectorAll('a[href="#inscricao"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();scrollTo(enrollment);}));
})();
