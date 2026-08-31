(function () {
    'use strict';

    /* --------------------------------------------------------------------
       Background crossfade (rotating nature photography)
       -------------------------------------------------------------------- */

    var images = [
        'img/backgrounds/1.jpg',
        'img/backgrounds/2.jpg',
        'img/backgrounds/3.jpg',
        'img/backgrounds/4.jpg',
        'img/backgrounds/5.jpg'
    ];

    var layerA = document.getElementById('bg-a');
    var layerB = document.getElementById('bg-b');
    var current = 0;
    var showingA = true;
    var INTERVAL = 9000;

    function preload(src) {
        var img = new Image();
        img.src = src;
    }

    function setLayer(el, src) {
        el.style.backgroundImage = 'url(' + src + ')';
        // Restart the ken-burns animation for this layer.
        el.style.animation = 'none';
        // Force reflow so the animation can be re-applied.
        void el.offsetWidth;
        el.style.animation = '';
    }

    if (layerA && layerB) {
        setLayer(layerA, images[current]);
        preload(images[(current + 1) % images.length]);

        setInterval(function () {
            current = (current + 1) % images.length;
            var incoming = showingA ? layerB : layerA;
            var outgoing = showingA ? layerA : layerB;

            setLayer(incoming, images[current]);
            incoming.classList.add('is-active');
            outgoing.classList.remove('is-active');
            showingA = !showingA;

            preload(images[(current + 1) % images.length]);
        }, INTERVAL);
    }

    /* --------------------------------------------------------------------
       Language toggle (RO / EN)
       -------------------------------------------------------------------- */

    var STORAGE_KEY = 'site-lang';
    var langToggle = document.getElementById('lang-toggle');
    var translatable = document.querySelectorAll('[data-ro][data-en]');
    var langOpts = document.querySelectorAll('.lang-opt');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var titles = {
        ro: 'Emanuel Ștefan — Software care mișcă afacerea ta înainte',
        en: 'Emanuel Ștefan — Software that moves your business forward'
    };

    function detectDefaultLang() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'ro' || stored === 'en') return stored;
        var nav = (navigator.language || 'ro').toLowerCase();
        return nav.indexOf('ro') === 0 ? 'ro' : 'en';
    }

    /* --------------------------------------------------------------------
       Hero headline typewriter
       -------------------------------------------------------------------- */

    var heroHeadline = document.getElementById('hero-headline');
    var typeTimer = null;

    function typewriteHero(lang) {
        if (!heroHeadline) return;
        var text = heroHeadline.getAttribute('data-type-' + lang) || '';
        heroHeadline.setAttribute('aria-label', text);

        if (typeTimer) clearInterval(typeTimer);

        if (reduceMotion) {
            heroHeadline.textContent = text;
            heroHeadline.classList.add('is-done');
            return;
        }

        heroHeadline.classList.remove('is-done');
        heroHeadline.textContent = '';
        var i = 0;

        typeTimer = setInterval(function () {
            i++;
            heroHeadline.textContent = text.slice(0, i);
            if (i >= text.length) {
                clearInterval(typeTimer);
                heroHeadline.classList.add('is-done');
            }
        }, 28);
    }

    function applyLang(lang) {
        translatable.forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text !== null) el.textContent = text;
        });

        langOpts.forEach(function (opt) {
            opt.classList.toggle('is-active', opt.getAttribute('data-lang') === lang);
        });

        document.documentElement.setAttribute('lang', lang);
        document.title = titles[lang] || titles.ro;
        localStorage.setItem(STORAGE_KEY, lang);

        typewriteHero(lang);
    }

    var lang = detectDefaultLang();
    applyLang(lang);

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            lang = lang === 'ro' ? 'en' : 'ro';
            applyLang(lang);
        });
    }

    /* --------------------------------------------------------------------
       Scroll-spy for the in-window nav
       -------------------------------------------------------------------- */

    var scrollArea = document.getElementById('panel-scroll');
    var navLinks = document.querySelectorAll('.nav__link');
    var sections = Array.prototype.map.call(navLinks, function (link) {
        var id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
    });

    function updateActiveLink() {
        if (!scrollArea) return;
        var scrollPos = scrollArea.scrollTop + scrollArea.clientHeight * 0.3;
        var activeIndex = 0;

        sections.forEach(function (section, i) {
            if (section && section.offsetTop <= scrollPos) {
                activeIndex = i;
            }
        });

        navLinks.forEach(function (link, i) {
            link.classList.toggle('is-active', i === activeIndex);
        });
    }

    if (scrollArea) {
        scrollArea.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href').replace('#', '');
            var target = document.getElementById(id);
            if (target && scrollArea) {
                e.preventDefault();
                scrollArea.scrollTo({
                    top: target.offsetTop - 4,
                    behavior: 'smooth'
                });
            }
        });
    });
})();
