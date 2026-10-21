const canvas = document.querySelector('#weather');
const context = canvas.getContext('2d');
const button = document.querySelector('#motion-toggle');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false;
try { paused = localStorage.getItem('portfolio-weather-paused') === 'true'; } catch {}
let season, particles = [], frame = 0, previous = 0, width = 0, height = 0;
let sparks = [];
const colors = { winter: '#dcecff', monsoon: '#91bacd', autumn: '#dc925b', spring: '#d5b8c6', summer: '#f5d58a', celebration: '#d5b1f2' };
const fireworkColors = ['#d5b1f2', '#f4cd70', '#f2a9c9', '#a9dce8'];

function burst(x, y) {
  const count = width < 600 ? 36 : 60;
  const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
  // Bound rapid clicks without adding more animation loops or timers.
  sparks = sparks.slice(-(300 - count));
  for (let i = 0; i < count; i++) {
    const angle = i / count * Math.PI * 2 + Math.random() * .08;
    const speed = 55 + Math.random() * (width < 600 ? 130 : 190);
    sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      age: 0, life: .8 + Math.random() * .6, color });
  }
}

function resize() {
  width = innerWidth;
  height = innerHeight;
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * scale;
  canvas.height = height * scale;
  context?.setTransform(scale, 0, 0, scale, 0, 0);
}
function seed() {
  sparks = [];
  const count = season === 'monsoon' ? 80 : season === 'winter' ? 55 : 20;
  particles = Array.from({ length: width < 600 ? Math.ceil(count * .6) : count }, () => ({
    x: Math.random() * width, y: Math.random() * height,
    size: 2 + Math.random() * 5, phase: Math.random() * Math.PI * 2,
    speed: .6 + Math.random(), rotation: Math.random() * Math.PI,
  }));
}
function draw(time) {
  const dt = Math.min((time - previous) / 1000 || 0, .04);
  previous = time;
  context.clearRect(0, 0, width, height);
  for (const p of particles) {
    const rain = season === 'monsoon';
    const light = season === 'summer' || season === 'celebration';
    p.y += dt * p.speed * (rain ? 480 : light ? -12 : 28);
    p.x += dt * (rain ? -90 : Math.sin(time / 2200 + p.phase) * 16 + 8);
    if (p.y > height + 24) { p.y = -24; p.x = Math.random() * width; }
    if (p.y < -24) p.y = height + 24;
    if (p.x < -24) p.x = width + 24;
    if (p.x > width + 24) p.x = -24;
    context.save();
    context.translate(p.x, p.y);
    context.fillStyle = context.strokeStyle = colors[season] || colors.autumn;
    context.globalAlpha = rain ? .24 : light ? .25 : .5;
    if (rain) {
      context.lineWidth = .8;
      context.beginPath(); context.moveTo(0, 0); context.lineTo(-3, 18); context.stroke();
    } else if (season === 'autumn' || season === 'spring') {
      context.rotate(p.rotation + Math.sin(time / 1500 + p.phase));
      context.beginPath();
      context.ellipse(0, 0, p.size, p.size * .42, 0, 0, Math.PI * 2);
      context.fill();
      if (season === 'autumn') {
        context.strokeStyle = '#805030'; context.lineWidth = .7;
        context.beginPath(); context.moveTo(-p.size, 0); context.lineTo(p.size, 0); context.stroke();
      }
    } else {
      context.beginPath(); context.arc(0, 0, light ? 1.4 : p.size * .4, 0, Math.PI * 2); context.fill();
    }
    context.restore();
  }
  sparks = sparks.filter(p => p.age < p.life);
  for (const p of sparks) {
    p.age += dt;
    const x = p.x, y = p.y;
    const drag = Math.exp(-1.4 * dt);
    p.vx *= drag;
    p.vy = p.vy * drag + 85 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    context.save();
    context.globalAlpha = Math.max(0, 1 - p.age / p.life) * .85;
    context.strokeStyle = p.color;
    context.lineWidth = 1.8;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(p.x, p.y);
    context.stroke();
    context.restore();
  }
  frame = requestAnimationFrame(draw);
}
function sync() {
  cancelAnimationFrame(frame);
  previous = 0;
  const stopped = paused || reduced.matches;
  if (stopped || document.hidden) sparks = [];
  button.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play weather' : 'Pause weather';
  button.disabled = reduced.matches;
  button.setAttribute('aria-pressed', String(stopped));
  canvas.hidden = stopped;
  if (!stopped && !document.hidden && context) frame = requestAnimationFrame(draw);
}
export function setWeather(key) {
  if (season === key) return;
  season = key; seed(); sync();
}
resize();
addEventListener('resize', () => { resize(); seed(); });
document.addEventListener('visibilitychange', sync);
reduced.addEventListener('change', sync);
button.addEventListener('click', () => {
  paused = !paused;
  try { localStorage.setItem('portfolio-weather-paused', String(paused)); } catch {}
  sync();
});
document.addEventListener('click', event => {
  if (season !== 'celebration' || paused || reduced.matches || document.hidden || !context) return;
  if (event.button !== 0 || event.detail === 0 || event.defaultPrevented) return;
  const target = event.target;
  if (!(target instanceof Element) || !target.matches('body, main, section, article, header, footer, nav, figure, div')) return;
  if (target.closest('a, button, select, input, textarea, summary, [role="button"], [contenteditable]:not([contenteditable="false"]), .project-preview')) return;
  if (window.getSelection()?.toString()) return;
  burst(event.clientX, event.clientY);
});
