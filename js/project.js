// Страница объекта: лёгкий параллакс фото и просмотр на весь экран со свайпом
(function () {
  var $$ = Site.$$;
  var gis = $$('.gi');
  var items = $$('.gi, .mi:not([data-clone])'); // всё, что открывается на весь экран

  // Параллакс: фото в галерее сдвигаются чуть медленнее страницы
  if (!Site.reduceMotion) {
    Site.onScroll(function () {
      var H = innerHeight;
      gis.forEach(function (g) {
        var r = g.getBoundingClientRect();
        if (r.bottom < -50 || r.top > H + 50) return;
        var d = (r.top + r.height / 2 - H / 2) / H;
        var y = Math.max(-.07, Math.min(.07, -d * .1)) * r.height;
        g.firstElementChild.style.setProperty('--y', y.toFixed(1) + 'px');
      });
    });
  }

  // Просмотр на весь экран. Первый слайд: «до/после», дальше обычные фото
  var lb = document.createElement('div');
  lb.id = 'lb';
  lb.innerHTML = '<div class="lbt"></div>' +
    '<button class="lbx" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<button class="lbp" aria-label="Prev">' + Site.IC.right + '</button>' +
    '<button class="lbn" aria-label="Next">' + Site.IC.right + '</button><div class="lbc"></div>';
  document.body.appendChild(lb);
  var track = lb.querySelector('.lbt');
  var count = 0, cur = 0;

  function go(i) {
    cur = Math.max(0, Math.min(count - 1, i));
    track.style.transform = 'translateX(' + (-cur * 100) + '%)';
    lb.querySelector('.lbc').textContent = (cur + 1) + ' / ' + count;
    lb.querySelector('.lbp').style.visibility = cur ? 'visible' : 'hidden';
    lb.querySelector('.lbn').style.visibility = cur < count - 1 ? 'visible' : 'hidden';
  }
  function open(i) {
    var html = '';
    var main = document.querySelector('.project [data-ba]');
    if (main) html += '<div class="lbs">' + main.outerHTML.replace(/ loading="lazy"/g, '') + '</div>';
    items.forEach(function (g) {
      html += '<div class="lbs">' + g.firstElementChild.outerHTML.replace(/ loading="lazy"/g, '') + '</div>';
    });
    track.innerHTML = html;
    count = track.children.length;
    Site.bindBA(track, true);
    Site.setLang(Site.lang(), track);
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
    track.style.transition = 'none';
    go(i);
    void track.offsetWidth;
    track.style.transition = '';
  }
  function close() { lb.classList.remove('on'); document.body.style.overflow = ''; }

  var firstBa = function () { return document.querySelector('.project [data-ba]') ? 1 : 0; };
  $$('.gi, .mi').forEach(function (g) {
    g.addEventListener('click', function () {
      if (Date.now() - Site.dragged < 300) return; // это было перетаскивание, а не нажатие
      var k = items.indexOf(g);
      if (k < 0) { // копия фото из бесконечной ленты: берём оригинал с тем же номером
        var all = Array.prototype.slice.call(g.parentNode.children);
        k = all.indexOf(g) % (all.length / 2);
      }
      open(k + firstBa());
    });
  });
  lb.querySelector('.lbx').onclick = close;
  lb.querySelector('.lbp').onclick = function () { go(cur - 1); };
  lb.querySelector('.lbn').onclick = function () { go(cur + 1); };
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(cur - 1);
    if (e.key === 'ArrowRight') go(cur + 1);
  });

  // Свайп пальцем или мышкой
  var startX = null, dx = 0;
  lb.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    startX = e.clientX; dx = 0; track.style.transition = 'none';
  });
  lb.addEventListener('pointermove', function (e) {
    if (startX === null) return;
    dx = e.clientX - startX;
    track.style.transform = 'translateX(calc(' + (-cur * 100) + '% + ' + dx + 'px))';
  });
  function end() {
    if (startX === null) return;
    startX = null; track.style.transition = '';
    go(dx < -50 ? cur + 1 : dx > 50 ? cur - 1 : cur);
  }
  lb.addEventListener('pointerup', end);
  lb.addEventListener('pointercancel', end);
})();
