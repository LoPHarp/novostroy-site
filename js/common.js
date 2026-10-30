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
  var LANG_BTNS = [['ru', 'RU'], ['ua', 'UA'], ['en', 'EN']]; // порядок и подписи переключателя языков

  // ---------- Язык ----------
  var lang = 'ru';
  try {
    lang = localStorage.getItem('lang') ||
      (/^uk/.test(navigator.language) ? 'ua' : /^ru|^be/.test(navigator.language) ? 'ru' : 'en');
  } catch (e) {}
  if (!LANGS[lang]) lang = 'ru';
  Site.t = function (key) { return (LANGS[lang] && LANGS[lang][key]) || ''; };
  Site.lang = function () { return lang; };
  Site.setLang = function (l, root) {
    if (!root) {
      lang = l;
      try { localStorage.setItem('lang', l); } catch (e) {}
      document.documentElement.lang = l === 'ua' ? 'uk' : l;
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
    '<a class="brand" href="index.html"><span>NOVOSTROY<small>CONSTRUCTION</small></span></a>' +
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
    '</nav><a class="brand" href="index.html"><span>NOVOSTROY<small>CONSTRUCTION</small></span></a></div>' +
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
  var socials = { instagram: ['Instagram', IC.ig], facebook: ['Facebook', IC.fb], telegram: [null, IC.tg] };
  $$('.soc').forEach(function (a) {
    var k = a.dataset.k, url = CFG[k];
    a.innerHTML = socials[k][1] + (socials[k][0] ? '<span>' + socials[k][0] + '</span>' : '<span data-t="tg_label"></span>') + IC.up;
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else a.removeAttribute('href'); // ссылки пока нет
  });

  // Переключатель языков: RU / UA / EN
  var fl = document.querySelector('.fl');
  LANG_BTNS.forEach(function (x) {
    var b = document.createElement('button');
    b.dataset.l = x[0]; b.textContent = x[1]; b.setAttribute('aria-label', x[1]);
    b.onclick = function () { Site.setLang(x[0]); };
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



  // ---------- Смена картинок на первом экране ----------
  var hs = document.querySelector('[data-hs]');
  if (hs && hs.children.length > 1 && !Site.reduceMotion) {
    var hsl = hs.children, hi = 0, htimer = null;
    var next = function () { hsl[hi].classList.remove('on'); hi = (hi + 1) % hsl.length; hsl[hi].classList.add('on'); };
    var hstart = function () { if (!htimer) htimer = setInterval(next, 4500); };
    var hstop = function () { clearInterval(htimer); htimer = null; };
    hstart();
    document.addEventListener('visibilitychange', function () { document.hidden ? hstop() : hstart(); });
  }

  // ---------- Лента фото ----------
  // Сама плывёт справа налево. Пока её держат или листают, стоит; через 2 секунды после последнего касания плывёт дальше.
  Site.dragged = 0;
  $$('[data-mq]').forEach(function (el) {
    var track = el.firstElementChild;
    Array.prototype.slice.call(track.children).forEach(function (c) {
      var k = c.cloneNode(true); k.setAttribute('data-clone', ''); k.setAttribute('aria-hidden', 'true'); track.appendChild(k);
    });
    var visible = false, held = false, pos = 0, last = 0, lastInput = 0, lastSet = -1;
    var touched = function () { lastInput = Date.now(); };
    // Палец на ленте: пока держим, стоит. Просто коснулись или листаем страницу вверх-вниз: сразу плывёт дальше.
    // Две секунды паузы только после настоящей горизонтальной прокрутки (её ловит событие scroll ниже).
    el.addEventListener('touchstart', function () { held = true; }, { passive: true });
    ['touchend', 'touchcancel'].forEach(function (ev) { window.addEventListener(ev, function () { held = false; }, { passive: true }); });
    el.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) touched(); }, { passive: true });
    el.addEventListener('scroll', function () {
      // прокрутку, которую сделали мы сами, не считаем касанием (это и пальцы, и инерция после броска)
      if (Math.abs(el.scrollLeft - lastSet) > 2) touched();
      // бесконечная петля и при ручной прокрутке: дошли до конца копии, перескакиваем на то же место в начале
      var half = track.scrollWidth / 2;
      if (half > 0 && Date.now() - lastInput < 400) {
        if (el.scrollLeft >= half) { el.scrollLeft -= half; pos = el.scrollLeft; lastSet = pos; }
        else if (el.scrollLeft <= 0) { el.scrollLeft += half; pos = el.scrollLeft; lastSet = pos; }
      }
    }, { passive: true });
    // перетаскивание мышкой (на телефоне лента листается пальцем сама)
    var sx = null, sl = 0, moved = 0;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      sx = e.clientX; sl = el.scrollLeft; moved = 0; el.classList.add('drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = sl - dx; touched();
    });
    window.addEventListener('pointerup', function () {
      if (sx === null) return;
      sx = null; el.classList.remove('drag');
      if (moved > 6) Site.dragged = Date.now();
    });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(el);
    } else visible = true;
    var idle = true; // true: сейчас стоим, при следующем запуске берём положение из ленты
    function tick(t) {
      var run = visible && !held && Date.now() - lastInput > 2000;
      if (run) {
        if (idle) { pos = el.scrollLeft; idle = false; }
        else if (last) {
          var half = track.scrollWidth / 2;
          pos += Math.min(60, t - last) * 0.035; // ~35 px в секунду
          if (pos >= half) pos -= half;
          lastSet = pos; el.scrollLeft = pos;
        }
        last = t;
      } else { idle = true; last = 0; }
      requestAnimationFrame(tick);
    }
    if (!Site.reduceMotion) requestAnimationFrame(tick);
  });

  // ---------- Видео ----------
  // Играют без звука по кругу, пока видны на экране; вне экрана стоят (экономим трафик и батарею).
  var videos = $$('video[data-src]');
  if (videos.length) {
    var vo = window.IntersectionObserver ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) v.src = v.dataset.src;
          if (!Site.reduceMotion && !v.dataset.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else v.pause();
      });
    }, { threshold: .35 }) : null;
    videos.forEach(function (v) {
      if (Site.reduceMotion) v.controls = true;
      if (vo) vo.observe(v); else v.src = v.dataset.src;
      // нажатие: поставить на паузу или продолжить
      v.parentNode.addEventListener('click', function () {
        if (v.paused) { v.dataset.paused = ''; v.play(); } else { v.dataset.paused = '1'; v.pause(); }
      });
    });
  }

  // Ссылка на Telegram-канал в конце страницы работ
  $$('a.tgl').forEach(function (a) {
    if (CFG.telegram) { a.href = CFG.telegram; a.target = '_blank'; a.rel = 'noopener'; } else a.removeAttribute('href');
  });

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

  // ---------- Закреплённая кнопка WhatsApp ----------
  // Кнопка одна и ходит за посетителем: на первом экране стоит на месте кнопки героя,
  // при прокрутке уезжает вниз экрана и закрепляется, а в конце страницы «садится» на кнопку блока контактов.
  // Настоящие кнопки (в герое и в контактах) всегда прозрачные: на их месте на экране лежит закреплённая.
  var heroBtn = document.querySelector('.hero .hb');
  var ctaBtn = document.querySelector('#contacts .btn');
  if (heroBtn || ctaBtn) {
    var touch = window.matchMedia('(hover: none)').matches;
    var sb = waEl.firstElementChild;
    var sbSpan = sb.querySelector('span');
    [heroBtn, ctaBtn].forEach(function (b) { if (b) b.style.opacity = 0; });
    var clamp01 = function (x) { return Math.max(0, Math.min(1, x)); };
    var smooth = function (p) { return p * p * (3 - 2 * p); };
    var idle = false; // закреплённая кнопка стоит на своём обычном месте, ничего не считаем

    function resetDock() {
      if (idle) return;
      idle = true;
      sb.style.width = ''; sbSpan.style.paddingLeft = ''; waEl.style.transform = '';
    }

    // Насколько кнопка «пристыкована» к целевой кнопке: 0 = свободно, 1 = точно поверх неё
    function dockTo(target, p) {
      idle = false;
      sb.style.width = '';
      var r = target.getBoundingClientRect();
      var sW = sb.offsetWidth;
      var sCY = waEl.offsetTop + waEl.offsetHeight / 2;
      var sCX = waEl.offsetLeft + waEl.offsetWidth / 2;
      var cY = r.top + r.height / 2, cX = r.left + r.width / 2;
      var gw = (r.width - sW) * p;
      sb.style.width = (sW + gw).toFixed(1) + 'px';
      // надпись плавно уезжает в центр кнопки
      sbSpan.style.paddingLeft = '0px';
      var rg = document.createRange();
      rg.selectNodeContents(sbSpan);
      var tw = rg.getBoundingClientRect().width;
      sbSpan.style.paddingLeft = Math.max(0, (sbSpan.offsetWidth - tw) / 2 * p).toFixed(1) + 'px';
      waEl.style.transform = 'translate(' + ((cX - sCX) * p + (waEl.style.left ? 0 : gw / 2)).toFixed(1) + 'px,' +
        ((cY - sCY) * p).toFixed(1) + 'px)';
    }

    Site.onScroll(function () {
      var heroNear = heroBtn ? scrollY < innerHeight * .12 : false;

      if (touch) {
        // На телефоне кнопку не двигаем (при прокрутке пальцем скрипт не успевает за страницей, и кнопку трясёт):
        // закреплённая плавно гаснет, а на её месте проявляется настоящая кнопка
        var ctaNear = false;
        if (ctaBtn) {
          var rr = ctaBtn.getBoundingClientRect();
          ctaNear = rr.top + rr.height / 2 < innerHeight - 40;
        }
        var hide = heroNear || ctaNear;
        waEl.style.opacity = hide ? 0 : 1;
        waEl.style.pointerEvents = hide ? 'none' : '';
        if (heroBtn) heroBtn.style.opacity = heroNear ? 1 : 0;
        if (ctaBtn) ctaBtn.style.opacity = ctaNear && !heroNear ? 1 : 0;
        return;
      }

      // У верхнего края страницы видна кнопка героя. Стоит прокрутить, она плавно гаснет,
      // а закреплённая плавно появляется внизу справа (без переезда через весь экран)
      if (heroBtn) {
        heroBtn.style.opacity = heroNear ? 1 : 0;
        waEl.style.opacity = heroNear ? 0 : 1;
        waEl.style.pointerEvents = heroNear ? 'none' : '';
        if (heroNear) { resetDock(); return; }
      }
      var target = null, p = 0;
      if (ctaBtn) {
        var r = ctaBtn.getBoundingClientRect();
        if (r.top <= innerHeight + 300) {
          var sCY = waEl.offsetTop + waEl.offsetHeight / 2;
          var pc = smooth(1 - clamp01((r.top + r.height / 2 - sCY) / 260));
          if (pc > p) { target = ctaBtn; p = pc; }
        }
      }
      if (!target || p <= 0) { resetDock(); return; }
      dockTo(target, p);
    });
    // шрифты и картинки меняют размеры блоков: пересчитываем положение после загрузки
    window.addEventListener('load', function () { scrollFns.forEach(function (f) { f(); }); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { scrollFns.forEach(function (f) { f(); }); });
  }

  // ---------- Старт ----------
  Site.setLang(lang);
  if (location.hash === '#contacts') {
    var c = document.getElementById('contacts');
    if (c) setTimeout(function () { c.scrollIntoView(); }, 50);
  }
})();
