// Pastel Pink Mobile Makeup Game - shoulder-up avatar
(() => {
  // --- Elements ---
  const screens = {
    menu: document.getElementById('menu'),
    instructions: document.getElementById('instructions'),
    makeup: document.getElementById('makeup'),
    wardrobe: document.getElementById('wardrobe')
  };
  const startBtn = document.getElementById('startGame');
  const menuBtns = document.querySelectorAll('.menu-btn');
  const backBtns = document.querySelectorAll('.back-btn');
  const emojiContainer = document.getElementById('emojiContainer');

  // Avatar layers
  const avatarBase = document.getElementById('avatarBase');
  const avatarMakeup = document.getElementById('avatarMakeup');
  const avatarHair = document.getElementById('avatarHair');
  const avatarCloth = document.getElementById('avatarCloth');
  const avatarWrap = document.getElementById('avatarWrap');

  // containers for item lists
  const makeupItems = document.getElementById('makeupItems');
  const hairItems = document.getElementById('hairItems');
  const accessItems = document.getElementById('accessItems');
  const clothesItems = document.getElementById('clothesItems');

  const takePhotoBtn = document.getElementById('takePhoto');
  const resetBtn = document.getElementById('resetBtn');
  const toWardrobe = document.getElementById('toWardrobe');

  // snapshot canvas
  const snapshot = document.getElementById('snapshot');

  // state
  const state = {
    baseSrc: '',      // initial blank base (we set default)
    makeup: null,
    hair: null,
    cloth: null,
    accessory: null,
    audioStarted: false
  };

  // --- Assets (small set embedded via imgur links / data URIs) ---
  // Base shoulder-up avatar (neutral)
  const ASSETS = {
    base: 'https://i.imgur.com/7Qp8h5Q.png', // neutral shoulder-up base (transparent bg)
    makeupOptions: [
      {id:'lip-rose', src:'https://i.imgur.com/ynGk0Lh.png', label:'Lip Rose'},
      {id:'blush-pink', src:'https://i.imgur.com/9lPBgru.png', label:'Blush Pink'},
      {id:'shadow-lilac', src:'https://i.imgur.com/YvQ6s5H.png', label:'Eyeshadow'}
    ],
    hairOptions: [
      {id:'hair-bun', src:'https://i.imgur.com/C0Y5J1p.png', label:'Bun'},
      {id:'hair-long', src:'https://i.imgur.com/7i6mO9T.png', label:'Long'},
      {id:'hair-short', src:'https://i.imgur.com/r1a6m2N.png', label:'Short'}
    ],
    accessoryOptions: [
      {id:'bow', src:'https://i.imgur.com/w9k0aYb.png', label:'Bow'},
      {id:'earring', src:'https://i.imgur.com/JkL3ZgV.png', label:'Earring'}
    ],
    clothesOptions: [
      {id:'dress-rose', src:'https://i.imgur.com/yjKtQXM.png', label:'Dress Rose'},
      {id:'tee-pink', src:'https://i.imgur.com/AE1KX2S.png', label:'T-Shirt Pink'},
      {id:'sweater', src:'https://i.imgur.com/0xwX1sR.png', label:'Cozy Sweater'}
    ]
  };

  // Initialize defaults
  function initDefaults(){
    avatarBase.src = ASSETS.base;
    avatarMakeup.src = '';
    avatarHair.src = '';
    avatarCloth.src = '';
    state.baseSrc = ASSETS.base;
  }

  // Render items into DOM
  function buildItemList(container, items, onClick){
    container.innerHTML = '';
    items.forEach(it => {
      const div = document.createElement('div');
      div.className = (container === clothesItems ? 'cloth-item' : 'item');
      const img = document.createElement('img');
      img.src = it.src;
      img.alt = it.label || '';
      img.draggable = false;
      // support tap
      img.addEventListener('click', (ev) => {
        onClick(it);
        spawnEmoji(ev);
      });
      // support pointer drag -> drop onto avatar
      img.addEventListener('pointerdown', startDragItem);
      div.appendChild(img);
      container.appendChild(div);
    });
  }

  // Drag implementation (pointer events)
  let dragging = null;
  function startDragItem(e){
    const img = e.currentTarget;
    // clone visual
    dragging = img.cloneNode(true);
    dragging.style.position = 'fixed';
    dragging.style.left = (e.clientX - img.width/2) + 'px';
    dragging.style.top = (e.clientY - img.height/2) + 'px';
    dragging.style.zIndex = 9999;
    dragging.style.pointerEvents = 'none';
    document.body.appendChild(dragging);
    img.setPointerCapture(e.pointerId);
    function move(e2){ if(!dragging) return; dragging.style.left = (e2.clientX - img.width/2) + 'px'; dragging.style.top = (e2.clientY - img.height/2) + 'px'; }
    function up(e2){
      try{ img.releasePointerCapture(e.pointerId); }catch(err){}
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      if(!dragging) return;
      // check if dropped on avatar
      const avatarRect = avatarWrap.getBoundingClientRect();
      if(e2.clientX >= avatarRect.left && e2.clientX <= avatarRect.right && e2.clientY >= avatarRect.top && e2.clientY <= avatarRect.bottom){
        // determine item type by looking at container
        const parent = img.parentElement.parentElement;
        let src = img.src;
        if(parent === makeupItems || parent.classList.contains('items') && parent.previousElementSibling && parent.previousElementSibling.textContent === 'Makeup'){
          applyMakeupSrc(src);
        } else if(parent === hairItems){
          applyHairSrc(src);
        } else if(parent === accessItems){
          applyAccessorySrc(src);
        } else if(parent === clothesItems){
          applyClothSrc(src);
        }
      }
      dragging.remove();
      dragging = null;
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  // Emoji spawn at click location
  function spawnEmoji(e){
    const el = document.createElement('div');
    el.className = 'emoji';
    const emojis = ['🎀','🌸','💗','✨','🩷'];
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    const x = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || window.innerWidth/2) - 16;
    const y = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || window.innerHeight/2) - 16;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    emojiContainer.appendChild(el);
    setTimeout(()=>el.remove(),1500);
  }

  // Apply functions
  function applyMakeupSrc(src){
    avatarMakeup.src = src;
    state.makeup = src;
  }
  function applyHairSrc(src){
    avatarHair.src = src;
    state.hair = src;
  }
  function applyAccessorySrc(src){
    // we use makeup layer for accessory overlay if small
    avatarMakeup.src = src;
    state.accessory = src;
  }
  function applyClothSrc(src){
    avatarCloth.src = src;
    state.cloth = src;
  }

  // Navigation
  function showScreen(id){
    Object.keys(screens).forEach(k => screens[k].classList.remove('active'));
    if(screens[id]) screens[id].classList.add('active');
  }

  // Photo -> compose layers on canvas and download
  function downloadImage(){
    // set canvas size proportional to avatarWrap
    const wrapRect = avatarWrap.getBoundingClientRect();
    const scale = 2; // higher resolution
    snapshot.width = Math.round(wrapRect.width * scale);
    snapshot.height = Math.round(wrapRect.height * scale);
    const ctx = snapshot.getContext('2d');
    ctx.clearRect(0,0,snapshot.width,snapshot.height);
    // draw background soft
    ctx.fillStyle = '#fff6fb';
    ctx.fillRect(0,0,snapshot.width,snapshot.height);

    // helper to draw element center-aligned
    const drawImg = (imgEl) => {
      if(!imgEl || !imgEl.src) return Promise.resolve();
      return new Promise((res) => {
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = () => {
          // compute size to fit within canvas width
          const targetW = snapshot.width * 0.86;
          const x = (snapshot.width - targetW) / 2;
          // position: base around top+some
          let y = snapshot.height * 0.08;
          if(imgEl.classList.contains('cloth-layer')) y = snapshot.height * 0.48;
          ctx.drawImage(im, x, y, targetW, targetW * (im.height/im.width));
          res();
        };
        im.onerror = () => res();
        im.src = imgEl.src;
      });
    };

    // draw order: hair (top), base, makeup/accessory, cloth (bottom)
    // but our layers: hair (top), base (middle), makeup (over face), cloth (bottom)
    // draw base first (shoulders)
    Promise.resolve()
      .then(()=>drawImg(avatarBase))
      .then(()=>drawImg(avatarMakeup))
      .then(()=>drawImg(avatarHair))
      .then(()=>drawImg(avatarCloth))
      .then(()=>{
        // create download link
        snapshot.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'avatar-pastel.png';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, 'image/png');
      });
  }

  // Audio: soft ambient - start upon first user gesture
  let audioCtx, masterGain, osc1;
  function initAudio(){
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain(); masterGain.gain.value = 0.03; masterGain.connect(audioCtx.destination);
      osc1 = audioCtx.createOscillator(); osc1.type='sine'; osc1.frequency.value = 220;
      const lfo = audioCtx.createOscillator(); lfo.type='sine'; lfo.frequency.value = 0.25;
      const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 60;
      lfo.connect(lfoGain); lfoGain.connect(osc1.frequency);
      osc1.connect(masterGain); osc1.start(); lfo.start();
    } catch(e){ /* not supported */ }
  }
  function ensureAudioStarted(){
    if(audioCtx) return;
    initAudio();
  }

  // Event wiring
  function wireEvents(){
    // menu buttons open screens
    menuBtns.forEach(b => b.addEventListener('click', (e) => {
      const target = b.dataset.open;
      showScreen(target);
      spawnEmoji(e);
      ensureAudioStarted();
    }));
    startBtn.addEventListener('click', (e) => { showScreen('makeup'); spawnEmoji(e); ensureAudioStarted(); });
    backBtns.forEach(b => b.addEventListener('click', (e) => { showScreen('menu'); spawnEmoji(e); }));

    // reset
    resetBtn.addEventListener('click', (e) => {
      initDefaults();
      spawnEmoji(e);
    });

    // to wardrobe
    toWardrobe.addEventListener('click', (e) => { showScreen('wardrobe'); spawnEmoji(e); });

    // photo
    takePhotoBtn.addEventListener('click', (e) => {
      downloadImage();
      spawnEmoji(e);
    });

    // global click to start audio on first touch (mobile)
    document.addEventListener('pointerdown', function onceStart(){
      if(!state.audioStarted){
        ensureAudioStarted();
        state.audioStarted = true;
      }
    }, {once:true});
  }

  // build UI
  function buildUI(){
    buildItemList(makeupItems, ASSETS.makeupOptions, (it)=>applyMakeupSrc(it.src));
    buildItemList(hairItems, ASSETS.hairOptions, (it)=>applyHairSrc(it.src));
    buildItemList(accessItems, ASSETS.accessoryOptions, (it)=>applyAccessorySrc(it.src));
    buildItemList(clothesItems, ASSETS.clothesOptions, (it)=>applyClothSrc(it.src));
  }

  // Initialize app
  function init(){
    initDefaults();
    buildUI();
    wireEvents();
    // show menu by default
    showScreen('menu');
  }

  // Kickoff
  init();

})();
