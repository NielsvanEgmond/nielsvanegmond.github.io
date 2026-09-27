// Browser-bar colour. Phone Safari tints both bars (a fade over the content) and the rubber-band
// area past the end of the page with the body's background colour, and updates it live. So the
// body colour follows the scroll: the colour block at the top of the screen (blue header band,
// or the hero), easing to white as it scrolls away, and easing to the footer's orange as the
// footer arrives. The root colour follows too (desktop overscroll).
(() => {
  const root = document.documentElement;
  const body = document.body;
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  if (!main || !footer) return;
  // On load: subpages start with the band's blue in Safari's status-bar area (a solid block
  // Safari draws in the page colour), and the band springs down out of it; the page under
  // the band is white (styles.css). On phones the home page's stacked hero fades in while
  // its blue block springs in.
  const band = document.querySelector('.header-band .site-header');
  const phoneHero = matchMedia('(max-width: 767px)').matches ? document.querySelector('.hero') : null;
  const fading = [phoneHero].filter(Boolean);
  // Let main (white) reach up to the top of the page under the header band (styles.css).
  const setHeaderH = () => band && root.style.setProperty('--header-h', `${band.offsetHeight}px`);
  setHeaderH();
  addEventListener('resize', setHeaderH);
  const startColour = getComputedStyle(band ?? body).backgroundColor;  // the page's top colour
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let intro = fading.length && !still ? 0 : 1;
  if (intro < 1) fading.forEach((el) => { el.style.opacity = '0'; });
  const pageColour = getComputedStyle(main).backgroundColor;   // white
  const footerColour = getComputedStyle(footer).backgroundColor;
  // Most specific first: on phones the hero's blue text block sits inside the orange hero.
  const topBlocks = ['.header-band .site-header', '.hero-text', '.hero'].map((q) => document.querySelector(q)).filter(Boolean);
  const EASE = () => Math.min(260, innerHeight * 0.35); // blend distance
  const INSET = 48; // visible edges sit inside the 40px spring room plus half the slant
  const rgb = (c) => (c.match(/[\d.]+/g) ?? [255, 255, 255]).slice(0, 3).map(Number);
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(', ')})`; };
  const weight = (dist) => (dist <= 0 ? 1 : dist >= EASE() ? 0 : (1 - dist / EASE()) ** 2 * (3 - 2 * (1 - dist / EASE())));
  const opaque = (c) => c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c);

  // Colour at the top of the screen, from the blocks' resting positions (not animations).
  const topColour = () => (intro < 1 ? mix(pageColour, topColourAtRest(), intro) : topColourAtRest());
  const topColourAtRest = () => {
    if (scrollY <= 0) return startColour;
    let best = null, dist = Infinity;
    for (const b of topBlocks) {
      const c = getComputedStyle(b).backgroundColor;
      if (!opaque(c)) continue;
      const r = b.getBoundingClientRect();
      const visibleTop = r.top + (b.matches('.site-header') ? 0 : INSET);
      const visibleBottom = r.bottom - INSET;
      if (visibleTop <= 0 && visibleBottom > 0) return c;           // block covers the top edge
      if (visibleBottom <= 0 && -visibleBottom < dist) { dist = -visibleBottom; best = c; }
    }
    return best ? mix(pageColour, best, weight(dist)) : pageColour;
  };

  let queued = false;
  const update = () => {
    queued = false;
    const toFooter = footer.getBoundingClientRect().top + INSET - innerHeight;
    const colour = mix(topColour(), footerColour, weight(toFooter));
    body.style.backgroundColor = colour;
    root.style.backgroundColor = colour;
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  addEventListener('load', queue);
  update();

  if (intro < 1) {
    // Start together with the entrances (main.js dispatches 'entrances-start').
    document.addEventListener('entrances-start', () => {
      // Two steps that never overlap, so no edge can show between two blues: first the block
      // springs and fades in while the browser bar stays white (Safari draws a soft white haze
      // over its top), then the bar colour eases to the block's colour, melting the haze away.
      // (Changing both at once can't stay in sync: Safari animates its bar colour with a lag.)
      const t0 = performance.now(), FADE = 450, TINT = 500;
      const ease = (x) => { const u = Math.min(1, Math.max(0, x)); return u * u * (3 - 2 * u); }; // ease in-out
      const step = (now) => {
        const ms = now - t0;
        const t = ms / (FADE + TINT);
        fading.forEach((el) => { el.style.opacity = String(ease(ms / FADE)); });
        intro = ease((ms - FADE) / TINT);
        update();
        if (t < 1) requestAnimationFrame(step);
        else fading.forEach((el) => { el.style.opacity = ''; });
      };
      requestAnimationFrame(step);
    }, { once: true });
    setTimeout(() => { intro = 1; fading.forEach((el) => { el.style.opacity = ''; }); queue(); }, 4000); // safety net
  }
})();

// Lightbox: any element with data-youtube or data-image opens in the shared <dialog>.
const viewer = document.querySelector('.viewer');
const stage = viewer?.querySelector('.viewer-stage');

function openLightbox(trigger) {
  const { youtube, image } = trigger.dataset;
  stage.replaceChildren();
  stage.classList.toggle('is-vertical', 'vertical' in trigger.dataset);
  if (youtube && 'noEmbed' in document.documentElement.dataset) {
    // Where embedding isn't allowed (the artifact preview), show the video's thumbnail in
    // the player frame with a play button that opens it on YouTube.
    const link = document.createElement('a');
    link.className = 'video-preview';
    link.href = `https://www.youtube.com/watch?v=${youtube}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', `${trigger.getAttribute('aria-label') ?? 'Video'} (opens YouTube)`);
    const thumb = trigger.querySelector('img:not(.reel-window)');
    if (thumb) link.style.setProperty('--thumb', `url("${thumb.currentSrc || thumb.src}")`);
    link.innerHTML = '<span class="video-preview-play" aria-hidden="true"></span><span class="video-preview-note">Watch on YouTube</span>';
    stage.append(link);
  } else if (youtube) {
    // youtube-nocookie: no tracking cookies until the visitor actually plays the video.
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&modestbranding=1`;
    frame.title = trigger.getAttribute('aria-label') ?? 'Video';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    stage.append(frame);
  } else if (image) {
    const img = new Image();
    img.src = image;
    img.alt = trigger.querySelector('img')?.alt || trigger.getAttribute('aria-label')?.replace(/^View image: /, '') || '';
    stage.append(img);
  }
  viewer.showModal();
}

if (viewer) {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-youtube], [data-image]');
    if (trigger) openLightbox(trigger);
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  // Clicking the backdrop (the dialog itself, outside the stage) closes it.
  viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
  // Stop playback when closed.
  viewer.addEventListener('close', () => stage.replaceChildren());
}

// Testimonials carousel: native scroll-snap with a "next" arrow (wraps around) and arrow keys.
for (const carousel of document.querySelectorAll('.carousel')) {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...track.children];
  const dots = [...carousel.querySelectorAll('.carousel-dots button')];
  let current = 0;

  const goTo = (i) => {
    const index = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };
  const sync = () => {
    current = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === current)));
    slides.forEach((s, i) => s.inert = i !== current);
  };

  carousel.querySelectorAll('.carousel-btn').forEach((b) =>
    b.addEventListener('click', () => goTo(current + Number(b.dataset.dir))));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  });
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  sync();
}

// Reveal sections as they scroll into view.
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}


// Color blocks spring in with a bend, like the bars in the teaser.
// A block's leading edge travels in a straight line from the far side to its resting
// place, driven by a spring: it overshoots, springs back and settles. While it moves the
// edge bows into one soft curve, the middle leading and the ends dragging, deeper the
// faster it goes, so the bow flips as the edge springs back. A small starting tilt
// straightens out on the way in. Blocks have 40px of hidden extra room (--spring in
// styles.css) so the overshoot can show; panels and tiles also slide a little themselves.

/* bend-core start */
// Clip polygon for a block whose `side` edge sits `d(u)` px inward from that side.
// u runs 0..1 along the edge (left to right, or top to bottom).
function bendPolygon(W, H, side, d, steps = 32) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps, o = d(u);
    if (side === 'top') pts.push([u * W, o]);
    else if (side === 'bottom') pts.push([u * W, H - o]);
    else if (side === 'left') pts.push([o, u * H]);
    else pts.push([W - o, u * H]);
  }
  if (side === 'top') pts.push([W, H], [0, H]);
  else if (side === 'bottom') pts.reverse(), pts.unshift([0, 0], [W, 0]);
  else if (side === 'left') pts.push([W, H], [W, 0]);
  else pts.unshift([0, 0]), pts.push([0, H]);
  return pts;
}
/* bend-core end */

(() => {
  // The teaser (button + label) rides in on the orange hero block: it moves with the block's
  // edge, overshoot and all, so it always sits on orange (its window graphic has orange corners).
  const reelColumn = document.querySelector('.hero-reel');

  // main.js takes over from the CSS first-paint hiding (see .js-anim in styles.css).
  const takeOver = () => document.documentElement.classList.remove('js-anim');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { takeOver(); return; }

  // side: the edge that moves in (it starts at the far side, so the block is hidden).
  // rest: that edge's inward offset in px at its two ends, matching styles.css, including
  // the 40px spring room (null = no clip at rest). tilt: starting tilt in degrees.
  // slide: px the whole block travels as well (for blocks without spring room).
  // stiffness: spring strength; higher is quicker.
  // first: starts on the first frame, together with the browser's page fade-in, instead of
  // waiting for the page to load.
  const SPRING = 40;
  const configs = [
    { sel: '.site-header', when: (el) => !!el.closest('.header-band'), side: 'bottom', rest: [SPRING, 16 + SPRING], tilt: 3, stiffness: 190, first: true },
    { sel: '.hero-text', media: '(max-width: 767px)', side: 'bottom', rest: [16 + SPRING, SPRING], tilt: 4, stiffness: 150 },
    { sel: '.hero-orange', media: '(min-width: 768px)', side: 'left', rest: [16 + SPRING, SPRING], tilt: -6, stiffness: 150, leadsReel: true },
    { sel: '.site-footer', side: 'top', rest: [20 + SPRING, SPRING], tilt: -3, stiffness: 170 },
    { sel: '.panel', side: 'right', rest: null, tilt: 5, slide: 36, stiffness: 170 },
    { sel: '.skill-tile', side: 'top', rest: null, tilt: -6, slide: 28, stiffness: 220, stagger: 50 },
  ];

  const blocks = configs.flatMap((c) => {
    if (c.media && !matchMedia(c.media).matches) return [];
    return [...document.querySelectorAll(c.sel)].map((el, i) => ({
      ...c, el, delay: (c.delay ?? 0) + (c.stagger ?? 0) * i,
      trigger: el.closest('.carousel') ?? el, start: null, done: false, p: 0, v: 0,
    }));
  });
  if (!blocks.length) { takeOver(); return; }

  const armed = (b) => !b.when || b.when(b.el);
  const measure = (b) => {
    const { width: W, height: H } = b.el.getBoundingClientRect();
    const vertical = b.side === 'left' || b.side === 'right';
    const len = vertical ? H : W;      // length of the moving edge
    const depth = vertical ? W : H;    // distance it travels
    const bow = Math.min(len * 0.1, 50, depth * 0.5);
    const room = b.rest ? Math.min(b.rest[0], b.rest[1]) : 0; // how far the edge may overshoot
    const tiltPx = Math.tan((b.tilt * Math.PI) / 180) * len;
    const slack = bow * 1.6 + Math.abs(tiltPx) / 2 + 4;
    b.m = { W, H, bow, tiltPx, from: depth + slack, slack, room };
  };
  // Direction the block travels in, as a unit vector (the moving edge leads).
  const dirOf = (side) => ({ top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] }[side]);
  const draw = (b, p, bend) => {
    const { W, H, bow, tiltPx, from, slack, room } = b.m;
    const rest = (u) => (b.rest ? b.rest[0] + (b.rest[1] - b.rest[0]) * u : -slack);
    const q = Math.min(p, 1);
    const base = (u) => from + (rest(u) - from) * q       // travel
      + tiltPx * Math.max(0, 1 - p) * (u - 0.5)           // tilt that straightens on the way in; never reverses past rest
      - bow * bend * Math.sin(Math.PI * u);               // one bow: middle leads when bend > 0
    // Past the resting place (p > 1) the edge runs into the spring room. The overshoot is
    // eased and capped so no part of the edge (tilt and bow included) leaves that room,
    // which would cut a notch into it.
    let over = 0;
    if (p > 1 && room) {
      let lowest = Infinity;
      for (let i = 0; i <= 16; i++) lowest = Math.min(lowest, base(i / 16));
      const cap = Math.max(0, lowest - 2);
      if (cap > 0) over = cap * Math.tanh(((p - 1) * (from - rest(0.5))) / cap);
    }
    const d = (u) => base(u) - over;
    if (b.leadsReel && b.side === 'left' && reelColumn) {
      // How far the edge is from its resting place, at mid-height (without the bow).
      const shift = (from - rest(0.5)) * (1 - q) - over;
      reelColumn.style.transform = `translateX(${shift.toFixed(1)}px)`;
    }
    const pts = bendPolygon(W, H, b.side, d);
    b.el.style.clipPath = `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
    if (b.slide) {
      const [dx, dy] = dirOf(b.side);
      const k = b.slide * (1 - p); // behind at the start, a few px past at the overshoot
      b.el.style.transform = `translate(${(-dx * k).toFixed(1)}px, ${(-dy * k).toFixed(1)}px)`;
    }
  };
  const hide = (b) => { measure(b); draw(b, 0, 0); };
  const finish = (b) => { b.done = true; b.el.style.clipPath = ''; b.el.style.transform = ''; if (b.leadsReel && reelColumn) reelColumn.style.transform = ''; };
  blocks.forEach((b) => { if (armed(b)) hide(b); else { b.done = true; b.wasOff = true; } });
  takeOver();

  // A damped spring pulls the edge from 0 (hidden) to 1 (resting), overshooting about
  // 18% and springing back once more. The bend follows the edge's speed.
  const ZETA = 0.46;
  let running = false, last = 0;
  const tick = (now) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    running = false;
    for (const b of blocks) {
      if (b.start === null || b.done) continue;
      running = true;
      if (now < b.start) continue;
      const K = b.stiffness, D = 2 * ZETA * Math.sqrt(K);
      for (let k = 0; k < 6; k++) { // substeps keep the spring stable at low frame rates
        const h = Math.min(dt, 0.04) / 6;
        b.v += (K * (1 - b.p) - D * b.v) * h;
        b.p += b.v * h;
      }
      if (Math.abs(1 - b.p) < 0.002 && Math.abs(b.v) < 0.02) { finish(b); continue; }
      const bend = Math.max(-1.2, Math.min(1.2, b.v / (0.55 * Math.sqrt(K))));
      draw(b, b.p, bend);
    }
    if (running) requestAnimationFrame(tick);
    else last = 0;
  };
  const play = (b) => {
    if (b.start !== null || !armed(b)) return;
    measure(b);
    b.start = performance.now() + b.delay;
    b.p = 0; b.v = 0;
    if (!running) { running = true; requestAnimationFrame(tick); }
    // Safety net: if frames are throttled, never leave a block hidden.
    const started = b.start;
    setTimeout(() => { if (b.start === started && !b.done) finish(b); }, b.delay + 2500);
  };

  // Start blocks as they scroll into view. This checks positions directly: an
  // IntersectionObserver would never fire, because a hidden block is clipped to nothing.
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    const seen = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    return r.height > 0 && seen >= Math.min(r.height * 0.6, innerHeight * 0.12);
  };
  // Blocks that already sprang in bounce again when they come back into view: the
  // spring gets a kick from its resting place, a little harder on a fast scroll.
  const offScreen = (el) => { const r = el.getBoundingClientRect(); return r.bottom < 0 || r.top > innerHeight; };
  let lastY = scrollY, lastT = performance.now(), scrollSpeed = 0;
  const kick = (b) => {
    measure(b);
    const strength = Math.min(1, Math.max(0.5, scrollSpeed / 2500)); // px/s -> 0.5..1
    b.p = 1; b.v = 0.3 * Math.sqrt(b.stiffness) * strength;
    b.done = false; b.away = false; b.start = performance.now();
    if (!running) { running = true; requestAnimationFrame(tick); }
    const started = b.start;
    setTimeout(() => { if (b.start === started && !b.done) finish(b); }, 2500);
  };
  let queued = false;
  const check = () => {
    queued = false;
    const now = performance.now();
    scrollSpeed = Math.abs(scrollY - lastY) / Math.max(0.016, (now - lastT) / 1000);
    lastY = scrollY; lastT = now;
    blocks.forEach((b) => {
      if (b.start === null && !b.done) { if (inView(b.trigger)) play(b); return; }
      if (!b.done || !armed(b)) return;
      if (offScreen(b.trigger)) b.away = true;
      else if (b.away && inView(b.trigger)) kick(b);
    });
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
  // Hold everything until the page has loaded (fonts, images; at most 1.5 s), then a
  // short beat, so the first springs don't stutter while the page is still busy.
  const loaded = new Promise((r) => {
    if (document.readyState === 'complete') r(); else addEventListener('load', r, { once: true });
    setTimeout(r, 1500);
  });
  requestAnimationFrame(() => blocks.filter((b) => b.first).forEach(play));
  loaded
    .then(() => Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 500))]))
    .then(() => new Promise((r) => setTimeout(r, 250)))
    .then(() => {
      document.dispatchEvent(new Event('entrances-start')); // the top colour fades in now
      addEventListener('scroll', queue, { passive: true });
      requestAnimationFrame(check);
    });

  // Plucked strings: the horizontal colored edges act like strings, with a "finger"
  // 2% from the top and 2% from the bottom of the screen. When an edge scrolls past a
  // finger it gets plucked: bent away from its motion, then released to vibrate and fade.
  // Faster scrolling plucks harder. Each edge's resting shape matches styles.css
  // (R = the hidden spring room); `edgeAt` says where the edge sits in the element.
  const R = SPRING;
  const sag = (u) => Math.sin(Math.PI * u);
  const edgeY = (W, y, b) => [...Array(25)].map((_, i) => { const u = i / 24; return [u * W, y(u) + b * sag(u)]; });
  const strings = [
    { sel: '.site-header', when: (el) => !!el.closest('.header-band'), edgeAt: (H) => H - R - 8,
      shape: (W, H, b) => [[0, 0], [W, 0], ...edgeY(W, (u) => H - R - 16 * u, b).reverse()] },
    { sel: '.hero', part: 'top', edgeAt: () => R + 8,
      shape: (W, H, b) => [...edgeY(W, (u) => R + 16 * (1 - u), b), [W, H - R - 16], [0, H - R]] },
    { sel: '.hero', part: 'bottom', edgeAt: (H) => H - R - 8,
      shape: (W, H, b) => [[0, R + 16], [W, R], ...edgeY(W, (u) => H - R - 16 * u, b).reverse()] },
    { sel: '.hero-text', media: '(max-width: 767px)', edgeAt: (H) => H - R - 8,
      shape: (W, H, b) => [[0, 0], [W, 0], ...edgeY(W, (u) => H - R - 16 * (1 - u), b).reverse()] },
    { sel: '.site-footer', edgeAt: () => R + 10,
      shape: (W, H, b) => [...edgeY(W, (u) => R + 20 * (1 - u), b), [W, H], [0, H]] },
  ].flatMap((c) => {
    if (c.media && !matchMedia(c.media).matches) return [];
    return [...document.querySelectorAll(c.sel)].map((el) => ({
      ...c, el, entrance: blocks.find((b) => b.el === el), x: 0, v: 0, lastY: null, live: false,
    }));
  });
  // The hero has two strings on one element; draw both edges from one shape when both move.
  // The hero's bottom slant differs per layout (styles.css): on desktop it's higher on the
  // left, on phones higher on the right. The plucked shape must match or the edge flips.
  const phone = matchMedia('(max-width: 767px)');
  const heroBottomY = (H) => (u) => H - R - 16 * (phone.matches ? u : 1 - u);
  strings.filter((l) => l.sel === '.hero' && l.part === 'bottom').forEach((l) => {
    l.shape = (W, H, b) => [[0, R + 16], [W, R], ...edgeY(W, heroBottomY(H), b).reverse()];
  });
  const heroTop = strings.find((l) => l.sel === '.hero' && l.part === 'top');
  const heroBottom = strings.find((l) => l.sel === '.hero' && l.part === 'bottom');
  if (heroTop && heroBottom) {
    const both = (W, H) => [...edgeY(W, (u) => R + 16 * (1 - u), heroTop.x), ...edgeY(W, heroBottomY(H), heroBottom.x).reverse()];
    heroTop.shape = heroBottom.shape = (W, H) => both(W, H);
  }
  const AMP = 20;     // px at a full-strength pluck
  const K = 420;      // string stiffness: about 3 wobbles a second
  const DAMP = 2 * 0.11 * Math.sqrt(K);
  let stringsRunning = false, stringsLast = 0, sY = scrollY, sT = performance.now();

  const drawString = (l) => {
    const W = l.el.offsetWidth, H = l.el.offsetHeight;
    l.el.style.clipPath = `polygon(${l.shape(W, H, l.x).map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
  };
  const stringsTick = (now) => {
    const dt = Math.min(0.04, (now - (stringsLast || now)) / 1000);
    stringsLast = now;
    let any = false;
    for (const l of strings) {
      if (!l.live) continue;
      for (let k = 0; k < 4; k++) {
        const h = dt / 4;
        l.v += (-K * l.x - DAMP * l.v) * h;
        l.x += l.v * h;
      }
      if (Math.abs(l.x) < 0.15 && Math.abs(l.v) < 3) { l.x = l.v = 0; l.live = false; }
      else any = true;
    }
    // Redraw each element once (the hero carries two strings).
    for (const el of new Set(strings.map((l) => l.el))) {
      const mine = strings.filter((l) => l.el === el);
      if (mine.some((l) => l.entrance && !l.entrance.done)) continue;
      if (mine.some((l) => l.live)) drawString(mine[0]);
      else if (mine.some((l) => l.drawn)) el.style.clipPath = '';
      mine.forEach((l) => { l.drawn = mine.some((m) => m.live); });
    }
    if (any) requestAnimationFrame(stringsTick);
    else { stringsRunning = false; stringsLast = 0; }
  };
  const pluck = (l, dir, speed) => {
    if (l.entrance && !l.entrance.done) return;
    if (l.when && !l.when(l.el)) return;
    const strength = Math.min(1, Math.max(0.35, speed / 1800));
    // The finger holds the string back against its motion, then lets go.
    l.x = -dir * AMP * strength; l.v = 0; l.live = true;
    if (!stringsRunning) { stringsRunning = true; requestAnimationFrame(stringsTick); }
  };
  addEventListener('scroll', () => {
    const now = performance.now();
    const speed = Math.abs(scrollY - sY) / Math.max(0.008, (now - sT) / 1000);
    sY = scrollY; sT = now;
    const fingers = [innerHeight * 0.02, innerHeight * 0.98];
    for (const l of strings) {
      const r = l.el.getBoundingClientRect();
      const y = r.top + l.edgeAt(r.height);
      if (l.lastY !== null) {
        for (const f of fingers) {
          if ((l.lastY - f) * (y - f) < 0) pluck(l, Math.sign(y - l.lastY), speed); // crossed a finger
        }
      }
      l.lastY = y;
    }
  }, { passive: true });

  // Single-page artifact: the shared header band replays when a subpage is opened from
  // the home page, and blocks on a newly shown route start when they are on screen.
  addEventListener('hashchange', () => requestAnimationFrame(() => blocks.forEach((b) => {
    if (b.when) {
      const on = armed(b);
      if (on && b.wasOff) { b.start = null; b.done = false; hide(b); }
      b.wasOff = !on;
      if (!on) { b.el.style.clipPath = ''; return; }
    }
    if (b.start === null && inView(b.trigger)) play(b);
  })));
  addEventListener('resize', () => { blocks.forEach((b) => b.start === null && !b.done && hide(b)); queue(); });
})();

// Variable-font titles. Titles have two halves in different weights (Gabarito is a variable
// font, 400–900). Hovering a title eases the halves into each other's weight (styles.css), and
// scrolling a title past 15% or 85% of the screen gives it one gentle eased pulse toward that.
(() => {
  const titles = [...document.querySelectorAll('.section-title, .page-title, .eyebrow, .hero-line-1, .hero-line-2')];
  for (const el of titles) {
    // Wrap loose text into spans so each half can be styled on its own.
    for (const n of [...el.childNodes]) {
      if (n.nodeType === 3 && n.textContent.trim()) { const s = document.createElement('span'); s.textContent = n.textContent; n.replaceWith(s); }
    }
    for (const c of el.children) {
      if (c.tagName === 'B' || c.tagName === 'SPAN') c.classList.add(parseFloat(getComputedStyle(c).fontWeight) >= 700 ? 'tw-bold' : 'tw-light');
    }
    el.classList.add('swap-title');
  }
  if (!titles.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const last = new Map();
  addEventListener('scroll', () => {
    const fingers = [innerHeight * 0.15, innerHeight * 0.85];
    for (const el of titles) {
      const r = el.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const prev = last.get(el);
      last.set(el, y);
      if (prev === undefined || el.classList.contains('is-pulse') || el.matches(':hover')) continue;
      if (fingers.some((f) => (prev - f) * (y - f) < 0)) {
        el.classList.add('is-pulse');
        setTimeout(() => el.classList.remove('is-pulse'), 380); // ease in, then ease back out
      }
    }
  }, { passive: true });
})();
