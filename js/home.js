// Главная страница: первый экран и «Как работаем»
(function () {
  var $$ = Site.$$;

  // Первый экран: --p от 0 до 1 по мере прокрутки (картинка приближается и темнеет)
  var hero = document.querySelector('.hero');
  Site.onScroll(function () {
    hero.style.setProperty('--p', Math.min(1, Math.max(0, scrollY / hero.offsetHeight)).toFixed(3));
  });

  // Шаги раскрываются по одному, когда блок поднимается по экрану, и закрываются при прокрутке вверх
  var steps = $$('.st');
  var last = -2;
  Site.onScroll(function () {
    var top = document.querySelector('.acc').getBoundingClientRect().top;
    var i = Math.max(-1, Math.min(steps.length - 1, Math.floor((innerHeight * .85 - top) / 120)));
    if (i === last) return;
    last = i;
    steps.forEach(function (e, k) { e.classList.toggle('on', k <= i); });
  });

  // Нажатие на заголовок: свернуть или развернуть шаг вручную
  $$('.st .sh').forEach(function (b) {
    b.onclick = function () {
      var st = b.parentNode;
      st.classList.toggle('c');
      if (!st.classList.contains('c')) st.classList.add('on');
    };
  });
})();
