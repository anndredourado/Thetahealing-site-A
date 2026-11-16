(() => {
  'use strict';
  const section = document.querySelector('#imersao');
  const cta = section.querySelector('[data-method-cta]');
  const dialog = section.querySelector('.mirror-method-dialog');
  cta.addEventListener('click', event => {
    event.preventDefault();
    const target = document.getElementById(cta.hash.slice(1));
    if (target) {
      target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({preventScroll:true});
    } else dialog.showModal();
  });
  section.querySelectorAll('.mirror-dialog-close,.mirror-dialog-return').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
