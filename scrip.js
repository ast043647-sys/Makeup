
(() => {
  // DOM references
  const menu = document.getElementById('menu');
  const startBtn = document.getElementById('startBtn');
  const screens = {instructions: document.getElementById('instructions'), makeup: document.getElementById('makeup'), wardrobe: document.getElementById('wardrobe')};
  const avatar = document.getElementById('avatar');
  const makeupItems = document.getElementById('makeupItems');
  const hairOptions = document.getElementById('hairOptions');
  const clothesList = document.getElementById('clothesList');
  const emojiContainer = document.getElementById('emojiContainer');
  const snapshotCanvas = document.getElementById('snapshotCanvas');

  // State
  const state = {applied: {blush: null, eyeshadow: null, lipstick: null}, hair: 'none', clothes: 'none'};

  // Utility: show floating emoji when buttons pressed
  function showEmoji(x,y){
    const el = document.createElement('div'); el.className='emoji'; el.textContent='🎀';
    el.style.left = (x-12)+'px'; el.style.top = (y-12)+'px';
    emojiContainer.appendChild(el);
    setTimeout(()=>el.remove(),1600);
  }

  // Attach emoji to all interactive buttons
  document.addEventListener('click', e => {
    const rect = document.documentElement.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || window.innerWidth/2;
    const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || window.innerHeight/2;
    if(e.target.tagName === 'BUTTON' || e.target.classList.contains('item') || e.target.classList.contains('option')){
      showEmoji(x,y);
    }
  });

  // Generate makeup items
  const sampleMakeup = [
    {id:'blush-pink', type:'blush', label:'Blush Pink', style:{background:'radial-gradient(circle,#ffb3d0,#ff7598)'}},
    {id:'shadow-lilac', type:'eyeshadow', label:'Eyeshadow Lilac', style:{background:'linear-gradient(90deg,#f4d5ff,#eec4f7)'}},
    {id:'lip-rose', type:'lipstick', label:'Lip Rose', style:{background:'linear-gradient(90deg,#ff8bb0,#ff5c95)'}},
    {id:'liner-deep', type:'eyeliner', label:'Eyeliner', style:{background:'linear-gradient(90deg,#6b4460,#412233)'}}
  ];

  sampleMakeup.forEach(item => {
    const el = document.createElement('div'); el.className='item'; el.dataset.type = item.type; el.id = item.id; el.title = item.label; Object.assign(el.style,item.style);
    el.textContent = '✦';
    makeupItems.appendChild(el);

    // Tap to apply
    el.addEventListener('click', () => applyMakeup(item));

    // Drag support
    let dragging = false, startX=0, startY=0;
    el.addEventListener('pointerdown', e => { dragging = true; el.setPointerCapture(e.pointerId); startX = e.clientX; startY = e.clientY; el.style.transition='none'; el.style.position='fixed'; el.style.zIndex=9999; moveAt(e); });
    function moveAt(e){ el.style.left = (e.clientX - 28) + 'px'; el.style.top = (e.clientY - 28) + 'px'; }
    el.addEventListener('pointermove', e => { if(!dragging) return; moveAt(e); });
    el.addEventListener('pointerup', e => { if(!dragging) return; dragging=false; el.releasePointerCapture(e.pointerId); el.style.position=''; el.style.zIndex=''; el.style.left=''; el.style.top=''; el.style.transition=''; // detect drop onto avatar
      const avatarRect = avatar.getBoundingClientRect();
      if(e.clientX > avatarRect.left && e.clientX < avatarRect.right && e.clientY > avatarRect.top && e.clientY < avatarRect.bottom){ applyMakeup(item); }
    });
  });

  function applyMakeup(item){
    state.applied[item.type] = item.id;
    // Visual cues: tint certain parts
    if(item.type === 'blush'){
      const blushEl = avatar.querySelector('.face'); blushEl.style.boxShadow = 'inset 0 -8px 40px rgba(255,120,170,0.12)';
    }
    if(item.type === 'eyeshadow'){
      avatar.querySelector('.eye.left').style.boxShadow = '0 0 0 10px rgba(235,180,240,0.28)';
      avatar.querySelector('.eye.right').style.boxShadow = '0 0 0 10px rgba(235,180,240,0.28)';
    }
    if(item.type === 'lipstick'){
      avatar.querySelector('.lips').style.background = 'linear-gradient(#ff7aa5,#ff4f87)';
    }
    if(item.type === 'eyeliner'){
      avatar.querySelectorAll('.eye').forEach(el => el.style.transform='scaleX(1.06) translateY(-1px)');
    }
  }

  // Hair options
  const hairList = [
    {id:'hair-short', name:'Pendek', style:'linear-gradient(90deg,#ffd0e8,#ffc1f0)'},
    {id:'hair-long', name:'Panjang', style:'linear-gradient(90deg,#ffd6e0,#ffb6d8)'},
    {id:'hair-bun', name:'Bun', style:'linear-gradient(90deg,#ffdfef,#ffcbe7)'},
  ];
  hairList.forEach(h => {
    const b = document.createElement('button'); b.className='option'; b.textContent = h.name; b.dataset.hair = h.id; b.style.background = h.style; hairOptions.appendChild(b);
    b.addEventListener('click', ()=>{
      state.hair = h.id; avatar.querySelector('.hair').style.background = h.style;
    });
  });

  // Clothes
  const clothes = [
    {id:'dress-rose', name:'Gaun Rose', style:'linear-gradient(180deg,#fff1f6,#ffdce9)'},
    {id:'tee-pink', name:'T-Shirt Pink', style:'linear-gradient(180deg,#fff6f9,#ffeef5)'},
    {id:'sweater', name:'Sweater Cozy', style:'linear-gradient(180deg,#ffe9f2,#ffd8ea)'}
  ];
  clothes.forEach(c =>{
    const div = document.createElement('div'); div.className='cloth'; div.dataset.clothes = c.id; div.style.background = c.style; div.textContent = c.name; clothesList.appendChild(div);
    div.addEventListener('click', ()=>{
      state.clothes = c.id; avatar.querySelector('.clothes').style.background = c.style;
    });
  });

  // Simple navigation
  document.querySelectorAll('[data-screen]').forEach(btn => btn.addEventListener('click', e => openScreen(e.target.dataset.screen)));
  document.querySelectorAll('.back').forEach(b => b.addEventListener('click', ()=>{ openScreen('menu'); }));
  document.getElementById('toWardrobe').addEventListener('click', ()=> openScreen('wardrobe'));

  function openScreen(name){
    // hide all
    menu.classList.toggle('hidden', name !== 'menu');
    Object.keys(screens).forEach(k=>screens[k].classList.toggle('hidden', k !== name));
  }

  // Start button jumps to makeup
  startBtn.addEventListener('click', ()=> openScreen('makeup'));

  // Reset makeup
  document.getElementById('resetMakeup').addEventListener('click', ()=>{
    avatar.querySelector('.face').style.boxShadow='inset 0 -8px 20px rgba(255,150,190,0.08)';
    avatar.querySelectorAll('.eye').forEach(e=>{e.style.boxShadow=''; e.style.transform='';});
    avatar.querySelector('.lips').style.background='linear-gradient(#ff9ac3,#ff6fae)';
    state.applied = {blush:null,eyeshadow:null,lipstick:null};
  });

  // Photo capture — render avatar to canvas
  document.getElementById('takePhoto').addEventListener('click', ()=>{
    const rect = avatar.getBoundingClientRect();
    snapshotCanvas.width = rect.width; snapshotCanvas.height = rect.height;
    const ctx = snapshotCanvas.getContext('2d');
    // Paint simple snapshot (recreate look using simple fills)
    // background
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,snapshotCanvas.width,snapshotCanvas.height);
    // hair
    ctx.fillStyle = getComputedStyle(avatar.querySelector('.hair')).background;
    ctx.fillRect(0,0,snapshotCanvas.width,120);
    // face circle
    ctx.beginPath(); ctx.fillStyle = '#fff0f6'; ctx.arc(snapshotCanvas.width/2,130,100,0,Math.PI*2); ctx.fill();
    // eyes
    ctx.fillStyle='#5a3a5a'; ctx.beginPath(); ctx.arc(snapshotCanvas.width/2 - 46,120,10,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(snapshotCanvas.width/2 + 46,120,10,0,Math.PI*2); ctx.fill();
    // lips
    ctx.fillStyle = '#ff6fae'; ctx.beginPath(); ctx.ellipse(snapshotCanvas.width/2,200,35,18,0,0,Math.PI*2); ctx.fill();
    // clothes
    ctx.fillStyle = getComputedStyle(avatar.querySelector('.clothes')).background; ctx.fillRect(0,snapshotCanvas.height-120,snapshotCanvas.width,120);

    // show image in new tab
    const data = snapshotCanvas.toDataURL('image/png');
    const w = window.open('about:blank','_blank');
    if(w){ w.document.write(`<img src="${data}" alt="avatar" style="max-width:100%">`); }
    // play shutter + show emoji
    playShutter();
  });

  // Very small synthesized soft background loop using WebAudio
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if(AudioCtx){
    const ctx = new AudioCtx();
    const gain = ctx.createGain(); gain.gain.value = 0.05; gain.connect(ctx.destination);
    const osc = ctx.createOscillator(); osc.type='sine'; osc.frequency.value = 220; const lfo = ctx.createOscillator(); lfo.type='sine'; lfo.frequency.value=0.2;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 20; lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
    osc.connect(gain); osc.start(); lfo.start();
    // start on first user gesture
    function startAudio(){ if(ctx.state!=='running') ctx.resume(); document.removeEventListener('click', startAudio); }
    document.addEventListener('click', startAudio);
  }

  function playShutter(){
    if(!window.AudioContext) return; const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type='square'; o.frequency.value=800; g.gain.value=0.1; o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4); setTimeout(()=>o.stop(),500);
  }

  // Small helpful tip: support deep linking
  if(location.hash === '#makeup') openScreen('makeup');
})();
const a = document.createElement('a'); a.href = url; a.download = "avatar_makeup.svg"; a.click(); });
