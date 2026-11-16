(() => {
  'use strict';
  const section = document.querySelector('#metodo.discovery');
  if (!section) return;
  const local = window.THETA_DISCOVERY_CONFIG || {};
  const shared = window.THETA_CONFIG || {};
  const source = local.videoUrl || shared.presentationUrl;
  const type = local.videoUrl ? local.type : shared.presentationType;
  const media = section.querySelector('.discovery-media');
  const screen = section.querySelector('.discovery-screen');
  const placeholder = section.querySelector('.discovery-placeholder');
  const status = section.querySelector('.discovery-video-status');
  const video = section.querySelector('video');
  let embed = null;
  let ready = false;
  const safeUrl = value => {
    if (!value || typeof value !== 'string') return null;
    try { const url = new URL(value, document.baseURI); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  };
  const url = safeUrl(source);
  if (url && type === 'video') {
    video.src = url;
    const poster = safeUrl(local.posterUrl);
    if (poster) video.poster = poster;
    for (const caption of local.captions || []) {
      const captionUrl = safeUrl(caption.src);
      if (!captionUrl || !caption.srclang) continue;
      const track = document.createElement('track');
      track.kind = 'captions'; track.src = captionUrl; track.srclang = caption.srclang;
      track.label = caption.label || caption.srclang; track.default = Boolean(caption.default);
      video.append(track);
    }
    placeholder.hidden = true; video.hidden = false; ready = true;
    video.addEventListener('error', () => { status.textContent = 'Não foi possível carregar o vídeo de apresentação.'; status.hidden = false; });
  } else if (url && type === 'iframe') {
    // Create the real embed only after the visitor activates the player.
    embed = {url}; ready = true;
    section.querySelector('.discovery-provisional').hidden = true;
    section.querySelector('#discovery-video-note').textContent = 'Vídeo de Anndré Dourado';
    section.querySelector('[data-discovery-play]').setAttribute('aria-label', 'Reproduzir o vídeo de Anndré Dourado');
  }
  const activate = () => {
    media.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center'});
    if (!ready) { status.hidden = false; media.focus({preventScroll:true}); return; }
    if (embed) {
      if (!screen.querySelector('iframe')) {
        const frame = document.createElement('iframe');
        frame.className = 'discovery-embed'; frame.title = 'Apresentação de Anndré Dourado';
        frame.src = embed.url; frame.allow = 'fullscreen; picture-in-picture'; frame.allowFullscreen = true;
        placeholder.hidden = true; screen.append(frame);
      }
      screen.querySelector('iframe').focus({preventScroll:true});
    } else { video.focus({preventScroll:true}); video.play().catch(() => { status.textContent = 'Use os controles do player para iniciar o vídeo.'; status.hidden = false; }); }
  };
  section.querySelectorAll('[data-discovery-play],[data-discovery-cta]').forEach(button => button.addEventListener('click', activate));
})();
