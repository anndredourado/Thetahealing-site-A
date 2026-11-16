/* Somente recursos reais e aprovados. Valores vazios mantêm o estado provisório.
   O vídeo também pode usar presentationUrl/presentationType de config.js.
   Legendas: [{src: endereço real .vtt, srclang: 'pt-BR', label: 'Português', default: true}].
   Embeds devem ser URLs oficiais de incorporação; legendas são geridas pelo provedor. */
window.THETA_DISCOVERY_CONFIG = Object.freeze({
  videoUrl: null,
  type: 'video',
  posterUrl: null,
  captions: []
});
