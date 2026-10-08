/*
 * Sal Negra — Consent Mode v2, modalita' BASE (08/10/2026).
 * Unico proprietario del consenso: senza "Aceptar" non si carica nessun tag
 * di Google (Tag Manager, Analytics, Ads) e non resta nessun cookie _ga/_gcl.
 * Caricato nel <head> con defer. Non lancia mai.
 */
(function () {
    'use strict';

    var MODE = 'basic'; // 'advanced' = tag caricati anche senza consenso: richiede un nuovo piano
    var KEY = 'salnegra_consent_v2';
    var MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 12 mesi
    var COOKIE_RE = /^(_ga|_gid|_gcl|_gac)/;
    var COOKIE_DOMAIN = 'salnegratenerife.com';
    var DENIED = { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
    var GRANTED = { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' };

    var me = document.currentScript;
    var gtmOnly = !!(me && me.hasAttribute('data-gtm-only'));
    var tagsLoaded = false;
    var grantedHere = false; // consenso dato in questa pagina (anche con localStorage bloccato)

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    function readState() {
        try {
            var raw = window.localStorage.getItem(KEY);
            if (!raw) return null;
            var o = JSON.parse(raw);
            if (!o || (o.s !== 'granted' && o.s !== 'denied') || typeof o.t !== 'number' || !isFinite(o.t)) return null;
            var now = Date.now();
            if (now - o.t > MAX_AGE || o.t - now > 86400000) return null;
            return o.s;
        } catch (e) { return null; }
    }

    function saveState(s) {
        try {
            window.localStorage.setItem(KEY, JSON.stringify({ s: s, t: Date.now() }));
            return readState() === s;
        } catch (e) { return false; /* storage negato: vale per questa pagina */ }
    }

    function deleteGoogleCookies() {
        try {
            var parts = document.cookie ? document.cookie.split(';') : [];
            var host = location.hostname;
            var onSite = host === COOKIE_DOMAIN || host.slice(-(COOKIE_DOMAIN.length + 1)) === '.' + COOKIE_DOMAIN;
            for (var i = 0; i < parts.length; i++) {
                var name = parts[i].split('=')[0].replace(/^\s+|\s+$/g, '');
                if (!COOKIE_RE.test(name)) continue;
                var base = name + '=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = base;
                if (onSite) document.cookie = base + '; domain=.' + COOKIE_DOMAIN;
            }
        } catch (e) { /* niente */ }
        try { // copia del gclid che il linker di Ads puo' tenere in localStorage (_gcl_ls)
            var ls = window.localStorage;
            for (var k = ls.length - 1; k >= 0; k--) {
                var key = ls.key(k);
                if (key && /^_gcl_/.test(key)) ls.removeItem(key);
            }
        } catch (e) { /* storage negato */ }
    }

    function loadTags() {
        if (tagsLoaded) return;
        tagsLoaded = true;
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-W8MPMC28');
        if (gtmOnly) return;
        var g = document.createElement('script');
        g.async = true;
        g.src = 'https://www.googletagmanager.com/gtag/js?id=G-7G77T77WRT';
        document.head.appendChild(g);
        window.gtag('js', new Date());
        window.gtag('config', 'G-7G77T77WRT');
        window.gtag('config', 'AW-16644254944');
    }

    function grant() {
        try { window.gtag('consent', 'update', GRANTED); } catch (e) { /* niente */ }
        try { loadTags(); } catch (e) { /* niente */ }
    }

    // Revoca con tag gia' caricati: niente piu' invii (anche il lotto in coda all'uscita), poi reload.
    function unloadTags() {
        try { window.gtag('consent', 'update', DENIED); } catch (e) { /* niente */ }
        window['ga-disable-G-7G77T77WRT'] = true;
        window['ga-disable-AW-16644254944'] = true;
        location.reload();
    }

    function banner() { return document.getElementById('cookieBanner'); }
    function showBanner() { var b = banner(); if (b) b.classList.add('active'); }
    function hideBanner() { var b = banner(); if (b) b.classList.remove('active'); }

    // Rilettura dello stato da un'altra scheda (storage) o dal bfcache (pageshow).
    // Il reload e' voluto: in modalita' base un tag gia' caricato non si spegne, si scarica.
    function reevaluate() {
        var s = readState();
        if (s === 'granted') { hideBanner(); grant(); return; }
        if (s === null && grantedHere) return;
        if (tagsLoaded) {
            unloadTags();
            return;
        }
        deleteGoogleCookies();
        if (s === null) showBanner(); else hideBanner();
    }

    window.acceptCookies = function () {
        grantedHere = !saveState('granted'); // solo se lo storage non conserva la scelta
        hideBanner();
        grant();
    };

    window.rejectCookies = function () {
        grantedHere = false;
        saveState('denied');
        try { window.gtag('consent', 'update', DENIED); } catch (e) { /* niente */ }
        deleteGoogleCookies();
        hideBanner();
        if (tagsLoaded) unloadTags();
    };

    window.salnegraConsentState = function () {
        var s = readState();
        return s || (grantedHere ? 'granted' : null);
    };

    try {
        window.gtag('consent', 'default', DENIED);
        var state = readState();
        if (state === 'granted') {
            grant();
        } else {
            deleteGoogleCookies();
            if (state === null) setTimeout(function () { if (!grantedHere && readState() === null) showBanner(); }, 1000);
            if (MODE === 'advanced') loadTags();
        }

        document.addEventListener('click', function (e) {
            var t = e.target;
            var el = t && t.closest ? t.closest('[data-cookie-settings]') : null;
            if (!el) return;
            e.preventDefault();
            showBanner();
        });

        window.addEventListener('storage', function (e) {
            if (e.key === KEY || e.key === null) reevaluate();
        });
        window.addEventListener('pageshow', function (e) {
            if (e.persisted) reevaluate();
        });
    } catch (e) { /* non lancia mai */ }
})();
