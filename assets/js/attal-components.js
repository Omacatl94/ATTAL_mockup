/**
 * ATTAL Components v2.0
 * Header e Footer caricati via JavaScript
 * CSS esterni, widget unificato
 */

// Load Lucide Icons if not already loaded
if (typeof lucide === 'undefined') {
    const lucideScript = document.createElement('script');
    lucideScript.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
    lucideScript.async = true;
    document.head.appendChild(lucideScript);
}

const ATTAL_HEADER = `
<header class="attal-header">
    <nav class="header-container">
        <a href="index.html" class="logo" aria-label="ATTAL - Torna alla homepage">
            <svg viewBox="0 0 296.41 117.38">
                <g>
                    <path d="M49.98,0h-17.94L.06,82.36h19.82l6.43-16.16h29.54l6.18,16.16h19.84L49.98,0ZM33.38,47.73l7.72-19.61,7.67,19.61h-15.39Z" fill="#e22721"/>
                    <polygon points="125.17 0 125.17 18.62 110.78 18.62 110.78 82.36 91.6 82.36 91.6 18.62 77.59 18.62 77.59 0 125.17 0" fill="#e22721"/>
                    <polygon points="174.65 0 174.65 18.62 160.26 18.62 160.26 82.36 141.08 82.36 141.08 18.62 127.07 18.62 127.07 0 174.65 0" fill="#e22721"/>
                    <path d="M220.14,0h-17.94l-31.98,82.36h19.82l6.42-16.16h29.54l6.18,16.16h19.84L220.14,0ZM218.93,47.73h-15.39l7.72-19.61,7.67,19.61Z" fill="#e22721"/>
                    <polygon points="296.41 64.22 296.41 82.36 255.54 82.36 255.54 0 274.5 0 274.5 64.22 296.41 64.22" fill="#e22721"/>
                    <path d="M9.81,91.66h2.88l4.52,18.02h-3.31l-.96-3.83h-7.2l-2.06,3.83H0l9.8-18.02ZM12.1,102.66l-1.45-5.94-3.2,5.94h4.65Z" fill="#e22721"/>
                    <path d="M38,95.02l-2.84,1.83c-.82-.93-1.62-1.58-2.38-1.94s-1.63-.54-2.6-.54c-2.1,0-3.8.84-5.12,2.51-1.04,1.33-1.57,2.81-1.57,4.44s.54,2.95,1.61,4.03c1.07,1.09,2.4,1.63,3.97,1.63,1.17,0,2.23-.28,3.19-.84.96-.56,1.74-1.4,2.35-2.53h-5.66l.42-3.2h9.18c-.13,2.98-1.07,5.35-2.82,7.1-1.75,1.75-3.97,2.63-6.68,2.63-2.94,0-5.26-1.01-6.95-3.04-1.36-1.62-2.04-3.56-2.04-5.81,0-2.74.99-5.1,2.98-7.09s4.35-2.99,7.1-2.99c1.02,0,2.01.15,2.99.44.97.29,1.85.71,2.63,1.24.78.53,1.53,1.25,2.25,2.14Z" fill="#e22721"/>
                    <path d="M43.33,91.66h9.76l-.42,3.2h-6.33l-.52,3.72h6.37l-.42,3.17h-6.39l-.67,4.78h6.44l-.41,3.15h-9.88l2.48-18.02Z" fill="#e22721"/>
                    <path d="M56.68,91.66h2.97l6.54,12.25,1.69-12.25h3.32l-2.47,18.02h-2.91l-6.63-12.39-1.7,12.39h-3.27l2.45-18.02Z" fill="#e22721"/>
                    <path d="M74.3,91.66h10.24l-7.2,14.89h5.7l-.42,3.14h-10.36l7.21-14.85h-5.62l.44-3.17Z" fill="#e22721"/>
                    <path d="M87.87,91.66h3.33l-2.54,18.02h-3.27l2.48-18.02Z" fill="#e22721"/>
                    <path d="M101.24,91.66h2.88l4.52,18.02h-3.31l-.96-3.83h-7.2l-2.06,3.83h-3.66l9.8-18.02ZM103.53,102.66l-1.45-5.94-3.2,5.94h4.65Z" fill="#e22721"/>
                    <path d="M120.85,91.66h3.18c1.93,0,3.3.17,4.09.5.98.42,1.73,1,2.24,1.74.51.74.76,1.61.76,2.61,0,1.09-.3,2.08-.89,2.97-.59.89-1.39,1.53-2.39,1.94s-2.67.62-5,.66l-1.05,7.61h-3.42l2.48-18.02ZM123.26,98.89c1.85,0,3.05-.2,3.62-.58.56-.38.85-.94.85-1.68,0-.42-.11-.77-.33-1.05-.22-.29-.55-.49-.98-.6s-1.29-.17-2.57-.17l-.59,4.08Z" fill="#e22721"/>
                    <path d="M134.77,91.66h9.76l-.42,3.2h-6.33l-.52,3.72h6.37l-.42,3.17h-6.39l-.67,4.78h6.44l-.41,3.15h-9.88l2.48-18.02Z" fill="#e22721"/>
                    <path d="M148.31,91.66h3.15c1.95,0,3.32.17,4.11.5.99.42,1.73.99,2.24,1.73.5.74.75,1.61.75,2.63,0,1.25-.37,2.32-1.12,3.21s-1.88,1.52-3.38,1.87l3.95,8.08h-3.53l-3.87-7.87h-.28l-1.09,7.87h-3.41l2.48-18.02ZM150.74,98.86c1.84,0,3.04-.2,3.6-.57.56-.37.83-.93.83-1.67,0-.42-.11-.78-.33-1.07-.22-.29-.55-.49-.97-.6s-1.28-.17-2.57-.17l-.57,4.08Z" fill="#e22721"/>
                    <path d="M169.71,91.66h3.33l-2.54,18.02h-3.27l2.48-18.02Z" fill="#e22721"/>
                    <path d="M176.95,91.66h3.43l-2.08,14.92h5.63l-.4,3.1h-9.07l2.48-18.02Z" fill="#e22721"/>
                    <path d="M195.13,91.66h3.43l-2.08,14.92h5.63l-.4,3.1h-9.07l2.48-18.02Z" fill="#e22721"/>
                    <path d="M212.38,91.66h2.88l4.52,18.02h-3.31l-.96-3.83h-7.2l-2.06,3.83h-3.66l9.8-18.02ZM214.67,102.66l-1.45-5.94-3.2,5.94h4.65Z" fill="#e22721"/>
                    <path d="M222.86,91.66h3.32l3.25,13.01,7.02-13.01h3.67l-9.71,18.02h-3.04l-4.5-18.02Z" fill="#e22721"/>
                    <path d="M250.92,91.2c2.49,0,4.55.8,6.17,2.39s2.43,3.62,2.43,6.07c0,1.88-.48,3.65-1.44,5.31-.96,1.66-2.23,2.94-3.82,3.83-1.59.89-3.42,1.33-5.48,1.33-2.58,0-4.64-.76-6.19-2.28-1.54-1.52-2.31-3.52-2.31-6,0-2.82.92-5.24,2.76-7.27,2.06-2.25,4.68-3.38,7.88-3.38ZM250.79,94.4c-1.3,0-2.49.31-3.56.94s-1.94,1.52-2.6,2.7c-.66,1.17-.99,2.38-.99,3.63,0,1.48.46,2.73,1.37,3.76.91,1.03,2.22,1.54,3.94,1.54,1.98,0,3.67-.69,5.05-2.08s2.08-3.08,2.08-5.06c0-1.64-.49-2.96-1.46-3.95s-2.25-1.48-3.83-1.48Z" fill="#e22721"/>
                    <path d="M264,91.66h3.15c1.95,0,3.32.17,4.11.5.99.42,1.73.99,2.24,1.73.5.74.75,1.61.75,2.63,0,1.25-.37,2.32-1.12,3.21s-1.88,1.52-3.38,1.87l3.95,8.08h-3.53l-3.87-7.87h-.28l-1.09,7.87h-3.41l2.48-18.02ZM266.43,98.86c1.84,0,3.04-.2,3.6-.57.56-.37.83-.93.83-1.67,0-.42-.11-.78-.33-1.07-.22-.29-.55-.49-.97-.6s-1.28-.17-2.57-.17l-.57,4.08Z" fill="#e22721"/>
                    <path d="M286.79,91.2c2.49,0,4.55.8,6.17,2.39s2.43,3.62,2.43,6.07c0,1.88-.48,3.65-1.44,5.31-.96,1.66-2.23,2.94-3.82,3.83-1.59.89-3.42,1.33-5.48,1.33-2.58,0-4.64-.76-6.19-2.28-1.54-1.52-2.31-3.52-2.31-6,0-2.82.92-5.24,2.76-7.27,2.06-2.25,4.68-3.38,7.88-3.38ZM286.67,94.4c-1.3,0-2.49.31-3.56.94s-1.94,1.52-2.6,2.7c-.66,1.17-.99,2.38-.99,3.63,0,1.48.46,2.73,1.37,3.76.91,1.03,2.22,1.54,3.94,1.54,1.98,0,3.67-.69,5.05-2.08s2.08-3.08,2.08-5.06c0-1.64-.49-2.96-1.46-3.95s-2.25-1.48-3.83-1.48Z" fill="#e22721"/>
                </g>
            </svg>
        </a>

        <div class="nav-center">
            <ul class="nav-links">
                <li><a href="https://careers.attalgroup.it/jobs.php" target="_blank">Offerte di Lavoro</a></li>
                <li><a href="filiali.html">Filiali</a></li>
                <li><a href="aziende.html">Per le Aziende</a></li>
                <li><a href="chi-siamo.html">Chi Siamo</a></li>
            </ul>
        </div>

        <div class="nav-right">
            <a href="https://careers.attalgroup.it/job-seekers-login.php#login" target="_blank" class="btn-secondary">Accedi</a>
            <a href="https://careers.attalgroup.it/jobs.php" target="_blank" class="btn-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                Trova Lavoro
            </a>
        </div>

        <button class="mobile-menu-btn" aria-label="Apri menu" aria-expanded="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon" style="display: none;">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </nav>

    <div class="mobile-menu" aria-hidden="true">
        <ul class="nav-links">
            <li><a href="https://careers.attalgroup.it/jobs.php" target="_blank">Offerte di Lavoro</a></li>
            <li><a href="filiali.html">Filiali</a></li>
            <li><a href="aziende.html">Per le Aziende</a></li>
            <li><a href="chi-siamo.html">Chi Siamo</a></li>
        </ul>
        <div class="mobile-ctas">
            <a href="https://careers.attalgroup.it/jobs.php" target="_blank" class="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                Trova Lavoro
            </a>
            <a href="https://careers.attalgroup.it/job-seekers-login.php#login" target="_blank" class="btn-secondary">Accedi</a>
        </div>
    </div>
</header>
`;

