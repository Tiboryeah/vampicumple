/* ══════════════════════════════════════════════════
   CUMPLE VAMPI — JAVASCRIPT
   Animaciones, interacciones, audio, estrellas, etc.
   ══════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════
// CURSOR PERSONALIZADO
// ══════════════════════════════════
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;
  if (window.innerWidth <= 768) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top  = `${mouseY}px`;
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.2;
    trailY += (mouseY - trailY) * 0.2;
    trail.style.left = `${trailX}px`;
    trail.style.top  = `${trailY}px`;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
})();

// ══════════════════════════════════
// CANVAS DE ESTRELLAS
// ══════════════════════════════════
function createStarsCanvas(canvasId, starCount = 120, twinkle = true) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: starCount }, () => ({
    x:       Math.random(),
    y:       Math.random(),
    r:       Math.random() * 1.8 + 0.2,
    phase:   Math.random() * Math.PI * 2,
    speed:   Math.random() * 0.015 + 0.005,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    stars.forEach(s => {
      const alpha = twinkle
        ? s.opacity * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase))
        : s.opacity;

      // Star glow
      const grd = ctx.createRadialGradient(
        s.x * canvas.width, s.y * canvas.height, 0,
        s.x * canvas.width, s.y * canvas.height, s.r * 4
      );
      grd.addColorStop(0,   `rgba(242,233,228,${alpha})`);
      grd.addColorStop(0.4, `rgba(200,169,107,${alpha * 0.5})`);
      grd.addColorStop(1,   'transparent');

      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242,233,228,${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

createStarsCanvas('starsCanvas',  150, true);
createStarsCanvas('starsCanvas2',  80, true);
createStarsCanvas('starsCanvas3', 100, true);

// ══════════════════════════════════
// MURCIÉLAGOS EN EL HERO
// ══════════════════════════════════
(function createBats() {
  const container = document.getElementById('batsContainer');
  if (!container) return;

  const batSVG = `<svg width="20" height="12" viewBox="0 0 20 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6 C8 4 4 2 0 3 C2 4 3 5 4 7 C6 6 8 6 10 6Z"/>
    <path d="M10 6 C12 4 16 2 20 3 C18 4 17 5 16 7 C14 6 12 6 10 6Z"/>
    <circle cx="10" cy="6" r="2.5"/>
  </svg>`;

  for (let i = 0; i < 6; i++) {
    const bat = document.createElement('div');
    bat.className = 'bat';
    bat.innerHTML = batSVG;

    const startX = Math.random() * 60 - 10;
    const dx  = (Math.random() * 300 + 100) * (Math.random() > 0.5 ? 1 : -1);
    const dx2 = dx * (1.5 + Math.random());
    const dy  = -(Math.random() * 100 + 40);
    const dy2 = -(Math.random() * 60 + 20);

    bat.style.cssText = `
      left: ${startX + 20}%;
      top: ${20 + Math.random() * 50}%;
      --dx: ${dx}px;
      --dy: ${dy}px;
      --dx2: ${dx2}px;
      --dy2: ${dy2}px;
      --dur: ${10 + Math.random() * 8}s;
      --delay: ${-i * 2.5}s;
      color: rgba(192,138,163,0.6);
    `;
    container.appendChild(bat);
  }
})();

// ══════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  // Stagger para los hijos
  document.querySelectorAll('[data-reveal-stagger]').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });
})();

// ══════════════════════════════════
// AUDIO Y REPRODUCTOR
// ══════════════════════════════════
const audio      = document.getElementById('bgMusic');
const player     = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon   = document.getElementById('playIcon');
const musicBarFill = document.getElementById('musicBarFill');
const volumeSlider = document.getElementById('volumeSlider');

let isPlaying = false;
let musicStarted = false;

// Configurar volumen inicial suave (30%)
if (audio) {
  audio.volume = 0.3;
}

if (volumeSlider && audio) {
  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });
}

function startMusic() {
  if (!audio) return;
  if (!musicStarted) {
    musicStarted = true;
    player.style.display = 'block';
  }
  audio.play().then(() => {
    isPlaying = true;
    updatePlayIcon();
  }).catch((err) => {
    // Si no hay archivo de audio, igual mostramos el reproductor
    console.warn('Audio no disponible:', err);
    player.style.display = 'block';
    isPlaying = false;
    updatePlayIcon();
  });
}

function updatePlayIcon() {
  if (playIcon) {
    playIcon.textContent = isPlaying ? '⏸' : '▶';
  }
}

if (playPauseBtn) {
  playPauseBtn.addEventListener('click', () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().catch(() => {});
      isPlaying = true;
    }
    updatePlayIcon();
  });
}

if (audio) {
  audio.addEventListener('timeupdate', () => {
    if (audio.duration && musicBarFill) {
      const pct = (audio.currentTime / audio.duration) * 100;
      musicBarFill.style.width = `${pct}%`;
    }
  });
  audio.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayIcon();
  });
}

// ══════════════════════════════════
// BOTÓN DE ENTRADA
// ══════════════════════════════════
const btnEnter = document.getElementById('btnEnter');
if (btnEnter) {
  btnEnter.addEventListener('click', () => {
    startMusic();

    // Scroll suave a la carta
    const carta = document.getElementById('carta');
    if (carta) {
      setTimeout(() => {
        carta.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }

    // Animación de salida del hero
    btnEnter.style.transition = 'all 0.6s ease';
    btnEnter.style.transform = 'scale(0.95)';
    btnEnter.style.opacity = '0.7';
    setTimeout(() => {
      btnEnter.style.transform = '';
      btnEnter.style.opacity = '';
    }, 600);
  });
}

// ══════════════════════════════════
// ESTRELLAS INTERACTIVAS (El Principito)
// ══════════════════════════════════
(function createInteractiveStars() {
  const field   = document.getElementById('starsField');
  const tooltip = document.getElementById('starTooltip');
  if (!field || !tooltip) return;

  // ✏️ EDITABLE: Cambia estos mensajes por lo que más la describa
  const messages = [
    { text: '✨ Tu risa', emoji: '😄' },
    { text: '🌙 Tus ojitos', emoji: '👀' },
    { text: '🌹 Tu forma de amar', emoji: '💕' },
    { text: '🦇 Tu oscuridad bonita', emoji: '🖤' },
    { text: '🌿 Tu sensibilidad', emoji: '🌱' },
    { text: '⭐ Tu inteligencia', emoji: '🧠' },
    { text: '🍓 Tu ternura', emoji: '🥺' },
    { text: '🌙 Tu lado travieso', emoji: '😏' },
    { text: '🥀 Tu esencia única', emoji: '✨' },
    { text: '💜 Tu corazón enorme', emoji: '💜' },
    { text: '🦔 Tu curiosidad', emoji: '🔍' },
    { text: '🌸 Tu voz', emoji: '🎵' },
  ];

  const positions = [
    [10, 15], [25, 8],  [45, 5],  [60, 12], [78, 7],  [88, 20],
    [15, 40], [35, 35], [55, 38], [70, 45], [85, 42], [5, 60],
    [20, 65], [40, 58], [65, 62], [80, 70], [50, 72], [92, 55],
  ];

  function buildStarSVG(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15,9 22,9 16.5,13.5 18.5,21 12,17 5.5,21 7.5,13.5 2,9 9,9" stroke="rgba(200,169,107,0.5)" stroke-width="0.5"/>
    </svg>`;
  }

  messages.forEach((msg, i) => {
    const pos  = positions[i % positions.length];
    const size = 14 + Math.random() * 16;
    const dur  = 2.5 + Math.random() * 2;
    const delay = Math.random() * 2;

    const star = document.createElement('div');
    star.className = 'star-item pulsing';
    star.style.cssText = `
      left: ${pos[0]}%;
      top:  ${pos[1]}%;
      --star-dur:   ${dur}s;
      --star-delay: ${delay}s;
    `;
    star.innerHTML = buildStarSVG(size, '#C8A96B');
    star.setAttribute('title', msg.text);

    star.addEventListener('mouseenter', (e) => {
      tooltip.textContent = msg.text;
      tooltip.classList.add('visible');
    });

    star.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.clientX + 16}px`;
      tooltip.style.top  = `${e.clientY - 36}px`;
    });

    star.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });

    star.addEventListener('click', (e) => {
      tooltip.textContent = msg.text + ' 💕';
      tooltip.classList.add('visible');
      spawnMiniHearts(e.clientX, e.clientY);
    });

    field.appendChild(star);
  });
})();

// ══════════════════════════════════
// MINI CORAZONES (al click en estrella)
// ══════════════════════════════════
function spawnMiniHearts(x, y) {
  const items = ['💕', '🌙', '✨', '🥀', '💜'];
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('div');
    heart.style.cssText = `
      position: fixed;
      left: ${x}px;
      top:  ${y}px;
      font-size: ${12 + Math.random() * 10}px;
      pointer-events: none;
      z-index: 9000;
      animation: heartFly 1.2s ease forwards;
      --hx: ${(Math.random() - 0.5) * 80}px;
      --hy: ${-(40 + Math.random() * 60)}px;
    `;
    heart.textContent = items[Math.floor(Math.random() * items.length)];
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1300);
  }

  // Inyectar keyframe si no existe
  if (!document.getElementById('heartFlyKF')) {
    const style = document.createElement('style');
    style.id = 'heartFlyKF';
    style.textContent = `
      @keyframes heartFly {
        0%   { opacity: 1; transform: translate(0, 0) scale(1); }
        100% { opacity: 0; transform: translate(var(--hx), var(--hy)) scale(0.6); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ══════════════════════════════════
// MODAL DE SORPRESA
// ══════════════════════════════════
const btnSurprise  = document.getElementById('btnSurprise');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalHearts  = document.getElementById('modalHearts');
const celebration  = document.getElementById('celebration');

function openModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.add('open');
  launchCelebration();
  fillModalHearts();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (modalHearts) modalHearts.innerHTML = '';
}

if (btnSurprise) btnSurprise.addEventListener('click', openModal);
if (modalClose)  modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

function fillModalHearts() {
  if (!modalHearts) return;
  modalHearts.innerHTML = '';
  const items = ['🌙', '🥀', '💕', '✨', '🦇', '💜', '🌹', '⭐'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: absolute;
      font-size: ${10 + Math.random() * 14}px;
      left:  ${Math.random() * 100}%;
      top:   ${Math.random() * 100}%;
      opacity: 0.12;
      pointer-events: none;
      animation: float2 ${3 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite alternate;
    `;
    el.textContent = items[Math.floor(Math.random() * items.length)];
    modalHearts.appendChild(el);
  }

  if (!document.getElementById('float2KF')) {
    const style = document.createElement('style');
    style.id = 'float2KF';
    style.textContent = `
      @keyframes float2 {
        from { transform: translateY(0) rotate(-5deg); }
        to   { transform: translateY(-12px) rotate(5deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ══════════════════════════════════
// CELEBRACIÓN (pétalos / emojis)
// ══════════════════════════════════
function launchCelebration() {
  if (!celebration) return;
  celebration.innerHTML = '';

  const emojis = ['🌹', '🦇', '✨', '🌙', '💕', '🥀', '🌟', '💜', '🌸', '⭐'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${12 + Math.random() * 16}px;
      --fall-dur:   ${2 + Math.random() * 2}s;
      --fall-delay: ${Math.random() * 2}s;
      --drift:      ${(Math.random() - 0.5) * 120}px;
      --rot:        ${(Math.random() - 0.5) * 360}deg;
    `;
    celebration.appendChild(piece);
  }

  setTimeout(() => { celebration.innerHTML = ''; }, 5000);
}

// ══════════════════════════════════
// EASTER EGGS
// ══════════════════════════════════

// Murciélago oculto en hero
const easterBat = document.getElementById('easterBat');
if (easterBat) {
  easterBat.addEventListener('click', () => {
    easterBat.classList.toggle('clicked');
    easterBat.style.opacity = '1';
  });
}

// Rosa oculta en sección final
const easterRose = document.getElementById('easterRose');
if (easterRose) {
  easterRose.addEventListener('click', (e) => {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 50px;
      background: rgba(42,14,24,0.95);
      border: 1px solid rgba(139,30,63,0.6);
      border-radius: 12px;
      padding: 12px 20px;
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      color: #F2E9E4;
      font-size: 0.95rem;
      z-index: 9999;
      opacity: 0;
      transition: all 0.4s ease;
      max-width: 220px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    `;
    tooltip.textContent = '"La rosa que le dediqué... sigue siendo tuya." 🥀';
    document.body.appendChild(tooltip);
    requestAnimationFrame(() => { tooltip.style.opacity = '1'; });
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 500);
    }, 3500);
  });
}

// Estrella secreta (busca el primer star-item)
setTimeout(() => {
  const firstStar = document.querySelector('.star-item');
  if (firstStar) {
    const badge = document.createElement('div');
    badge.style.cssText = `
      position: absolute;
      top: -10px; right: -10px;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #C8A96B;
      animation: starPulse 1.5s ease-in-out infinite;
    `;
    firstStar.style.position = 'relative';
    firstStar.appendChild(badge);
  }
}, 1000);

// ══════════════════════════════════
// GALERÍA — HOVER PARALAX LEVE
// ══════════════════════════════════
document.querySelectorAll('.polaroid').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.04) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ══════════════════════════════════
// CARDS UNIVERSO — EFECTO TILT
// ══════════════════════════════════
document.querySelectorAll('.universe-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ══════════════════════════════════
// BIENVENIDA — Texto de consola
// ══════════════════════════════════
console.log('%c🌙 Esta página fue hecha con amor, solo para ti. 🥀', [
  'font-family: Georgia, serif',
  'font-size: 14px',
  'color: #C08AA3',
  'padding: 8px 16px',
  'border-left: 2px solid #8B1E3F',
].join(';'));

console.log('%cSi encontraste esto, eres curiosa y eso me encanta. ✨', [
  'font-family: Georgia, serif',
  'font-size: 12px',
  'color: #7B5C8E',
  'font-style: italic',
].join(';'));
