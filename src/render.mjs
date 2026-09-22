// Renders the whole page from content/site.json.
// No dependencies – Cloudflare Pages runs this with plain Node.

const esc = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Lets long compound Faroese words break nicely in the big headline.
const softHyphens = (s = '') => esc(s).replace(/timburarbeiði/gi, (m) => m.slice(0, 6) + '&shy;' + m.slice(6));

export function render(d, css) {
  const c = d.contact;
  const tel = `tel:${c.phone_link}`;
  const mail = `mailto:${c.email}`;

  const slides = d.hero.slides
    .map(
      (s, i) =>
        `      <figure class="slide${i === 0 ? ' is-active' : ''}" data-caption="${esc(s.caption)}"><img src="${esc(s.image)}" alt="" ${i === 0 ? '' : 'loading="lazy" '}decoding="async"></figure>`
    )
    .join('\n');

  const dots = d.hero.slides
    .map((s, i) => `          <button type="button" aria-label="Mynd ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}></button>`)
    .join('\n');

  const services = d.services.items
    .map(
      (s) => `        <li class="svc${s.wide ? ' svc-wide' : ''}">
          <span class="svc-tag">${esc(s.tag)}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
          <ul class="chips">
${(s.chips || []).map((ch) => `            <li>${esc(ch)}</li>`).join('\n')}
          </ul>
        </li>`
    )
    .join('\n');

  const steps = d.blowerdoor.steps
    .map((s) => `          <li><b>${esc(s.title)}</b><span>${esc(s.text)}</span></li>`)
    .join('\n');

  const shots = d.work.photos
    .map(
      (p) =>
        `        <figure class="shot"><div class="img"><img src="${esc(p.image)}" alt="${esc(p.alt)}" loading="lazy" decoding="async"></div><figcaption>${esc(p.caption)} <span>${esc(p.place)}</span></figcaption></figure>`
    )
    .join('\n');

  const about = d.about.paragraphs.map((p) => `          <p>${esc(p)}</p>`).join('\n');

  const topbar = d.topbar.show
    ? `<div class="topbar">
  <div class="wrap topbar-in">
    <span><b>${esc(d.topbar.strong)}</b> ${esc(d.topbar.text)}</span>
    <a href="${esc(d.topbar.link_url)}" target="_blank" rel="noopener">${esc(d.topbar.link_text)}</a>
  </div>
</div>

`
    : '';

  return `<!DOCTYPE html>
<html lang="fo">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.meta.title)}</title>
<meta name="description" content="${esc(d.meta.description)}">
<meta name="color-scheme" content="light">
<meta property="og:title" content="${esc(d.meta.title)}">
<meta property="og:description" content="${esc(d.meta.description)}">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,500..800&family=Public+Sans:wght@400;500;600&display=swap">
<style>
${css}
</style>
</head>
<body>

<a class="skip" href="#main">Hopp til innihald</a>

${topbar}<header>
  <div class="wrap nav">
    <a class="logo" href="#" aria-label="M.B. Overgaard – heim">
      <b>M.B.Overgaard</b>
      <span>bygningssnikkari</span>
    </a>
    <nav aria-label="Høvuðsvalmynd">
      <ul class="links">
        <li><a href="#taenastur">Tænastur</a></li>
        <li><a href="#blowerdoor">Blower Door</a></li>
        <li><a href="#verkaetlanir">Verkætlanir</a></li>
        <li><a href="#umokkum">Um okkum</a></li>
        <li><a href="#samband">Samband</a></li>
      </ul>
    </nav>
    <a class="btn" href="${tel}">Ring ${esc(c.phone_display)}</a>
  </div>
</header>

<main id="main">

  <section class="hero" id="slides">
    <div class="slides" aria-hidden="true">
${slides}
    </div>

    <div class="wrap hero-inner">
      <p class="eyebrow">${esc(d.hero.eyebrow)}</p>
      <h1>${softHyphens(d.hero.heading)}</h1>
      <p class="lede">${esc(d.hero.text)}</p>
      <div class="cta-row">
        <a class="btn big" href="#samband">${esc(d.hero.button)}</a>
      </div>
      <div class="hero-meta">
        <span class="cap" id="cap" aria-live="polite"><span id="cap-text">${esc(d.hero.slides[0].caption)}</span> <small id="cap-count">1 / ${d.hero.slides.length}</small></span>
        <div class="dots" aria-label="Vel mynd">
${dots}
        </div>
      </div>
    </div>
  </section>

  <section class="services" id="taenastur">
    <div class="wrap">
      <div class="svc-head">
        <h2>${esc(d.services.heading)}</h2>
        <p>${esc(d.services.text)}</p>
      </div>

      <ul class="svc-grid">
${services}
      </ul>
    </div>
  </section>

  <section class="tight" id="blowerdoor">
    <div class="wrap tight-grid">
      <div class="tight-copy">
        <p class="eyebrow">${esc(d.blowerdoor.eyebrow)}</p>
        <h2>${esc(d.blowerdoor.heading)}</h2>
        <p class="lede">${esc(d.blowerdoor.text)}</p>
        <ol class="steps">
${steps}
        </ol>
        <a class="btn" href="#samband">${esc(d.blowerdoor.button)}</a>
      </div>
      <div class="tight-art" aria-hidden="true">
        <!-- Gable house, fan in the door, air pulled in through leaks -->
        <svg viewBox="0 0 440 340" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 300 H420"/>
          <path d="M100 300 V150 L220 60 L340 150 V300"/>
          <path d="M86 160 L220 48 L354 160"/>
          <path d="M120 136 l-3 -8 M138 122 l-2 -9 M156 108 l-4 -8 M174 94 l-2 -9 M192 80 l-4 -8 M210 66 l-2 -9 M246 66 l3 -9 M264 80 l3 -8 M282 94 l2 -9 M300 108 l4 -8 M318 122 l2 -9 M336 136 l3 -8"/>
          <path d="M100 170 H340 M100 190 H340 M100 210 H340 M100 230 H340 M100 250 H340 M100 270 H340 M100 290 H340" stroke-width="1" opacity=".4"/>
          <rect x="130" y="180" width="44" height="52" fill="var(--paper)"/>
          <path d="M152 180 V232 M130 206 H174"/>
          <rect x="266" y="180" width="44" height="52" fill="var(--paper)"/>
          <path d="M288 180 V232 M266 206 H310"/>
          <rect x="204" y="104" width="32" height="40" fill="var(--paper)"/>
          <path d="M220 104 V144"/>
          <path d="M290 112 V84 H306 V125"/>
          <path d="M192 300 V308 H248 V300"/>
          <rect x="200" y="222" width="40" height="78" fill="var(--paper)"/>
          <rect x="203" y="225" width="34" height="72" stroke-dasharray="3 3" opacity=".7"/>
          <circle cx="220" cy="256" r="14"/>
          <!-- fan: six curved blades around a hub -->
          <g stroke-width="1.6">
            <path d="M220 256 C 224 250, 224 246, 220 243" transform="rotate(0 220 256)"/>
            <path d="M220 256 C 224 250, 224 246, 220 243" transform="rotate(60 220 256)"/>
            <path d="M220 256 C 224 250, 224 246, 220 243" transform="rotate(120 220 256)"/>
            <path d="M220 256 C 224 250, 224 246, 220 243" transform="rotate(180 220 256)"/>
            <path d="M220 256 C 224 250, 224 246, 220 243" transform="rotate(240 220 256)"/>
            <path d="M220 256 C 224 250, 224 246, 220 243" transform="rotate(300 220 256)"/>
          </g>
          <circle cx="220" cy="256" r="2.6" fill="currentColor"/>
          <path d="M220 280 V304" stroke="var(--oak)" stroke-width="2"/>
          <path d="M215 298 L220 306 L225 298" stroke="var(--oak)" stroke-width="2"/>
          <g stroke="var(--oak)" stroke-width="1.8">
            <path d="M118 206 H128 M124 202 L129 206 L124 210"/>
            <path d="M322 206 H312 M316 202 L311 206 L316 210"/>
            <path d="M94 168 L108 168 M104 164 L109 168 L104 172"/>
            <path d="M346 168 L332 168 M336 164 L331 168 L336 172"/>
            <path d="M234 92 L224 100 M231 100 L223 101 L224 93"/>
            <path d="M88 292 L106 292 M102 288 L107 292 L102 296"/>
            <path d="M352 292 L334 292 M338 288 L333 292 L338 296"/>
          </g>
          <g transform="translate(40 60)">
            <rect x="0" y="0" width="64" height="40" rx="3" fill="var(--paper)"/>
            <text x="32" y="26" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-size="15" font-weight="700" fill="currentColor" stroke="none">50 Pa</text>
          </g>
        </svg>
      </div>
    </div>
  </section>

  <section class="work" id="verkaetlanir">
    <div class="wrap">
      <div class="work-head">
        <div>
          <p class="eyebrow">${esc(d.work.eyebrow)}</p>
          <h2>${esc(d.work.heading)}</h2>
        </div>
        <a class="btn ghost" href="${esc(c.facebook_url)}" target="_blank" rel="noopener">${esc(d.work.button)}</a>
      </div>
      <div class="track" aria-label="Myndir av arbeiði">
${shots}
      </div>
    </div>
  </section>

  <section class="about" id="umokkum">
    <div class="wrap">
      <div class="about-grid">
        <div>
          <p class="eyebrow">${esc(d.about.eyebrow)}</p>
          <div class="about-id">
            <h2>${esc(d.about.heading)}</h2>
            <img class="portrait" src="${esc(d.about.portrait)}" alt="${esc(d.about.portrait_alt)}" width="140" height="140" loading="lazy" decoding="async">
          </div>
        </div>
        <div class="about-copy">
${about}
        </div>
      </div>
    </div>
  </section>

  <section class="contact" id="samband">
    <div class="wrap">
      <div class="section-head">
        <div>
          <p class="eyebrow">${esc(d.samband.eyebrow)}</p>
          <h2>${esc(d.samband.heading)}</h2>
        </div>
        <p class="lede">${esc(d.samband.text)}</p>
      </div>
      <div class="contact-grid">
        <div class="details">
          <dl class="dl">
            <dt>Telefon</dt>
            <dd class="big"><a href="${tel}">${esc(c.phone_display)}</a></dd>
            <dt>T-postur</dt>
            <dd><a href="${mail}">${esc(c.email)}</a></dd>
            <dt>Bústaður</dt>
            <dd>${esc(c.address_line1)}<br>${esc(c.address_line2)}</dd>
            <dt>Facebook</dt>
            <dd><a href="${esc(c.facebook_url)}" target="_blank" rel="noopener">${esc(c.facebook_label)}</a></dd>
          </dl>
        </div>
        <div class="contact-cta">
          <h3>${esc(d.samband.card_heading)}</h3>
          <p>${esc(d.samband.card_text)}</p>
          <div class="cta-buttons">
            <a class="btn big" href="${tel}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" width="20" height="20"><path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.2 2 2 0 0 1 6 3z"/></svg>
              Ring ${esc(c.phone_display)}
            </a>
            <a class="btn big ghost" href="${mail}?subject=Umb%C3%B8n%20um%20tilbo%C3%B0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" width="20" height="20"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
              ${esc(d.samband.email_button)}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>

<footer>
  <div class="wrap foot">
    <span>M.B. Overgaard Sp/f · Bygningssnikkari · Argir</span>
    <span><a href="${tel}">${esc(c.phone_display)}</a> · <a href="${mail}">${esc(c.email)}</a> · <a href="${esc(c.facebook_url)}" target="_blank" rel="noopener">Facebook</a></span>
  </div>
</footer>

<script>
  // Hero slideshow – crossfades every 4.5s, no auto-advance if reduced motion
  (function () {
    var root = document.getElementById('slides');
    if (!root) return;
    var slides = root.querySelectorAll('.slide');
    var dots = root.querySelectorAll('.dots button');
    var capText = document.getElementById('cap-text');
    var capCount = document.getElementById('cap-count');
    var i = 0, timer = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      if (capText) capText.textContent = slides[i].getAttribute('data-caption') || '';
      if (capCount) capCount.textContent = (i + 1) + ' / ' + slides.length;
    }
    function start() { if (!reduce && slides.length > 1) timer = setInterval(function () { show(i + 1); }, 4500); }
    function stop() { clearInterval(timer); }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { stop(); show(k); start(); }); });
    start();
  })();
</script>

</body>
</html>
`;
}