const ATTAL_FOOTER = `
<footer class="attal-footer">
    <div class="footer-container">
        <div class="footer-main">
            <div class="footer-brand">
                <a href="index.html" class="footer-logo">
                    <svg viewBox="0 0 296.41 82.36">
                        <g>
                            <path d="M49.98,0h-17.94L.06,82.36h19.82l6.43-16.16h29.54l6.18,16.16h19.84L49.98,0ZM33.38,47.73l7.72-19.61,7.67,19.61h-15.39Z" fill="#e22721"/>
                            <polygon points="125.17 0 125.17 18.62 110.78 18.62 110.78 82.36 91.6 82.36 91.6 18.62 77.59 18.62 77.59 0 125.17 0" fill="#e22721"/>
                            <polygon points="174.65 0 174.65 18.62 160.26 18.62 160.26 82.36 141.08 82.36 141.08 18.62 127.07 18.62 127.07 0 174.65 0" fill="#e22721"/>
                            <path d="M220.14,0h-17.94l-31.98,82.36h19.82l6.42-16.16h29.54l6.18,16.16h19.84L220.14,0ZM218.93,47.73h-15.39l7.72-19.61,7.67,19.61Z" fill="#e22721"/>
                            <polygon points="296.41 64.22 296.41 82.36 255.54 82.36 255.54 0 274.5 0 274.5 64.22 296.41 64.22" fill="#e22721"/>
                        </g>
                    </svg>
                </a>
                <p class="footer-tagline">Agenzia per il Lavoro<br>Vicini a te, vicini al lavoro.</p>
                <p class="footer-auth">Aut. Min. indet. Prot. 0013582 del 03/10/2012<br>Albo Informatico delle APL - Sez. I</p>
            </div>

            <div class="footer-column">
                <h4>Candidati</h4>
                <ul>
                    <li><a href="https://careers.attalgroup.it/jobs.php" target="_blank">Offerte di Lavoro</a></li>
                    <li><a href="filiali.html">Trova Filiale</a></li>
                    <li><a href="https://careers.attalgroup.it/job-seekers-login.php#login" target="_blank">Registrati</a></li>
                    <li><a href="#" style="pointer-events: none; opacity: 0.5;" title="Pagina non disponibile">Formazione Gratuita</a></li>
                    <li><a href="#" style="pointer-events: none; opacity: 0.5;" title="Pagina non disponibile">FAQ</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4>Aziende</h4>
                <ul>
                    <li><a href="#" style="pointer-events: none; opacity: 0.5;" title="Pagina non disponibile">Somministrazione</a></li>
                    <li><a href="#" style="pointer-events: none; opacity: 0.5;" title="Pagina non disponibile">Ricerca e Selezione</a></li>
                    <li><a href="#" style="pointer-events: none; opacity: 0.5;" title="Pagina non disponibile">Formazione</a></li>
                    <li><a href="#" style="pointer-events: none; opacity: 0.5;" title="Pagina non disponibile">Outsourcing</a></li>
                    <li><a href="contatti.html">Contattaci</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4>ATTAL</h4>
                <ul>
                    <li><a href="chi-siamo.html">Chi Siamo</a></li>
                    <li><a href="filiali.html">Le Nostre Filiali</a></li>
                    <li><a href="lavora-con-noi.html">Lavora con Noi</a></li>
                    <li><a href="#" style="pointer-events: none; opacity: 0.5;" title="Pagina non disponibile">News</a></li>
                    <li><a href="contatti.html">Contatti</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <div class="footer-newsletter">
                    <h4>Ricevi offerte su misura</h4>
                    <p>Iscriviti per ricevere le migliori opportunità nella tua zona.</p>
                    <form class="newsletter-form" action="https://formspree.io/f/xyzrnnbj" method="POST">
                        <input type="email" name="email" placeholder="La tua email" required>
                        <button type="submit" aria-label="Iscriviti">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="min-width: 18px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </form>
                    <label class="newsletter-consent" style="display: flex; align-items: flex-start; gap: 8px; margin-top: 12px; cursor: pointer;">
                        <input type="checkbox" name="consent" required style="margin-top: 3px; accent-color: var(--attal-red);">
                        <span style="font-size: 11px; color: var(--gray-400); line-height: 1.4;">Acconsento a ricevere newsletter e comunicazioni commerciali da Attal Group. <a href="privacy-policy.html" style="color: var(--attal-red); text-decoration: underline;">Privacy Policy</a></span>
                    </label>
                    <p class="newsletter-success" style="display: none; color: #22c55e; font-size: 13px; margin-top: 10px;">Iscrizione completata! Ti terremo aggiornato.</p>
                </div>

                <div class="footer-social">
                    <a href="https://www.facebook.com/attalgroupitalia" target="_blank" aria-label="Facebook">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="https://www.instagram.com/attalgroup_official/" target="_blank" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <a href="https://it.linkedin.com/company/attalgroupitalia" target="_blank" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="footer-copyright">
                © 2025 Attal Group S.p.A. con socio unico — P.IVA 06961760722 — Tutti i diritti riservati
            </p>
            <div class="footer-legal">
                <a href="privacy-policy.html">Privacy Policy</a>
                <a href="cookie-policy.html">Cookie Policy</a>
                <a href="whistleblowing.html">Whistleblowing</a>
                <a href="javascript:void(0);" onclick="if(window.AttalCookies) AttalCookies.openPreferences();">Gestisci Cookie</a>
            </div>
        </div>
    </div>
</footer>
`;

function initAttalComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = ATTAL_HEADER;
        initHeaderScripts();
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = ATTAL_FOOTER;
        initFooterScripts();
    }
}

function initHeaderScripts() {
    const header = document.querySelector('.attal-header');
    if (!header) return;

    updateHeaderForLoginState();
    setActiveNavLink();

    const mobileMenuBtn = header.querySelector('.mobile-menu-btn');
    const mobileMenu = header.querySelector('.mobile-menu');
    const menuIcon = mobileMenuBtn?.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn?.querySelector('.close-icon');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.toggle('open');
        if (menuIcon) menuIcon.style.display = isOpen ? 'none' : 'block';
        if (closeIcon) closeIcon.style.display = isOpen ? 'block' : 'none';
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    document.addEventListener('click', function(e) {
        if (!header.contains(e.target) && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            if (menuIcon) menuIcon.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            if (menuIcon) menuIcon.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
    });
}

function updateHeaderForLoginState() {
    const isLoggedIn = sessionStorage.getItem('attal_user_logged_in') === 'true';

    // Cerca gli elementi nell'header (potrebbe essere caricato dinamicamente)
    const header = document.querySelector('.attal-header');
    if (!header) {
        console.warn('Header non trovato, riprovo tra 100ms');
        setTimeout(updateHeaderForLoginState, 100);
        return;
    }

    const profileLinkDesktop = document.getElementById('profile-link-desktop');
    const accediLinkDesktop = document.getElementById('accedi-link-desktop');
    const profileLinkMobile = document.getElementById('profile-link-mobile');
    const accediLinkMobile = document.getElementById('accedi-link-mobile');

    if (isLoggedIn) {
        // Mostra profilo, nascondi accedi
        if (profileLinkDesktop) profileLinkDesktop.style.display = 'inline-flex';
        if (accediLinkDesktop) accediLinkDesktop.style.display = 'none';
        if (profileLinkMobile) profileLinkMobile.style.display = 'flex';
        if (accediLinkMobile) accediLinkMobile.style.display = 'none';
    } else {
        // Nascondi profilo, mostra accedi
        if (profileLinkDesktop) profileLinkDesktop.style.display = 'none';
        if (accediLinkDesktop) accediLinkDesktop.style.display = '';
        if (profileLinkMobile) profileLinkMobile.style.display = 'none';
        if (accediLinkMobile) accediLinkMobile.style.display = '';
    }
}

// Esponi globalmente per poterla chiamare da altre parti
window.updateHeaderForLoginState = updateHeaderForLoginState;

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    // Mappa delle pagine ai link di navigazione
    const pageToNav = {
        'index.html': null, // Homepage, nessun link evidenziato
        '': null, // Root
        'careers.html': 'Offerte di Lavoro',
        'aziende.html': 'Per le Aziende',
        'chi-siamo.html': 'Chi Siamo',
        'filiali.html': 'Filiali'
    };

    const activeText = pageToNav[currentPage];
    if (!activeText) return;

    // Cerca nei link desktop
    const navLinks = document.querySelectorAll('.attal-header .nav-links a');
    navLinks.forEach(link => {
        if (link.textContent.trim() === activeText) {
            link.classList.add('active');
        }
    });

    // Cerca anche nei link mobile
    const mobileLinks = document.querySelectorAll('.attal-header .mobile-menu a');
    mobileLinks.forEach(link => {
        if (link.textContent.trim() === activeText) {
            link.classList.add('active');
        }
    });
}

