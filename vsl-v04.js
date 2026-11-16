/* Native YouTube controls; a single, muted scroll start, never a scroll restart. */
(function (root) {
 'use strict';
 function createPlaybackSession(io) {
  let ready=false,ratio=0,scrolled=false,reduced=false,visible=true,attempted=false,state=-1;
  const emit=()=>io.changed?.({ready,ratio,attempted,state,muted:ready?io.isMuted():false});
  const pauseOutside=()=>{
   if(ready&&(!visible||ratio<=0)&&[1,3].includes(io.readState()))io.pause();
  };
  const maybeStart=()=>{
   if(!ready||attempted||!scrolled||reduced||!visible||ratio<0.6)return;
   attempted=true;io.mute();io.play();emit();
  };
  return {
   ready(){ready=true;state=io.readState();if([0,1,2,3].includes(state))attempted=true;pauseOutside();maybeStart();emit();},
   intersection(value){ratio=value;pauseOutside();maybeStart();emit();},
   scroll(){scrolled=true;maybeStart();},
   motion(value){reduced=value;},
   visibility(value){visible=value;pauseOutside();},
   state(value){state=value;if([0,1,2].includes(value))attempted=true;if(value===1)pauseOutside();emit();},
   blocked(){attempted=true;if(ready&&state!==1)io.unmute();emit();},
   sound(){if(ready){io.unmute();emit();}},
  };
 }
 if(typeof module==='object'&&module.exports)module.exports={createPlaybackSession};
 if(!root.document)return;
 const shell=root.document.querySelector('#descoberta .vsl-shell');
 if(!shell)return;
 const screen=shell.querySelector('.vsl-screen');
 const announcement=shell.querySelector('.vsl-announcement');
 const mask=shell.querySelector('.vsl-sound-mask');
 const soundButton=mask.querySelector('button');
 let soundRequested=false;
 const reduced=root.matchMedia('(prefers-reduced-motion: reduce)');
 const frame=root.document.createElement('iframe');
 frame.id='theta-youtube-player';frame.title='Apresentação de Anndré Dourado';
 const src=new URL('https://www.youtube-nocookie.com/embed/6iiqVUhdL50');
 for(const [key,value] of Object.entries({enablejsapi:'1',origin:root.location.origin,autoplay:'0',playsinline:'1',controls:'1',rel:'0',cc_load_policy:'0'}))src.searchParams.set(key,value);
 frame.src=src.href;frame.width='640';frame.height='360';frame.loading='lazy';
 frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;
 frame.referrerPolicy='strict-origin-when-cross-origin';
 screen.querySelector('#vsl-player-slot').replaceWith(frame);
 let player,initializing=false;
 const disableCaptions=()=>{
  // Reset the active track after the captions module loads, including saved viewer preferences.
  try{player.setOption('captions','track',{});player.unloadModule?.('captions');}catch{}
 };
 const syncSoundMask=()=>{
  if(!player?.getPlayerState)return;
  mask.hidden=soundRequested||!player.isMuted()||![1,2,3].includes(player.getPlayerState());
 };
 soundButton.addEventListener('click',event=>{
  event.preventDefault();event.stopPropagation();
  soundRequested=true;
  // Keep all media calls in the actual click gesture; the iframe receives no click.
  player.unMute();player.setVolume(100);player.playVideo();disableCaptions();
  mask.hidden=true;
  announcement.textContent='Som ativado. Use os controles do vídeo para pausar.';
 });
 const session=createPlaybackSession({
  readState:()=>player.getPlayerState(),isMuted:()=>player.isMuted(),
  mute:()=>player.mute(),unmute:()=>player.unMute(),play:()=>player.playVideo(),pause:()=>player.pauseVideo(),
  changed:({ready,state,muted,attempted})=>{
   shell.dataset.playbackState=String(state);shell.dataset.muted=String(muted);shell.dataset.autoplayAttempted=String(attempted);
   mask.hidden=!ready||soundRequested||!muted||![1,2,3].includes(state);
  }
 });
 session.motion(reduced.matches);session.visibility(!root.document.hidden);
 reduced.addEventListener('change',event=>session.motion(event.matches));
 root.document.addEventListener('visibilitychange',()=>session.visibility(!root.document.hidden));
 let lastY=root.scrollY;
 root.addEventListener('scroll',()=>{const y=root.scrollY;if(Math.abs(y-lastY)>1){lastY=y;session.scroll();}},{passive:true});
 const loadAPI=()=>{
  if(root.YT?.Player)return Promise.resolve(root.YT);
  return new Promise((resolve,reject)=>{
   const previous=root.onYouTubeIframeAPIReady;
   root.onYouTubeIframeAPIReady=()=>{try{previous?.();}finally{resolve(root.YT);}};
   const script=root.document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
   script.addEventListener('error',reject,{once:true});root.document.head.append(script);
  });
 };
 const initialize=()=>{
  if(initializing)return;initializing=true;
  loadAPI().then(YT=>{
   player=new YT.Player(frame,{events:{
    onReady:()=>{disableCaptions();session.ready();},
    onApiChange:()=>{disableCaptions();syncSoundMask();},
    onStateChange:event=>{disableCaptions();session.state(event.data);},
    onAutoplayBlocked:()=>{session.blocked();announcement.textContent='Use o botão de reprodução do vídeo para começar.';},
    onError:()=>{session.blocked();announcement.textContent='Não foi possível reproduzir o vídeo. Use as opções do player do YouTube.';}
   }});
  }).catch(()=>{announcement.textContent='Use os controles do vídeo para iniciar a reprodução.';});
 };
 if('IntersectionObserver' in root){
  const preload=new root.IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){initialize();preload.disconnect();}},{rootMargin:'400px 0px'});preload.observe(screen);
  const observer=new root.IntersectionObserver(entries=>{for(const entry of entries)session.intersection(entry.isIntersecting?entry.intersectionRatio:0);},{threshold:[0,0.01,0.6,1]});observer.observe(screen);
 }else{initialize();}
})(typeof window==='undefined'?globalThis:window);
