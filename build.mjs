// Static site generator for nielsvanegmond.nl. No dependencies.
//   node build.mjs          build into dist/
//   node build.mjs --serve  build, then serve dist/ on http://localhost:8080
//   node build.mjs --artifact  also build a single-page version into artifact/ (no iframes, no downloads)
import { rm, mkdir, writeFile, cp, readFile, stat } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { join, extname, dirname } from 'node:path';
import { site, home, about, projects, skills } from './content.mjs';

const OUT = 'dist';
// Changes whenever the stylesheet or script changes; appended to their URLs to bust caches.
const ASSET_VERSION = createHash('sha1')
  .update(readFileSync('src/styles.css')).update(readFileSync('src/main.js'))
  .digest('hex').slice(0, 10);
// Artifact pages can't embed YouTube or offer downloads: the video pop-up shows a preview that
// links out (see main.js, data-no-embed), and the CV points at the copy on the live site.
const ARTIFACT = process.argv.includes('--artifact');
const HOSTED_CV = `${site.url}${site.cv}`; // the CV on the live site
const img = (file) => `/assets/img/${file}`;
const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const firstSentence = (html) => strip(html).split(/(?<=[.!?])\s/)[0];
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Reading order for the prev / next links at the bottom of every subpage.
const chain = [
  { path: '/about-me/', label: 'About me' },
  ...projects.map((p) => ({ path: `/projects/${p.slug}/`, label: p.title })),
  ...skills.map((s) => ({ path: `/hard-skills/${s.slug}/`, label: s.title })),
];

const icon = {
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7l-10.4-6.5A1 1 0 0 0 6.6 5.5Z"/></svg>',
  expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>',
  chevron: '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter" d="M7 3.5l6.5 6.5-6.5 6.5"/></svg>',
  chevronLeft: '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter" d="M13 3.5l-6.5 6.5 6.5 6.5"/></svg>',
};

const title = (bold, normal = '', tag = 'h2', cls = 'section-title') =>
  `<${tag} class="${cls}"><b>${bold}</b>${normal ? ` ${normal}` : ''}</${tag}>`;

const button = (href, label, { external = false, cls = '' } = {}) =>
  `<a class="btn ${cls}" href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${label} ${icon.arrow}</a>`;

// Thumbnail that opens a YouTube video or a full-size image in the viewer.
function media(m, { eager = false, cls = '' } = {}) {
  const data = m.youtube
    ? `data-youtube="${m.youtube}"${m.vertical ? ' data-vertical' : ''}`
    : `data-image="${img(m.img)}"`;
  const label = `${m.youtube ? 'Play video' : 'View image'}: ${m.alt}`;
  return `<button type="button" class="media${m.youtube ? ' is-video' : ''} ${cls}" ${data} aria-label="${attr(label)}">
  <img src="${img(m.img)}" alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  ${m.youtube ? `<img class="media-play" src="${img('play-badge.webp')}" alt="" width="100" height="100">` : ''}
</button>`;
}

function layout({ path, pageTitle, description, body, header = 'band' }) {
  const fullTitle = pageTitle ? `${pageTitle} | ${site.name}` : `${site.name} | Technical Designer`;
  const nav = (href, label) =>
    `<a href="${href}"${path === href ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${site.url}${path}">
<meta property="og:type" content="website">
<meta property="og:title" content="${attr(fullTitle)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${site.url}${path}">
<meta property="og:image" content="${site.url}${img('profile.webp')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${header === 'band' ? '#00b6ef' : '#ffffff'}">
<meta name="color-scheme" content="light">
<link rel="icon" href="${img('favicon-32.png')}" sizes="32x32">
<link rel="apple-touch-icon" href="${img('favicon-256.png')}">
<link rel="preload" href="/assets/fonts/Gabarito-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/Nunito-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css?v=${ASSET_VERSION}">
<script>document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-anim')</script>
<script src="/assets/main.js?v=${ASSET_VERSION}" defer></script>
</head>
<body class="header-${header}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${site.name}, home"><span class="brand-first">Niels</span><span class="brand-last">van <b>Egmond</b></span></a>
    <nav aria-label="Main">
      ${nav('/', 'Overview')}
      <a href="${site.cv}" target="_blank" rel="noopener">CV</a>
      <a class="nav-icon" href="${site.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon.linkedin}</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer"><p class="sr-only">© Niels van Egmond</p></footer>
<dialog class="viewer" aria-label="Media viewer">
  <button type="button" class="viewer-close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg></button>
  <div class="viewer-stage"></div>
</dialog>
</body>
</html>
`;
}