function initFooterScripts() {
    // Initialize Lucide icons with retry mechanism
    function initLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            // Retry after a short delay if Lucide isn't loaded yet
            setTimeout(initLucideIcons, 100);
        }
    }
    initLucideIcons();

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = this;
            const button = form.querySelector('button');
            const consentCheckbox = form.parentElement.querySelector('input[name="consent"]');
            const successMsg = form.parentElement.querySelector('.newsletter-success');
            const consentLabel = form.parentElement.querySelector('.newsletter-consent');

            // Verifica consenso
            if (!consentCheckbox || !consentCheckbox.checked) {
                alert('Devi accettare l\'informativa privacy per iscriverti.');
                return;
            }

            button.disabled = true;

            try {
                const formData = new FormData(form);
                formData.append('consent', 'accepted');
                formData.append('consent_date', new Date().toISOString());

                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    form.style.display = 'none';
                    if (consentLabel) consentLabel.style.display = 'none';
                    successMsg.style.display = 'block';
                } else {
                    alert('Errore durante l\'iscrizione. Riprova.');
                    button.disabled = false;
                }
            } catch (error) {
                alert('Errore di connessione. Riprova.');
                button.disabled = false;
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAttalComponents);
} else {
    initAttalComponents();
}

// CSS già caricati nelle pagine HTML - non serve caricarli dinamicamente

// Carica Cookie Banner
(function loadCookieBanner() {
    const script = document.createElement('script');
    // Determina il path base in base alla posizione della pagina
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const basePath = isInSubfolder ? '../assets/js/' : 'assets/js/';
    script.src = basePath + 'cookie-banner.js';
    script.async = true;

    script.onerror = function() {
        console.warn('Cookie banner not loaded - file may not exist yet');
    };

    document.body.appendChild(script);
})();
