import { profile, projects, inDevelopment } from './content.js';
import { themes, resolveTheme } from './themes.js';
import { setWeather } from './weather.js';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function externalLink(url, className, label) {
  const link = element('a', className, label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

for (const project of projects) {
  const article = element('article', 'project');
  if (project.screenshot === false) article.classList.add('project-no-visual');
  article.id = `project-${project.id}`;
  if (project.screenshot !== false) {
    const figure = element('figure', 'project-visual');
    const previewUrl = project.website || project.live;
    const preview = element('div', 'project-preview');
    const screen = element('div', 'preview-screen');
    screen.id = `preview-${project.id}`;
    // Preserve the complete workspace for apps whose narrow layout hides panels.
    if (project.previewViewport) {
      const { width, height } = project.previewViewport;
      screen.classList.add('preview-screen-desktop');
      screen.style.aspectRatio = `${width} / ${height}`;
      screen.style.setProperty('--preview-width', `${width}px`);
      screen.style.setProperty('--preview-height', `${height}px`);
      const updateScale = () => screen.style.setProperty('--preview-scale', screen.clientWidth / width);
      new ResizeObserver(updateScale).observe(screen);
    }
    const image = element('img');
    image.src = `assets/screenshots/${project.screenshot || `${project.id}.jpg`}`;
    image.alt = project.id === 'matchalert' ? 'Match Alert’s published competition coverage page' : `${project.name} — actual application screenshot`;
    image.width = project.screenshotWidth || 1280;
    image.height = project.screenshotHeight || 720;
    image.style.aspectRatio = `${image.width} / ${image.height}`;
    image.loading = 'lazy';
    const activate = element('button', 'preview-activate', 'Explore live website');
    activate.type = 'button';
    activate.setAttribute('aria-label', `Explore ${project.name} live website`);
    activate.setAttribute('aria-controls', screen.id);
    activate.setAttribute('aria-expanded', 'false');
    const close = element('button', 'preview-close', 'Close preview');
    close.type = 'button';
    close.hidden = true;
    const previewHint = project.previewViewport
      ? 'Full workspace scaled to fit · Open website for a larger view'
      : 'Scroll inside the preview';
    const hintAction = element('button', 'preview-hint-action', 'Click to explore');
    hintAction.type = 'button';
    const hintSeparator = element('span', '', ' · ');
    const status = element('span', 'preview-status', previewHint);
    status.setAttribute('role', 'status');
    hintAction.addEventListener('click', () => activate.click());
    let frame;
    const reset = () => {
      frame?.remove();
      frame = undefined;
      image.hidden = false;
      activate.hidden = false;
      close.hidden = true;
      hintAction.hidden = false;
      hintSeparator.hidden = false;
      activate.setAttribute('aria-expanded', 'false');
      status.textContent = previewHint;
      activate.focus({ preventScroll: true });
    };
    activate.addEventListener('click', () => {
      frame = element('iframe', 'preview-frame');
      frame.title = `${project.name} live website`;
      frame.src = previewUrl;
      frame.referrerPolicy = 'no-referrer';
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads');
      frame.addEventListener('load', () => {
        status.textContent = project.previewViewport
          ? 'Full workspace · Press Visualize to begin. Open website for a larger view.'
          : 'Scroll inside to explore. Blank preview? Open the website.';
      });
      frame.addEventListener('error', () => {
        status.textContent = 'Preview unavailable. Open the website to explore.';
      });
      image.hidden = true;
      activate.hidden = true;
      close.hidden = false;
      hintAction.hidden = true;
      hintSeparator.hidden = true;
      activate.setAttribute('aria-expanded', 'true');
      status.textContent = 'Loading website… If it stays blank, open the website.';
      screen.append(frame);
      close.focus({ preventScroll: true });
    });
    close.addEventListener('click', reset);
    preview.addEventListener('keydown', event => {
      if (event.key === 'Escape' && frame) reset();
    });
    screen.append(image, activate);
    const toolbar = element('div', 'preview-toolbar');
    toolbar.append(externalLink(previewUrl, 'preview-open', 'Open website ↗'), close);
    preview.append(screen, toolbar);
    const caption = element('figcaption');
    caption.append(hintAction, hintSeparator, status);
    figure.append(preview, caption);
    article.append(figure);
  }
  const detail = element('div', 'project-detail');
  const productLink = externalLink(project.live, 'project-link', project.action);
  detail.append(element('h3', '', project.name), element('p', 'project-description', project.description), productLink);
  const links = element('div', 'project-links');
  if (project.website) links.append(externalLink(project.website, '', 'Website & commands'));
  if (project.source) links.append(externalLink(project.source, '', 'Source code'));
  detail.append(links);
  article.append(detail);
  document.querySelector('#projects').append(article);
}
for (const project of inDevelopment) {
  const article = element('article', 'development-project');
  article.append(element('h3', '', project.name), element('p', '', project.description));
  document.querySelector('#development-projects').append(article);
}

const select = document.querySelector('#theme-select');
for (const [key, theme] of Object.entries(themes)) {
  const option = element('option', '', theme.name);
  option.value = key;
  select.append(option);
}
try {
  const saved = localStorage.getItem('portfolio-edition');
  if (saved === 'auto' || Object.hasOwn(themes, saved)) select.value = saved;
} catch { /* Seasonal mode remains usable when storage is unavailable. */ }

let rainObservation = null;
let rainObservationAt = 0;
const RAIN_API = 'https://api-open.data.gov.sg/v2/real-time/api/rainfall';
const RAIN_POLL_MS = 5 * 60 * 1000;
const RAIN_MAX_AGE_MS = 15 * 60 * 1000;

function applyTheme() {
  const seasonal = resolveTheme(new Date(), undefined, profile.timeZone);
  const rainIsCurrent = rainObservation === true && Date.now() - rainObservationAt <= RAIN_MAX_AGE_MS;
  const automatic = rainIsCurrent && !seasonal.occasion
    ? { key: 'monsoon', occasion: 'Raining in Singapore' }
    : seasonal;
  const key = select.value === 'auto' ? automatic.key : select.value;
  document.documentElement.dataset.theme = key;
  setWeather(key);
  document.querySelector('#theme-status').textContent = select.value === 'auto'
    ? automatic.occasion || themes[key].name
    : key === 'celebration' ? 'Click the background for fireworks' : '';
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
}
select.addEventListener('change', () => {
  try { localStorage.setItem('portfolio-edition', select.value); } catch { /* The selection still applies for this visit. */ }
  applyTheme();
  if (select.value === 'auto') refreshRainObservation();
});

async function refreshRainObservation() {
  if (select.value !== 'auto' || document.hidden) return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(RAIN_API, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error(`Rainfall API returned ${response.status}`);
    const result = await response.json();
    const latest = result?.data?.readings?.at(-1);
    const timestamp = Date.parse(latest?.timestamp || '');
    const values = latest?.data
      ?.filter(item => item.value !== null && item.value !== undefined)
      .map(item => Number(item.value))
      .filter(Number.isFinite) || [];
    const age = Date.now() - timestamp;
    if (!Number.isFinite(timestamp) || age < -5 * 60 * 1000 || age > RAIN_MAX_AGE_MS || values.length === 0) {
      throw new Error('Rainfall readings are missing or stale');
    }
    rainObservation = values.some(value => value > 0);
    rainObservationAt = Date.now();
  } catch {
    // No live reading means the calendar season remains the automatic fallback.
    rainObservation = null;
    rainObservationAt = 0;
  } finally {
    clearTimeout(timeout);
    if (select.value === 'auto') applyTheme();
  }
}

applyTheme();
refreshRainObservation();
setInterval(() => {
  if (select.value === 'auto') refreshRainObservation();
}, RAIN_POLL_MS);
setInterval(applyTheme, 60000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    applyTheme();
    refreshRainObservation();
  }
});
document.querySelectorAll('[data-real-name]').forEach(node => { node.textContent = profile.name; });
document.querySelectorAll('[data-handle]').forEach(node => { node.textContent = profile.handle; node.href = profile.github; });
document.querySelectorAll('[data-github]').forEach(node => { node.href = profile.github; });
document.querySelectorAll('[data-linkedin]').forEach(node => { node.href = profile.linkedin; });
document.querySelectorAll('[data-youtube]').forEach(node => { node.href = profile.youtube; });
document.querySelector('#year').textContent = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: profile.timeZone }).format(new Date());
const navigation = document.querySelector('.navigation');
let compactNavigation = false;
const updateNavigation = () => {
  if (!compactNavigation && window.scrollY > 96) compactNavigation = true;
  else if (compactNavigation && window.scrollY < 32) compactNavigation = false;
  navigation.classList.toggle('is-compact', compactNavigation);
};
window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();