function pager(path) {
  const i = chain.findIndex((c) => c.path === path);
  const prev = chain[i - 1];
  const next = chain[i + 1];
  return `<nav class="wrap pager" aria-label="More pages">
  ${prev ? `<a class="pager-prev" href="${prev.path}">${icon.chevronLeft}<span>${prev.label}</span></a>` : '<span></span>'}
  <a class="pager-home" href="/">Overview</a>
  ${next ? `<a class="pager-next" href="${next.path}"><span>${next.label}</span>${icon.chevron}</a>` : '<span></span>'}
</nav>`;
}

const contactCta = `<div class="contact-cta reveal">
  <a class="contact" href="${site.linkedin}" target="_blank" rel="noopener"><span>Contact me</span>${icon.linkedin}</a>
</div>`;

// Two-line page title: small tracked label over a big bold name, as on the original site.
function pageHead(eyebrow, heading) {
  return `<div class="wrap page-head reveal">
  ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
  <h1 class="page-title${strip(heading).length > 10 ? ' is-long' : ''}">${heading}</h1>
</div>`;
}

const paragraphs = (html) => html.match(/<(p|ul|ol)\b[\s\S]*?<\/\1>/g) ?? [html];

// Page intro as on the original: title (and optional eyebrow) with text, and optionally an
// image beside them that starts level with the title. fit: 'square' (256px square),
// 'stretch' (as tall as the text beside it), 'large' (324px square, text centred).
// Paragraphs past `beside` run full width underneath; `wide` inserts a full-width image.
function intro({ eyebrow = '', heading, text, side = '', fit = 'square', beside, wide }) {
  const paras = paragraphs(text);
  const n = side ? (beside ?? paras.length) : 0;
  const rest = paras.slice(n);
  if (wide) rest.splice(wide.after - n, 0, `<div class="wide-img"><img src="${img(wide.img)}" alt="${attr(wide.alt)}" loading="lazy" decoding="async"></div>`);
  return `<div class="wrap intro${side ? ` has-side fit-${fit}` : ''} reveal">
  <div class="intro-head">
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <h1 class="page-title${strip(heading).length > 10 ? ' is-long' : ''}">${heading}</h1>
  </div>
  ${n ? `<div class="prose intro-text">${paras.slice(0, n).join('')}</div>` : ''}
  ${side ? `<div class="intro-side">${side}</div>` : ''}
</div>
${rest.length ? `<div class="wrap prose prose-full intro-rest reveal">${rest.join('')}</div>` : ''}`;
}

const sectionTitle = (id, bold, normal = '', boldLast = false) => boldLast
  ? `<div class="section-head reveal"><h2 class="section-title" id="${id}">${bold} <b>${normal}</b></h2></div>` :
  `<div class="section-head${(bold + normal).length > 15 ? ' is-long' : ''} reveal">${title(bold, normal).replace('<h2', `<h2 id="${id}"`)}</div>`;

// The site's core rhythm: a 460px text column beside a 256px square, alternating sides.
const row = (text, side, { flip = false, cls = '' } = {}) => `<div class="wrap row${flip ? ' is-flipped' : ''}${side ? '' : ' row-text'} ${cls} reveal">
  <div class="prose">${text}</div>
  ${side ?? ''}
</div>`;

// ---------- Pages ----------

