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
    }

    var lang = detectDefaultLang();
    applyLang(lang);

    /* --------------------------------------------------------------------
       Despre headline typewriter
       -------------------------------------------------------------------- */

    var typeLines = [
        document.getElementById('type-line-1'),
        document.getElementById('type-line-2'),
        document.getElementById('type-line-3')
    ];
    var headlineCaret = document.getElementById('headline-caret');
    var typeTimer = null;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var TYPE_SPEED = 28;
    var LINE_PAUSE = 110;

    function typewriteHeadline(typeLang) {
        if (!typeLines[0]) return;
        if (typeTimer) clearTimeout(typeTimer);

        var texts = typeLines.map(function (el) {
            return el.getAttribute('data-type-' + typeLang) || '';
        });

        typeLines.forEach(function (el) { el.textContent = ''; });
        if (headlineCaret) headlineCaret.classList.remove('is-visible');

        if (reduceMotion) {
            typeLines.forEach(function (el, i) { el.textContent = texts[i]; });
            if (headlineCaret) headlineCaret.classList.add('is-visible');
            return;
        }

        var lineIdx = 0;
        var charIdx = 0;

        function step() {
            var el = typeLines[lineIdx];
            var text = texts[lineIdx];

            if (lineIdx === typeLines.length - 1 && headlineCaret) {
                headlineCaret.classList.add('is-visible');
            }

            charIdx++;
            el.textContent = text.slice(0, charIdx);

            if (charIdx >= text.length) {
                lineIdx++;
                charIdx = 0;
                if (lineIdx >= typeLines.length) return;
                typeTimer = setTimeout(step, LINE_PAUSE);
                return;
            }
            typeTimer = setTimeout(step, TYPE_SPEED);
        }

        step();
    }

    typewriteHeadline(lang);

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            lang = lang === 'ro' ? 'en' : 'ro';
            applyLang(lang);
            updateChrome();
            typewriteHeadline(lang);
        });
    }

    /* --------------------------------------------------------------------
       Scroll-spy for the in-window nav, masthead label and status bar
       -------------------------------------------------------------------- */

    var scrollArea = document.getElementById('panel-scroll');
    var navLinks = document.querySelectorAll('.nav__link');
    var sections = Array.prototype.map.call(navLinks, function (link) {
        var id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
    });

    function sizeSections() {
        if (!scrollArea) return;
        var h = scrollArea.clientHeight + 'px';
        sections.forEach(function (s) {
            if (s) s.style.minHeight = h;
        });
    }

    sizeSections();
    window.addEventListener('resize', sizeSections);

    var MASTHEAD_LABELS = {
        despre: { ro: '01 — DESPRE', en: '01 — ABOUT' },
        experienta: { ro: '02 — EXPERIENȚĂ', en: '02 — EXPERIENCE' },
        contact: { ro: '03 — CONTACT', en: '03 — CONTACT' }
    };
    var SCROLL_LABEL = { ro: 'SCROLL', en: 'SCROLL' };
    var UP_LABEL = { ro: 'SUS', en: 'UP' };

    var mastheadLabel = document.getElementById('masthead-label');
    var statusDashes = document.querySelectorAll('.status-dash');
    var statusScrollLabel = document.getElementById('status-scroll-label');
    var statusScrollArrow = document.getElementById('status-scroll-arrow');
    var activeSectionId = sections[0] ? sections[0].id : null;

    function updateChrome() {
        if (mastheadLabel && MASTHEAD_LABELS[activeSectionId]) {
            mastheadLabel.textContent = MASTHEAD_LABELS[activeSectionId][lang] || MASTHEAD_LABELS[activeSectionId].ro;
        }

        statusDashes.forEach(function (dash) {
            dash.classList.toggle('is-active', dash.getAttribute('href') === '#' + activeSectionId);
        });

        var isLast = sections.length && sections[sections.length - 1] && sections[sections.length - 1].id === activeSectionId;

        if (statusScrollLabel) {
            statusScrollLabel.textContent = (isLast ? UP_LABEL : SCROLL_LABEL)[lang];
        }
        if (statusScrollArrow) {
            statusScrollArrow.textContent = isLast ? '↑' : '↓';
        }
    }

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

        if (sections[activeIndex]) {
            activeSectionId = sections[activeIndex].id;
        }
        updateChrome();
    }

    if (scrollArea) {
        scrollArea.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    function goToSection(id) {
        var target = document.getElementById(id);
        if (target && scrollArea) {
            var isFirst = sections[0] && sections[0].id === id;
            scrollArea.scrollTo({ top: isFirst ? 0 : target.offsetTop, behavior: 'smooth' });
        }
    }

    var jumpLinks = document.querySelectorAll('.nav__mark, .nav__link, .status-dash, #panel-scroll a[href^="#"]');

    jumpLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href').replace('#', '');
            if (!document.getElementById(id)) return;
            e.preventDefault();
            goToSection(id);
        });
    });

    var statusScrollBtn = document.getElementById('status-scroll');
    if (statusScrollBtn) {
        statusScrollBtn.addEventListener('click', function () {
            var idx = 0;
            sections.forEach(function (s, i) {
                if (s && s.id === activeSectionId) idx = i;
            });
            var nextIdx = (idx === sections.length - 1) ? 0 : idx + 1;
            if (sections[nextIdx]) goToSection(sections[nextIdx].id);
        });
    }
})();
