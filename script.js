(function () {
  'use strict';

  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var backdrop = document.getElementById('backdrop');
  var links = document.querySelectorAll('.nav-link');
  var particlesBox = document.getElementById('particles');

  function openMenu() {
    nav.classList.add('open');
    backdrop.classList.add('show');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('lock');
  }

  function closeMenu() {
    nav.classList.remove('open');
    backdrop.classList.remove('show');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('lock');
  }

  burger.addEventListener('click', function () {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1180) {
      closeMenu();
    }
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  function onScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setActive(id) {
    links.forEach(function (link) {
      if (link.getAttribute('data-target') === id) {
        if (!link.classList.contains('active')) {
          link.classList.add('active');
        }
      } else {
        link.classList.remove('active');
      }
    });
  }

  var sections = [];
  links.forEach(function (link) {
    var el = document.getElementById(link.getAttribute('data-target'));
    if (el) {
      sections.push(el);
    }
  });

  function spy() {
    var offset = header.offsetHeight + window.innerHeight * 0.25;
    var current = sections.length ? sections[0].id : 'home';
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= offset) {
        current = sec.id;
      }
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    setActive(current);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        spy();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('load', spy);
  spy();

  function createParticles() {
    if (!particlesBox) {
      return;
    }
    var count = window.innerWidth < 640 ? 14 : 28;
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('span');
      var size = Math.random() * 5 + 2;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.animationDuration = (Math.random() * 10 + 8) + 's';
      dot.style.animationDelay = (Math.random() * 10) + 's';
      particlesBox.appendChild(dot);
    }
  }

  createParticles();
})();
(function () {
  'use strict';

  var revealItems = document.querySelectorAll('.reveal');

  function showItem(el) {
    el.classList.add('in');
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showItem(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealItems.forEach(showItem);
  }

  var counters = document.querySelectorAll('.num[data-count]');

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1800;
    var start = null;

    function step(ts) {
      if (start === null) {
        start = ts;
      }
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  }

  var aboutImg = document.getElementById('aboutImg');

  if (aboutImg) {
    aboutImg.addEventListener('error', function () {
      aboutImg.style.display = 'none';
    });
  }

  var media = document.getElementById('aboutMedia');
  var frame = media ? media.querySelector('.media-frame') : null;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (media && frame && canHover) {
    media.addEventListener('mousemove', function (e) {
      var rect = media.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      frame.style.transform = 'rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg)';
    });

    media.addEventListener('mouseleave', function () {
      frame.style.transform = 'rotateY(0) rotateX(0)';
    });
  }
  (function () {
  'use strict';

  var tabs = document.querySelectorAll('.srv-tab');
  var cards = document.querySelectorAll('.srv-card');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.getAttribute('data-filter');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      var order = 0;
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.classList.remove('pop');
        if (match) {
          card.classList.remove('hide');
          card.classList.add('in');
          card.style.animationDelay = (order * 0.08) + 's';
          void card.offsetWidth;
          card.classList.add('pop');
          order++;
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canHover) {
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  document.querySelectorAll('.srv-img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
    });
  });
})();
})();
(function () {
  'use strict';

  var cards = document.querySelectorAll('.blg-card');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canHover) {
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  document.querySelectorAll('.blg-img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
    });
  });
})();
(function () {
  'use strict';

  var shaft = document.getElementById('whyShaft');
  if (!shaft) {
    return;
  }

  var rail = document.getElementById('whyRail');
  var fill = document.getElementById('whyFill');
  var car = document.getElementById('whyCar');
  var num = document.getElementById('whyNum');
  var floors = Array.prototype.slice.call(shaft.querySelectorAll('.why-floor'));
  var nodes = floors.map(function (f) {
    return f.querySelector('.why-node');
  });

  var ys = [];
  var cur = 0;
  var target = 0;
  var carH = 70;
  var activeIdx = -1;
  var visible = false;
  var running = false;

  function measure() {
    var sr = shaft.getBoundingClientRect();
    ys = nodes.map(function (n) {
      var r = n.getBoundingClientRect();
      return r.top - sr.top + r.height / 2;
    });
    rail.style.top = ys[0] + 'px';
    rail.style.height = (ys[ys.length - 1] - ys[0]) + 'px';
    carH = car.offsetHeight;
  }

  function calcTarget() {
    var sr = shaft.getBoundingClientRect();
    var y = window.innerHeight * 0.5 - sr.top;
    target = Math.max(ys[0], Math.min(ys[ys.length - 1], y));
  }

  function render() {
    var diff = target - cur;
    if (Math.abs(diff) > 1) {
      car.setAttribute('data-dir', diff > 0 ? 'down' : 'up');
    }
    cur += diff * 0.12;
    if (Math.abs(target - cur) < 0.3) {
      cur = target;
    }

    car.style.transform = 'translate3d(0,' + (cur - carH / 2) + 'px,0)';
    fill.style.height = (cur - ys[0]) + 'px';

    var idx = 0;
    var best = Infinity;
    ys.forEach(function (y, i) {
      var d = Math.abs(y - cur);
      if (d < best) {
        best = d;
        idx = i;
      }
    });

    car.classList.toggle('open', best < 18);

    if (idx !== activeIdx) {
      activeIdx = idx;
      num.textContent = idx + 1;
      floors.forEach(function (f, i) {
        f.classList.toggle('active', i === idx);
        f.classList.toggle('passed', i < idx);
      });
    }
  }

  function loop() {
    if (!visible) {
      running = false;
      return;
    }
    calcTarget();
    render();
    window.requestAnimationFrame(loop);
  }

  function start() {
    if (!running) {
      running = true;
      window.requestAnimationFrame(loop);
    }
  }

  function init() {
    measure();
    calcTarget();
    cur = target;
    render();
  }

  init();
  window.addEventListener('load', init);
  window.addEventListener('resize', init);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) {
        start();
      }
    }, { rootMargin: '200px 0px 200px 0px' });
    obs.observe(shaft);
  } else {
    visible = true;
    start();
  }
})();