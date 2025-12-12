/**
 * ATTAL Cookie Banner - Tracking Integrations
 *
 * Questo file contiene esempi di integrazione del cookie banner
 * con Google Analytics, Facebook Pixel e LinkedIn Insight Tag.
 *
 * IMPORTANTE: Sostituisci i segnaposti con i tuoi ID reali:
 * - GTM-XXXXXXX: Google Tag Manager ID
 * - G-XXXXXXXXXX: Google Analytics 4 Measurement ID
 * - YOUR_PIXEL_ID: Facebook Pixel ID
 * - YOUR_PARTNER_ID: LinkedIn Partner ID
 */

(function() {
    'use strict';

    // Configurazione IDs (SOSTITUISCI CON I TUOI)
    const TRACKING_IDS = {
        gtm: 'GTM-XXXXXXX',           // Google Tag Manager
        ga4: 'G-XXXXXXXXXX',          // Google Analytics 4
        fbPixel: 'YOUR_PIXEL_ID',     // Facebook Pixel
        linkedin: 'YOUR_PARTNER_ID'   // LinkedIn Insight Tag
    };

    // Flag per evitare caricamenti multipli
    let scriptsLoaded = {
        analytics: false,
        marketing: false
    };

    /**
     * Carica Google Tag Manager
     * Alternativa: puoi usare direttamente GA4 senza GTM
     */
    function loadGoogleTagManager() {
        if (scriptsLoaded.analytics || window.dataLayer) {
            return;
        }

        console.log('[Cookie Banner] Caricamento Google Tag Manager...');

        (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',TRACKING_IDS.gtm);

        scriptsLoaded.analytics = true;
        console.log('[Cookie Banner] Google Tag Manager caricato');
    }

    /**
     * Carica Google Analytics 4 (senza GTM)
     * Usa questo se NON usi Google Tag Manager
     */
    function loadGoogleAnalytics() {
        if (scriptsLoaded.analytics || window.gtag) {
            return;
        }

        console.log('[Cookie Banner] Caricamento Google Analytics 4...');

        // Carica lo script gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_IDS.ga4}`;
        document.head.appendChild(script);

        // Inizializza gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', TRACKING_IDS.ga4, {
            'anonymize_ip': true,  // Anonimizza IP per GDPR
            'cookie_flags': 'SameSite=None;Secure'
        });

        scriptsLoaded.analytics = true;
        console.log('[Cookie Banner] Google Analytics 4 caricato');
    }

    /**
     * Carica Facebook Pixel
     */
    function loadFacebookPixel() {
        if (scriptsLoaded.marketing || window.fbq) {
            return;
        }

        console.log('[Cookie Banner] Caricamento Facebook Pixel...');

        !function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n=f.fbq=function(){
                n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
            };
            if(!f._fbq) f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
        }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', TRACKING_IDS.fbPixel);
        fbq('track', 'PageView');

        scriptsLoaded.marketing = true;
        console.log('[Cookie Banner] Facebook Pixel caricato');
    }

    /**
     * Carica LinkedIn Insight Tag
     */
    function loadLinkedInInsight() {
        if (window._linkedin_data_partner_ids) {
            return;
        }

        console.log('[Cookie Banner] Caricamento LinkedIn Insight Tag...');

        window._linkedin_partner_id = TRACKING_IDS.linkedin;
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(window._linkedin_partner_id);

        (function(l) {
            if (!l) {
                window.lintrk = function(a,b){
                    window.lintrk.q.push([a,b])
                };
                window.lintrk.q=[]
            }
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";
            b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);
        })(window.lintrk);

        console.log('[Cookie Banner] LinkedIn Insight Tag caricato');
    }

    /**
     * Gestisce il consenso ai cookie
     */
    function handleCookieConsent(event) {
        const consent = event.detail;

        console.log('[Cookie Banner] Consenso ricevuto:', consent);

        // Carica Analytics se consentito
        if (consent.analytics) {
            // SCEGLI UNO DEI DUE:

            // Opzione 1: Con Google Tag Manager (consigliato)
            loadGoogleTagManager();

            // Opzione 2: Google Analytics 4 diretto (senza GTM)
            // loadGoogleAnalytics();
        }

        // Carica Marketing se consentito
        if (consent.marketing) {
            loadFacebookPixel();
            loadLinkedInInsight();
        }
    }

    /**
     * Inizializza le integrazioni
     */
    function init() {
        // Ascolta gli eventi di consenso
        window.addEventListener('attalCookieConsent', handleCookieConsent);

        // Controlla se c'è già un consenso salvato
        if (window.AttalCookies) {
            const savedConsent = AttalCookies.getConsent();

            // Se c'è un consenso salvato, applicalo immediatamente
            if (savedConsent.timestamp) {
                handleCookieConsent({ detail: savedConsent });
            }
        }

        console.log('[Cookie Banner] Integrazioni inizializzate');
    }

    // Inizializza quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

/**
 * ESEMPI DI UTILIZZO AVANZATO
 *
 * 1. TRACKING EVENTI PERSONALIZZATI
 *
 * // Con Google Analytics 4
 * if (window.gtag) {
 *     gtag('event', 'candidatura_inviata', {
 *         'event_category': 'conversioni',
 *         'event_label': 'Candidatura Spontanea'
 *     });
 * }
 *
 * // Con Facebook Pixel
 * if (window.fbq) {
 *     fbq('track', 'Lead', {
 *         content_name: 'Candidatura'
 *     });
 * }
 *
 * // Con LinkedIn
 * if (window.lintrk) {
 *     lintrk('track', { conversion_id: 12345 });
 * }
 *
 *
 * 2. BLOCCARE SCRIPT ESTERNI FINO AL CONSENSO
 *
 * <script type="text/plain" data-consent="analytics">
 *     // Questo codice NON verrà eseguito finché non c'è il consenso
 *     console.log('Analytics consentiti!');
 * </script>
 *
 * Poi aggiungi questo codice per eseguire gli script bloccati:
 *
 * window.addEventListener('attalCookieConsent', function(event) {
 *     if (event.detail.analytics) {
 *         const scripts = document.querySelectorAll('script[data-consent="analytics"]');
 *         scripts.forEach(script => {
 *             const newScript = document.createElement('script');
 *             newScript.textContent = script.textContent;
 *             script.parentNode.replaceChild(newScript, script);
 *         });
 *     }
 * });
 *
 *
 * 3. INTEGRARE CON GOOGLE TAG MANAGER TRIGGERS
 *
 * In GTM, crea un trigger personalizzato:
 * - Tipo: Custom Event
 * - Nome evento: attalCookieConsent
 * - Attiva quando: event.detail.analytics equals true
 *
 * Poi associa i tuoi tag GA4 a questo trigger.
 *
 *
 * 4. CANCELLARE COOKIE SE L'UTENTE REVOCA IL CONSENSO
 *
 * window.addEventListener('attalCookieConsent', function(event) {
 *     // Se l'utente revoca il consenso Analytics
 *     if (!event.detail.analytics) {
 *         // Cancella i cookie di Google Analytics
 *         document.cookie.split(";").forEach(function(c) {
 *             if (c.trim().startsWith('_ga')) {
 *                 document.cookie = c.split("=")[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
 *             }
 *         });
 *     }
 * });
 */