function homePage() {
  const skillTiles = skills.map((s) => `<a class="skill-tile" href="/hard-skills/${s.slug}/">
  <img src="${img(s.tile)}" alt="" loading="lazy" decoding="async">
  <span>${s.tileLabel ?? s.title}</span>
</a>`).join('\n');

  const testimonials = home.testimonials.map((t, i) => `<figure class="testimonial" id="testimonial-${i + 1}" aria-roledescription="slide" aria-label="${i + 1} of ${home.testimonials.length}">
  <figcaption class="panel">
    <p class="panel-name">${t.name}</p>
    <dl>
      <dt>Role</dt><dd>${t.role}</dd>
      <dt>Shared projects</dt><dd>${t.projects.join('<br>')}</dd>
    </dl>
  </figcaption>
  <blockquote class="prose"><svg class="quote-rule" viewBox="0 0 6 100" preserveAspectRatio="none" aria-hidden="true"><path d="M3 3 L3 97"/></svg>${t.quote}</blockquote>
</figure>`).join('\n');

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-orange" aria-hidden="true"></div>
  <div class="hero-inner wrap">
    <div class="hero-text">
      <h1 id="hero-title" class="hero-title">
        <span class="hero-line-1"><b>Technical</b> Designer</span>
        <span class="hero-line-2">Game <b>Developer</b> &amp; <b>Designer</b></span>
      </h1>
      <ul class="hero-facts">${home.hero.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
      <p class="hero-tagline">${home.hero.tagline}</p>
    </div>
    <div class="hero-reel">
      <button type="button" data-youtube="${site.reel.youtube}" class="reel" aria-label="Watch the teaser video">
        <img class="reel-gif" src="${img('reel.webp')}" alt="" width="320" height="180">
        <img class="reel-window" src="${img('reel-window.webp')}" alt="" width="659" height="424">
      </button>
      <p class="reel-label">Watch the teaser!</p>
    </div>
  </div>
</section>

<section aria-labelledby="about-title">
  ${sectionTitle('about-title', 'About', 'me')}
  ${row(`<p class="lead">${home.about.lead}</p>
    <p>${home.about.body}</p>
    ${button('/about-me/', 'More', { cls: 'btn-small' })}`,
    `<img class="square" src="${img('profile.webp')}" alt="Portrait of Niels van Egmond" width="1390" height="800" loading="lazy" decoding="async">`,
    { cls: 'row-home' })}
</section>

<section aria-labelledby="projects-title">
  ${sectionTitle('projects-title', 'Key', 'Projects')}
  <div class="wrap project-tiles reveal">
    ${projects.map((p) => `<a class="project-tile" href="/projects/${p.slug}/" aria-label="${attr(p.title)}"><img src="${img(p.tile)}" alt="" loading="lazy" decoding="async"></a>`).join('\n    ')}
  </div>
</section>

<section aria-labelledby="testimonials-title">
  ${sectionTitle('testimonials-title', 'Testimonials')}
  <div class="wrap carousel" aria-roledescription="carousel" aria-label="Testimonials">
    <div class="carousel-track" tabindex="0">
${testimonials}
    </div>
    <button type="button" class="carousel-btn carousel-next" data-dir="1" aria-label="Next testimonial">${icon.chevron}</button>
  </div>
</section>

<section aria-labelledby="skills-title">
  ${sectionTitle('skills-title', 'Hard', 'Skills')}
  <div class="wrap skill-grid">
${skillTiles}
  </div>
</section>
${contactCta}`;

  return layout({ path: '/', description: site.description, body, header: 'plain' });
}

function aboutPage() {
  const path = '/about-me/';
  const jobText = (j) => `<h3>${j.company} | ${j.period}</h3>
    <p>${j.body}${j.roles ? ` ${j.roles.join(' &gt; ')}.` : ''}${j.after ? ` ${j.after}` : ''}</p>`;
  const body = `
${intro({ heading: '<b>About</b> me', text: about.intro, side: `<img class="square" src="${img('profile.webp')}" alt="Portrait of Niels van Egmond" width="1390" height="800" fetchpriority="high">
    ${button(site.cv, 'Download CV', { external: true, cls: 'btn-block' })}` })}

<section aria-labelledby="core-title">
  ${sectionTitle('core-title', 'Core', 'Expertise')}
  <div class="wrap expertise reveal"><span class="expertise-rule" aria-hidden="true"></span>
    ${[about.expertise.slice(0, 3), about.expertise.slice(3)].map((col) => `<div class="prose">${col.map(([h, p]) => `<h3>${h}</h3><p>${p}</p>`).join('')}</div>`).join('\n    ')}
  </div>
</section>

<section aria-labelledby="exp-title">
  ${sectionTitle('exp-title', 'Professional', 'Expertise')}
  <div class="rows rows-after-title">
    ${about.jobs.map((j, i) => row(jobText(j), `<img class="square" src="${img(j.logo)}" alt="${j.company} logo" width="600" height="600" loading="lazy">`, { flip: i % 2 === 1 })).join('\n    ')}
  </div>
</section>
${pager(path)}`;
  return layout({ path, pageTitle: about.title, description: firstSentence(about.intro), body });
}

function projectPage(p) {
  const path = `/projects/${p.slug}/`;
  const facts = `<div class="side">
    <dl class="panel">${p.facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
    ${button(p.link, 'Official site', { external: true, cls: 'btn-block' })}
  </div>`;
  const contributions = p.contributions?.map(([h, items]) => `<h4>${h}</h4><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`).join('');
  const body = `
${pageHead('Key <b>Projects</b>', p.title)}
<div class="wrap reveal">${media({ ...p.header }, { eager: true, cls: 'media-hero' })}</div>
${row(p.body, facts, { cls: 'row-first' })}
${p.contributions ? `<section aria-labelledby="contrib-title">
  ${sectionTitle('contrib-title', 'My', 'Contributions', true)}
  ${row(contributions, p.gallery ? media(p.gallery, { cls: 'media-tall' }) : '', { flip: true, cls: 'row-contrib' })}
</section>` : ''}
${pager(path)}`;
  return layout({ path, pageTitle: p.title, description: firstSentence(p.body), body });
}

function skillPage(s) {
  const path = `/hard-skills/${s.slug}/`;
  // Which side the first example image sits on follows the original page.
  const example = (e, i) => `<div>${row(`<h3>${e.title}</h3>${e.body}`, e.media ? media(e.media) : null,
    { flip: s.mediaFirstLeft ? i % 2 === 0 : i % 2 === 1 })}${e.after ? `<div class="wrap prose prose-full example-after reveal">${e.after}</div>` : ''}</div>`;
  // Examples without media: side by side in two columns (one alone runs full width).
  const textOnly = (list, afterIntro) => `<div class="wrap text-cols cols-${Math.min(2, list.length)} ${afterIntro ? 'rows-after-intro' : 'rows-after-title'} reveal">
    ${list.map((e) => `<div class="prose"><h3>${e.title}</h3>${e.body}</div>`).join('\n    ')}
  </div>`;
  const sections = s.sections.map((sec, n) => {
    const allText = sec.examples.every((e) => !e.media);
    return `<section class="skill-section" aria-labelledby="sec-${n}">
  ${sectionTitle(`sec-${n}`, sec.heading[0], sec.heading[1])}
  ${sec.intro ? `<div class="wrap prose prose-full section-intro reveal">${sec.intro}</div>` : ''}
  ${allText ? textOnly(sec.examples, !!sec.intro) : `<div class="rows ${sec.intro ? 'rows-after-intro' : 'rows-after-title'}">
    ${sec.examples.map(example).join('\n    ')}
  </div>`}
</section>`;
  }).join('\n');

  const side = s.introImg ? `<img src="${img(s.introImg.img)}" alt="${attr(s.introImg.alt)}" fetchpriority="high" decoding="async">` : '';
  const body = `
${intro({ eyebrow: 'Hard <b>Skills</b>', heading: s.title, text: s.intro, side, fit: s.introFit, beside: s.introBeside, wide: s.introWide })}
${sections}
${pager(path)}`;
  return layout({ path, pageTitle: s.title, description: firstSentence(s.intro), body });
}

function notFoundPage() {
  const body = `
${pageHead('Error 404', '<b>Level</b> not found')}
<div class="wrap prose reveal">
  <p>This page fell off the map. Maybe the rope got cut.</p>
  ${button('/', 'Back to overview', { cls: 'btn-small' })}
</div>`;
  return layout({ path: '/404.html', pageTitle: 'Page not found', description: 'Page not found.', body });
}

// ---------- Build ----------

async function page(route, html) {
  const file = route.endsWith('.html') ? join(OUT, route) : join(OUT, route, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

async function build() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await cp('assets', join(OUT, 'assets'), { recursive: true });
  await cp('src/styles.css', join(OUT, 'assets/styles.css'));
  await cp('src/main.js', join(OUT, 'assets/main.js'));

  await page('/', homePage());
  await page('/about-me/', aboutPage());
  for (const p of projects) await page(`/projects/${p.slug}/`, projectPage(p));
  for (const s of skills) await page(`/hard-skills/${s.slug}/`, skillPage(s));
  await page('/404.html', notFoundPage());

  const urls = ['/', ...chain.map((c) => c.path)];
  await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}${u}</loc></url>`).join('\n')}
</urlset>
`);
  await writeFile(join(OUT, '.nojekyll'), ''); // GitHub Pages: serve files as-is
  await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
  console.log(`Built ${urls.length + 1} pages into ${OUT}/`);
}

// Folds every page into one document with hash routing (#about-me, #physics, …).
async function buildArtifact() {
  const DIR = 'artifact';
  const pages = [
    ['home', homePage()],
    ['about-me', aboutPage()],
    ...projects.map((p) => [p.slug, projectPage(p)]),
    ...skills.map((s) => [s.slug, skillPage(s)]),
  ];
  const rewrite = (html) => html
    .replace(/href="\/"/g, 'href="#home"')
    .replace(/href="\/(?:about-me|projects\/([\w-]+)|hard-skills\/([\w-]+))\/"/g, (_, p, s) => `href="#${p ?? s ?? 'about-me'}"`)
    .replace(new RegExp(site.cv.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'), 'g'), HOSTED_CV)
    .replace(/"\/assets\//g, '"assets/');
  const pick = (html, re) => html.match(re)[1];

  const sections = pages.map(([route, html]) => {
    const main = pick(html, /<main id="main">([\s\S]*)<\/main>/);
    const header = pick(html, /<body class="header-(\w+)"/);
    const pageTitle = pick(html, /<title>(.*?)<\/title>/);
    return `<div class="route" id="page-${route}" data-route="${route}" data-header="${header}" data-title="${attr(pageTitle)}"${route === 'home' ? '' : ' hidden'}>
${rewrite(main)}
</div>`;
  }).join('\n');

  const shell = homePage();
  const chrome = (re) => rewrite(pick(shell, re));
  const css = (await readFile('src/styles.css', 'utf8'))
    .replace(/@font-face \{[^}]*\}\n/g, '')
    .replace(/\.js \.reveal[^\n]*\n/g, '');
  const js = await readFile('src/main.js', 'utf8');

  const html = `<title>Niels van Egmond</title>
<script>document.documentElement.dataset.noEmbed = '';document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-anim')</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&family=Nunito:ital,wght@0,400..900;1,400..900&display=swap">
<style>
${css}
</style>
<div class="header-plain" id="app">
<a class="skip" href="#main">Skip to content</a>
${chrome(/(<header class="site-header">[\s\S]*?<\/header>)/)}
<main id="main">
${sections}
</main>
${chrome(/(<footer class="site-footer">[\s\S]*?<\/footer>)/)}
${chrome(/(<dialog class="viewer"[\s\S]*?<\/dialog>)/)}
</div>
<script>
${js}
// Hash router: one page visible at a time.
(() => {
  const app = document.getElementById('app');
  const routes = [...document.querySelectorAll('.route')];
  const show = () => {
    const token = location.hash.slice(1);
    const target = routes.find((r) => r.dataset.route === token) ?? routes[0];
    routes.forEach((r) => (r.hidden = r !== target));
    app.className = 'header-' + target.dataset.header;
    document.title = target.dataset.title;
    const current = '#' + target.dataset.route;
    document.querySelectorAll('.site-header nav a').forEach((a) => {
      if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  addEventListener('hashchange', show);
  show();
})();
</script>
`;
  await rm(DIR, { recursive: true, force: true });
  await mkdir(DIR, { recursive: true });
  await cp('assets/img', join(DIR, 'assets/img'), { recursive: true });
  await writeFile(join(DIR, 'index.html'), html);
  console.log(`Built single-page artifact into ${DIR}/`);
}

function serve(port = 8080) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };
  createServer(async (req, res) => {
    let file = join(OUT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'content-type': types['.html'] });
      res.end(await readFile(join(OUT, '404.html')));
    }
  }).listen(port, () => console.log(`Serving on http://localhost:${port}`));
}

await build();
if (ARTIFACT) await buildArtifact();
if (process.argv.includes('--serve')) serve();
