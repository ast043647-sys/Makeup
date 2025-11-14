// SCRIPT.JS – Mini Makeup & Dress-Up Game

console.log("script loaded");

// ELEMENTS const tabs = document.querySelectorAll('.tab'); const sectionDress = document.getElementById('sectionDress'); const sectionAvatar = document.getElementById('sectionAvatar'); const startBtn = document.getElementById('startBtn'); const howBtn = document.getElementById('howBtn'); const modal = document.getElementById('modal'); const closeModal = document.getElementById('closeModal'); const okModal = document.getElementById('okModal'); const avatarSVG = document.getElementById('avatarSVG'); const palette = document.getElementById('palette'); const toolBtns = document.querySelectorAll('.tool-btn');

let currentTool = "lip"; let currentColor = "#FFB7D3";

// TOOL CHANGE

toolBtns.forEach(btn => { btn.addEventListener('click', () => { toolBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); currentTool = btn.dataset.tool; }); });

// PALETTE COLOR PICK palette.addEventListener('click', (e) => { if (e.target.classList.contains('sw')) { currentColor = e.target.dataset.color; } });

// APPLY ON AVATAR avatarSVG.addEventListener('click', (e) => { const id = e.target.id;

if (currentTool === "lip" && (id === "upperLip" || id === "lowerLip")) { e.target.setAttribute('fill', currentColor); animateLipstick(); }

if (currentTool === "blush" && (id === "leftCheek" || id === "rightCheek")) { e.target.setAttribute('fill', currentColor); }

if (currentTool === "eye" && (id === "eyeL" || id === "eyeR")) { e.target.setAttribute('fill', currentColor); }

if (currentTool === "hair" && id === "hair") { e.target.setAttribute('fill', currentColor); } });

// LIPSTICK ANIMATION function animateLipstick() { const svg = document.createElementNS("http://www.w3.org/2000/svg", "text"); svg.textContent = "💄"; svg.setAttribute('x', 160); svg.setAttribute('y', 200); svg.setAttribute('font-size', '30'); svg.style.opacity = 0; svg.style.transition = "0.6s"; avatarSVG.appendChild(svg);

setTimeout(() => { svg.style.opacity = 1; svg.setAttribute('x', 180); svg.setAttribute('y', 250); }, 10);

setTimeout(() => { svg.remove(); }, 700); }

// TABS (BAJU / MAKEUP) tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');

if (tab.id === "tabDress") {
  sectionDress.style.display = "block";
} else {
  sectionDress.style.display = "none";
}

}); });

// AVATAR PICK const thumbs = document.querySelectorAll('.avatar-thumb'); thumbs.forEach(t => { t.addEventListener('click', () => { thumbs.forEach(a => a.classList.remove('selected')); t.classList.add('selected'); }); });

// DRESS PICK document.querySelectorAll('[data-dress]').forEach(dress => { dress.addEventListener('click', () => { const color = dress.dataset.dress;

if (color === "pink") document.getElementById('dress').setAttribute('fill', '#FFD7E6');
if (color === "lilac") document.getElementById('dress').setAttribute('fill', '#EBC9FF');
if (color === "mint") document.getElementById('dress').setAttribute('fill', '#C3FFE8');

}); });

// MODAL howBtn.addEventListener('click', () => { modal.style.display = "flex"; }); closeModal.addEventListener('click', () => { modal.style.display = "none"; }); okModal.addEventListener('click', () => { modal.style.display = "none"; });

// MUSIC TOGGLE const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_5d9d1b5bea.mp3"); audio.loop = true;

document.getElementById('musicToggle').addEventListener('click', () => { if (audio.paused) { audio.play(); musicToggle.textContent = "🔇 Pause"; } else { audio.pause(); musicToggle.textContent = "🎵 Play"; } });

// RESET document.getElementById('resetBtn').addEventListener('click', () => { document.getElementById('upperLip').setAttribute('fill', '#ffd1df'); document.getElementById('lowerLip').setAttribute('fill', '#ff99c3'); document.getElementById('leftCheek').setAttribute('fill', 'transparent'); document.getElementById('rightCheek').setAttribute('fill', 'transparent'); document.getElementById('hair').setAttribute('fill', '#FDE9F2'); });

// UNDO (simple) document.getElementById('undoBtn').addEventListener('click', () => { alert("Undo sederhana belum dibuat secara penuh"); });

// DOWNLOAD AVATAR document.getElementById('downloadBtn').addEventListener('click', () => { const svg = document.getElementById('avatarSVG'); const svgData = new XMLSerializer().serializeToString(svg); const blob = new Blob([svgData], { type: "image/svg+xml" }); const url = URL.createObjectURL(blob);

const a = document.createElement('a'); a.href = url; a.download = "avatar_makeup.svg"; a.click(); });
