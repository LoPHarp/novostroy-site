// Общий скрипт для всех страниц: шапка, подвал, языки, кнопка WhatsApp, слайдеры «до/после»
(function () {
  var CFG = window.SITE_CONFIG;
  var LANGS = window.LANGS;
  var Site = (window.Site = {});
  var page = document.body.dataset.page; // home | works | project
  var hasCta = page !== 'project';       // на страницах объектов нет блока «Обсудим ваш ремонт»
  var digits = CFG.phone.replace(/\D/g, '');

  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  Site.$$ = $$;
  Site.reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Иконки ----------
  function svg(inner, cls, sw) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.7) +
      '" stroke-linecap="round" stroke-linejoin="round"' + (cls ? ' class="' + cls + '"' : '') + '>' + inner + '</svg>';
  }
  var IC = Site.IC = {
    wa: svg('<path d="M3 21l1.6-4.7A9 9 0 1 1 8 19.6L3 21z"/><path d="M9.2 8.6c-.3 3.2 3 6.6 6.3 6.3l.9-1.4-1.9-1-.9.8c-1-.4-2-1.4-2.4-2.4l.8-.9-1-1.9-.8.5z" fill="currentColor" stroke="none"/>', 'wi'),
    waSmall: svg('<path d="M3 21l1.6-4.7A9 9 0 1 1 8 19.6L3 21z"/><path d="M9.2 8.6c-.3 3.2 3 6.6 6.3 6.3l.9-1.4-1.9-1-.9.8c-1-.4-2-1.4-2.4-2.4l.8-.9-1-1.9-.8.5z" fill="currentColor" stroke="none"/>'),
    right: svg('<path d="M4 12h15M13 6l6 6-6 6"/>', 'ar'),
    left: svg('<path d="M20 12H5M11 6l-6 6 6 6"/>', 'ar'),
    leftBig: svg('<path d="M20 12H5M11 6l-6 6 6 6"/>', '', 2),
    rightBig: svg('<path d="M4 12h15M13 6l6 6-6 6"/>', '', 2),
    up: svg('<path d="M7 17L17 7M8 7h9v9"/>', 'ar'),
    phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    ig: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/>'),
    fb: svg('<circle cx="12" cy="12" r="9"/><path d="M11.1 17.5v-6.2m-2.2 0h4.6M11.1 11.3V9.4c0-1.1.7-1.8 1.8-1.8h.9"/>'),
    tg: svg('<path d="M21 4L3 11l6 2 2 6 3-4 5 4L21 4z"/><path d="M9 13l12-9"/>')
  };
  var FLAGS = {
    ru: '<svg viewBox="0 0 30 30"><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#1c57a5"/><rect y="20" width="30" height="10" fill="#d52b1e"/></svg>',
    en: '<svg viewBox="0 0 30 30"><rect width="30" height="30" fill="#1f3a7a"/><path d="M0 0L30 30M30 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0L30 30M30 0L0 30" stroke="#c8102e" stroke-width="2"/><path d="M15 0V30M0 15H30" stroke="#fff" stroke-width="10"/><path d="M15 0V30M0 15H30" stroke="#c8102e" stroke-width="6"/></svg>',
    el: '<svg viewBox="0 0 30 30"><rect width="30" height="30" fill="#fff"/><path d="M5.5 15.5c1.6-2 4-2.2 6-2.7 1.8-.5 3-2.2 5.2-2.4 2.2-.2 3.4-1.8 6.3-4.2l.2 2.2c-1 1.7-1.8 2.8-2.6 4.1-.7 2.8-2.8 4.8-6 5.3-3.6.6-7.5-.2-9.1-2.3z" fill="#d57800"/><path d="M8.5 21.5q6.5 4.8 13 0M10 23.6l-1.8.2M12.3 24.8l-1.4 1.2M15 25.2v1.8M17.7 24.8l1.4 1.2M20 23.6l1.8.2" stroke="#4e7a3a" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>'
  };

  // ---------- Язык ----------
  var lang = 'ru';
  try {
    lang = localStorage.getItem('lang') ||
      (/^el/.test(navigator.language) ? 'el' : /^ru|^uk|^be/.test(navigator.language) ? 'ru' : 'en');
  } catch (e) {}
  Site.t = function (key) { return (LANGS[lang] && LANGS[lang][key]) || ''; };
  Site.lang = function () { return lang; };
  Site.setLang = function (l, root) {
    if (!root) {
      lang = l;
      try { localStorage.setItem('lang', l); } catch (e) {}
      document.documentElement.lang = l;
      var tk = document.body.dataset.title;
      if (tk && LANGS[l][tk]) document.title = LANGS[l][tk];
      $$('.fl button').forEach(function (b) { b.classList.toggle('on', b.dataset.l === l); });
    }
    $$('[data-t]', root).forEach(function (e) {
      var v = LANGS[l][e.getAttribute('data-t')];
      if (v != null) e.textContent = v;
    });
  };

  // ---------- Шапка, блок контактов, подвал ----------
  var contactsHref = hasCta ? '#contacts' : 'works.html#contacts';
  var headerHtml =
    '<header class="site-header"><div class="wrap hd">' +
    '<a class="brand" href="index.html"><img class="lg" src="img/logo-mark.png" width="30" height="38" alt=""><span>NOVOSTROY<small>CONSTRUCTION</small></span></a>' +
    '<nav class="d"><a href="index.html" data-n="home" data-t="nav_home"></a><a href="works.html" data-n="works" data-t="nav_works"></a><a href="' + contactsHref + '" data-t="nav_contacts"></a></nav>' +
    '<div class="fl"></div>' +
    '<button class="burger" aria-label="Menu"><i></i><i></i><i></i></button></div>' +
    '<div class="menu"><a href="index.html" data-t="nav_home"></a><a href="works.html" data-t="nav_works"></a><a href="' + contactsHref + '" data-t="nav_contacts"></a></div></header>';

  var ctaHtml =
    '<section class="cta" id="contacts"><div class="wrap"><h2 data-t="c_h"></h2><p data-t="c_p"></p>' +
    '<a class="btn wal" href="#"></a><a class="ph tl" href="#"></a></div></section>';

  var footerHtml =
    '<footer class="site-footer"><div class="wrap"><div class="ft"><nav>' +
    '<a class="xo wal-link" href="#"></a><a class="xo tl" href="#"></a>' +
    '<a class="soc" data-k="instagram" href="#"></a><a class="soc" data-k="facebook" href="#"></a><a class="soc" data-k="telegram" href="#"></a>' +
    '</nav><a class="brand" href="index.html"><img class="lg" src="img/logo-mark.png" width="30" height="38" alt="" loading="lazy"><span>NOVOSTROY<small>CONSTRUCTION</small></span></a></div>' +
    '<p class="copy" data-t="tg_note"></p></div></footer>';

  function mount(id, html) {
    var ph = document.getElementById(id);
    if (!ph) return null;
    var tpl = document.createElement('template');
    tpl.innerHTML = html;
    var el = tpl.content.firstElementChild;
    ph.replaceWith(el);
    return el;
  }
  mount('site-header', headerHtml);
  if (hasCta) mount('site-cta', ctaHtml);
  mount('site-footer', footerHtml);

  // Закреплённая кнопка WhatsApp
  var waEl = document.createElement('div');
  waEl.className = 'wa';
  waEl.innerHTML = '<a class="btn wal" href="#"></a>';
  document.body.appendChild(waEl);

  // Заполняем кнопки и ссылки
  $$('.wal').forEach(function (a) {
    a.href = 'https://wa.me/' + digits; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = IC.wa + '<span data-t="wa"></span>' + IC.right;
  });
  $$('.wal-link').forEach(function (a) {
    a.href = 'https://wa.me/' + digits; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = IC.waSmall + '<span data-t="wa"></span>' + IC.up;
  });
  $$('a.tl').forEach(function (a) {
    a.href = 'tel:+' + digits;
    a.innerHTML = IC.phone + '<span>' + CFG.phone + '</span>';
  });
  var socials = { instagram: ['Instagram', IC.ig], facebook: ['Facebook', IC.fb], telegram: ['Telegram · МАСТЕР ИЗ ЛИМАССОЛА', IC.tg] };
  $$('.soc').forEach(function (a) {
    var k = a.dataset.k, url = CFG[k];
    a.innerHTML = socials[k][1] + '<span>' + socials[k][0] + '</span>' + IC.up;
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else a.removeAttribute('href'); // ссылки пока нет
  });

  // Флаги и меню
  var fl = document.querySelector('.fl');
  ['ru', 'en', 'el'].forEach(function (l) {
    var b = document.createElement('button');
    b.dataset.l = l; b.setAttribute('aria-label', l); b.innerHTML = FLAGS[l];
    b.onclick = function () { Site.setLang(l); };
    fl.appendChild(b);
  });
  var menu = document.querySelector('.menu');
  document.querySelector('.burger').onclick = function () { menu.classList.toggle('open'); };
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });
  $$('nav.d a[data-n]').forEach(function (a) {
    var on = (page === 'home' && a.dataset.n === 'home') || (page !== 'home' && a.dataset.n === 'works');
    a.classList.toggle('on', on);
  });

  // Номер телефона на компьютере: копируем (звонок на ПК не работает)
  var toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);
  var toastTimer;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.tl');
    if (!a || window.matchMedia('(hover: none)').matches) return;
    e.preventDefault();
    var fallback = function () {
      try {
        var t = document.createElement('textarea');
        t.value = CFG.phone; t.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
      } catch (x) {}
    };
    try { navigator.clipboard.writeText(CFG.phone).catch(fallback); } catch (x) { fallback(); }
    toast.textContent = Site.t('copied') + ': ' + CFG.phone;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('on'); }, 2200);
  });
  // Ссылки соцсетей без адреса не должны ничего делать
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.soc');
    if (a && !a.getAttribute('href')) e.preventDefault();
  });

  // ---------- Слайдер «до / после» ----------
  function setPos(b, v) { b.style.setProperty('--pos', v + '%'); b.querySelector('input').value = v; }

  // Подсказка: слайдер сам качнётся вправо и влево, когда впервые появится на экране
  function hint(b) {
    if (Site.reduceMotion) return;
    var stop = false, t0 = null;
    ['pointerdown', 'input', 'touchstart'].forEach(function (ev) {
      b.addEventListener(ev, function () { stop = true; }, { once: true });
    });
    var sine = function (x) { return .5 - Math.cos(Math.PI * x) / 2; };
    var cubic = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var out = function (x) { return 1 - Math.pow(1 - x, 3); };
    // [куда, сколько мс идти, сколько мс постоять, плавность]
    var steps = [[100, 750, 220, sine], [0, 1100, 220, cubic], [50, 650, 0, out]];
    var seg = [], from = 50, t = 0;
    steps.forEach(function (g) {
      seg.push({ f: from, to: g[0], a: t, b: t + g[1], e: t + g[1] + g[2], fn: g[3] });
      t += g[1] + g[2]; from = g[0];
    });
    function frame(ts) {
      if (stop) return;
      if (t0 === null) t0 = ts;
      var el = ts - t0;
      if (el >= t) { setPos(b, 50); return; }
      var v = 50;
      for (var k = 0; k < seg.length; k++) {
        var g = seg[k];
        if (el < g.e) { v = el < g.b ? g.f + (g.to - g.f) * g.fn((el - g.a) / (g.b - g.a)) : g.to; break; }
      }
      setPos(b, v);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var hintObserver = window.IntersectionObserver ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { hintObserver.unobserve(e.target); hint(e.target); }
    });
  }, { threshold: .7 }) : null;

  Site.bindBA = function (root, noHint) {
    $$('[data-ba]', root).forEach(function (b) {
      var input = b.querySelector('input');
      input.addEventListener('input', function () { b.style.setProperty('--pos', input.value + '%'); });
      b.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      if (!noHint && hintObserver) hintObserver.observe(b);
    });
  };
  Site.bindBA(document);

  // ---------- Появление блоков при прокрутке ----------
  var revealObserver = window.IntersectionObserver ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: .1 }) : null;
  $$('.rvl').forEach(function (e) { if (revealObserver) revealObserver.observe(e); else e.classList.add('in'); });

  // ---------- Один общий обработчик прокрутки (не чаще раза за кадр) ----------
  var scrollFns = [];
  Site.onScroll = function (fn) { scrollFns.push(fn); fn(); };
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; scrollFns.forEach(function (f) { f(); }); });
  }, { passive: true });
  window.addEventListener('resize', function () { scrollFns.forEach(function (f) { f(); }); });

  // ---------- Закреплённая кнопка «переезжает» в блок «Обсудим ваш ремонт» ----------
  var realBtn = document.querySelector('#contacts .btn');
  if (realBtn) {
    realBtn.style.opacity = 0; // вместо неё на экране всегда одна кнопка: закреплённая
    var touch = window.matchMedia('(hover: none)').matches;
    var docked = false, far = false;
    Site.onScroll(function () {
      // На телефоне кнопку не двигаем (при скролле пальцем скрипт не успевает за страницей и кнопку трясёт):
      // закреплённая просто плавно исчезает, а на её месте появляется кнопка из блока
      if (touch) {
        var rr = realBtn.getBoundingClientRect();
        var near = rr.top + rr.height / 2 < innerHeight - 40;
        if (near !== docked) {
          docked = near;
          waEl.style.opacity = near ? 0 : 1;
          waEl.style.pointerEvents = near ? 'none' : '';
          realBtn.style.opacity = near ? 1 : 0;
        }
        return;
      }
      var sb = waEl.firstElementChild;
      var r = realBtn.getBoundingClientRect();
      // пока блок с кнопкой далеко внизу, ничего не пересчитываем: кнопка закреплена чисто стилями
      if (r.top > innerHeight + 300) {
        if (!far) { far = true; sb.style.width = ''; sb.querySelector('span').style.paddingLeft = ''; waEl.style.transform = ''; }
        return;
      }
      far = false;
      sb.style.width = '';
      r = realBtn.getBoundingClientRect();
      var sW = sb.offsetWidth;
      var sCY = waEl.offsetTop + waEl.offsetHeight / 2;
      var sCX = waEl.offsetLeft + waEl.offsetWidth / 2;
      var cY = r.top + r.height / 2, cX = r.left + r.width / 2;
      var p = 1 - Math.max(0, Math.min(1, (cY - sCY) / 260)); // 0 = далеко, 1 = на месте
      p = p * p * (3 - 2 * p);
      var gw = (r.width - sW) * p;
      if (p > 0) sb.style.width = (sW + gw).toFixed(1) + 'px';
      // надпись плавно уезжает в центр кнопки
      var sp = sb.querySelector('span');
      sp.style.paddingLeft = '0px';
      if (p > 0) {
        var rg = document.createRange();
        rg.selectNodeContents(sp);
        var tw = rg.getBoundingClientRect().width;
        sp.style.paddingLeft = Math.max(0, (sp.offsetWidth - tw) / 2 * p).toFixed(1) + 'px';
      }
      waEl.style.transform = 'translate(' + ((cX - sCX) * p + (waEl.style.left ? 0 : gw / 2)).toFixed(1) + 'px,' + ((cY - sCY) * p).toFixed(1) + 'px)';
    });
  }

  // ---------- Старт ----------
  Site.setLang(lang);
  if (location.hash === '#contacts') {
    var c = document.getElementById('contacts');
    if (c) setTimeout(function () { c.scrollIntoView(); }, 50);
  }
})();
