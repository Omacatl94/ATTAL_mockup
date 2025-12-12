/**
 * ATTAL Cookie Banner - GDPR Compliant
 * Version: 1.0.0
 *
 * Features:
 * - GDPR compliant with granular consent
 * - Self-contained (CSS + JS)
 * - localStorage persistence (12 months)
 * - Responsive design
 * - Compatible with ATTAL design system
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'attal_cookie_consent',
        EXPIRY_DAYS: 365, // 12 months
        COLORS: {
            primary: '#e22721',
            primaryDark: '#c91f1a',
            dark: '#1a1a1a',
            darkLight: '#1f2937',
            gray: '#6b7280',
            grayLight: '#9ca3af',
            white: '#ffffff'
        }
    };

    // Cookie consent state
    let consentState = {
        timestamp: null,
        necessary: true,
        analytics: false,
        marketing: false
    };

    // Inject CSS styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Cookie Banner Overlay */
            #attal-cookie-overlay {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                z-index: 999998;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            #attal-cookie-overlay.show {
                display: block;
            }

            #attal-cookie-overlay.visible {
                opacity: 1;
            }

            /* Cookie Banner Container */
            #attal-cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: ${CONFIG.COLORS.white};
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
                z-index: 999999;
                display: none;
                transform: translateY(100%);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #attal-cookie-banner.show {
                display: block;
            }

            #attal-cookie-banner.visible {
                transform: translateY(0);
            }

            .attal-cookie-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 24px;
            }

            /* Banner Header */
            .attal-cookie-header {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                margin-bottom: 16px;
            }

            .attal-cookie-icon {
                font-size: 32px;
                flex-shrink: 0;
                line-height: 1;
            }

            .attal-cookie-title {
                flex: 1;
            }

            .attal-cookie-title h2 {
                font-size: 20px;
                font-weight: 700;
                color: ${CONFIG.COLORS.dark};
                margin: 0 0 8px 0;
            }

            .attal-cookie-title p {
                font-size: 14px;
                color: ${CONFIG.COLORS.gray};
                margin: 0;
                line-height: 1.5;
            }

            /* Banner Actions */
            .attal-cookie-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                margin-top: 20px;
            }

            .attal-btn {
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: inherit;
                white-space: nowrap;
            }

            .attal-btn:focus {
                outline: 2px solid ${CONFIG.COLORS.primary};
                outline-offset: 2px;
            }

            .attal-btn-primary {
                background: ${CONFIG.COLORS.primary};
                color: ${CONFIG.COLORS.white};
            }

            .attal-btn-primary:hover {
                background: ${CONFIG.COLORS.primaryDark};
                transform: translateY(-1px);
            }

            .attal-btn-secondary {
                background: transparent;
                color: ${CONFIG.COLORS.gray};
                border: 2px solid ${CONFIG.COLORS.grayLight};
            }

            .attal-btn-secondary:hover {
                border-color: ${CONFIG.COLORS.gray};
                color: ${CONFIG.COLORS.dark};
            }

            .attal-btn-text {
                background: transparent;
                color: ${CONFIG.COLORS.gray};
                padding: 12px 16px;
                text-decoration: underline;
            }

            .attal-btn-text:hover {
                color: ${CONFIG.COLORS.dark};
            }

            /* Preferences Panel */
            #attal-cookie-preferences {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                z-index: 1000000;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                overflow-y: auto;
                padding: 20px;
            }

            #attal-cookie-preferences.show {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #attal-cookie-preferences.visible {
                opacity: 1;
            }

            .attal-preferences-panel {
                background: ${CONFIG.COLORS.white};
                border-radius: 12px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #attal-cookie-preferences.visible .attal-preferences-panel {
                transform: scale(1);
            }

            .attal-preferences-header {
                padding: 24px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .attal-preferences-header h2 {
                font-size: 18px;
                font-weight: 700;
                color: ${CONFIG.COLORS.dark};
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .attal-preferences-close {
                background: transparent;
                border: none;
                font-size: 24px;
                color: ${CONFIG.COLORS.gray};
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .attal-preferences-close:hover {
                background: #f3f4f6;
                color: ${CONFIG.COLORS.dark};
            }

            .attal-preferences-body {
                padding: 24px;
            }

            /* Cookie Category */
            .attal-cookie-category {
                margin-bottom: 24px;
                padding-bottom: 24px;
                border-bottom: 1px solid #e5e7eb;
            }

            .attal-cookie-category:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .attal-category-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .attal-category-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .attal-category-title h3 {
                font-size: 16px;
                font-weight: 600;
                color: ${CONFIG.COLORS.dark};
                margin: 0;
            }

            .attal-category-badge {
                font-size: 11px;
                font-weight: 600;
                color: ${CONFIG.COLORS.gray};
                background: #f3f4f6;
                padding: 2px 8px;
                border-radius: 4px;
                text-transform: uppercase;
            }

            .attal-category-description {
                font-size: 14px;
                color: ${CONFIG.COLORS.gray};
                line-height: 1.6;
                margin: 0 0 8px 0;
            }

            .attal-category-provider {
                font-size: 12px;
                color: ${CONFIG.COLORS.grayLight};
                margin: 0;
            }

            /* Toggle Switch */
            .attal-toggle-switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }

            .attal-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .attal-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #d1d5db;
                transition: 0.3s;
                border-radius: 24px;
            }

            .attal-toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
            }

            .attal-toggle-switch input:checked + .attal-toggle-slider {
                background-color: ${CONFIG.COLORS.primary};
            }

            .attal-toggle-switch input:checked + .attal-toggle-slider:before {
                transform: translateX(24px);
            }

            .attal-toggle-switch input:disabled + .attal-toggle-slider {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Preferences Footer */
            .attal-preferences-footer {
                padding: 20px 24px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .attal-preferences-actions {
                display: flex;
                gap: 12px;
            }

            .attal-preferences-info {
                font-size: 12px;
                color: ${CONFIG.COLORS.grayLight};
                text-align: center;
            }

            /* Confirmation Toast */
            #attal-cookie-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${CONFIG.COLORS.dark};
                color: ${CONFIG.COLORS.white};
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 1000001;
                display: none;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                max-width: 300px;
            }

            #attal-cookie-toast.show {
                display: block;
            }

            #attal-cookie-toast.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .attal-toast-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }

            .attal-toast-icon {
                font-size: 20px;
                flex-shrink: 0;
                line-height: 1;
            }

            .attal-toast-text {
                flex: 1;
            }

            .attal-toast-title {
                font-weight: 600;
                margin: 0 0 4px 0;
                font-size: 14px;
            }

            .attal-toast-message {
                font-size: 13px;
                color: #d1d5db;
                margin: 0;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .attal-cookie-container {
                    padding: 20px;
                }

                .attal-cookie-header {
                    flex-direction: column;
                    text-align: center;
                }

                .attal-cookie-actions {
                    flex-direction: column;
                }

                .attal-btn {
                    width: 100%;
                }

                .attal-preferences-panel {
                    margin: 0;
                    border-radius: 0;
                    max-height: 100vh;
                }

                .attal-preferences-actions {
                    flex-direction: column;
                }

                #attal-cookie-toast {
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                    max-width: none;
                }
            }

            @media (max-width: 480px) {
                .attal-cookie-title h2 {
                    font-size: 18px;
                }

                .attal-cookie-title p {
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create banner HTML
    function createBanner() {
        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'attal-cookie-overlay';
        overlay.onclick = closeBanner;

        // Banner
        const banner = document.createElement('div');
        banner.id = 'attal-cookie-banner';
        banner.innerHTML = `
            <div class="attal-cookie-container">
                <div class="attal-cookie-header">
                    <div class="attal-cookie-icon">🍪</div>
                    <div class="attal-cookie-title">
                        <h2>La tua privacy è importante per noi</h2>
                        <p>Utilizziamo cookie tecnici necessari per il funzionamento del sito. Con il tuo consenso, utilizziamo anche cookie di Google Analytics per analisi statistiche e cookie di Facebook e LinkedIn per mostrarti pubblicità pertinenti.</p>
                    </div>
                </div>
                <div class="attal-cookie-actions">
                    <button class="attal-btn attal-btn-primary" onclick="AttalCookies.acceptAll()">Accetta tutti</button>
                    <button class="attal-btn attal-btn-secondary" onclick="AttalCookies.rejectAll()">Rifiuta tutti</button>
                    <button class="attal-btn attal-btn-secondary" onclick="AttalCookies.openPreferences()">Personalizza</button>
                    <button class="attal-btn attal-btn-text" onclick="window.open('/cookie', '_blank')">Cookie Policy</button>
                </div>
            </div>
        `;

        // Preferences panel
        const preferences = document.createElement('div');
        preferences.id = 'attal-cookie-preferences';
        preferences.onclick = function(e) {
            if (e.target === preferences) closePreferences();
        };
        preferences.innerHTML = `
            <div class="attal-preferences-panel">
                <div class="attal-preferences-header">
                    <h2><span style="font-size: 20px;">⚙️</span> Gestisci le tue preferenze cookie</h2>
                    <button class="attal-preferences-close" onclick="AttalCookies.closePreferences()" aria-label="Chiudi">✕</button>
                </div>
                <div class="attal-preferences-body">
                    <!-- Cookie Tecnici -->
                    <div class="attal-cookie-category">
                        <div class="attal-category-header">
                            <div class="attal-category-title">
                                <h3>✓ Cookie Tecnici</h3>
                                <span class="attal-category-badge">Sempre attivi</span>
                            </div>
                            <label class="attal-toggle-switch">
                                <input type="checkbox" checked disabled>
                                <span class="attal-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="attal-category-description">
                            Questi cookie sono essenziali per il funzionamento del sito. Permettono la navigazione e l'utilizzo delle funzionalità base. Non possono essere disattivati.
                        </p>
                    </div>

                    <!-- Cookie Analitici -->
                    <div class="attal-cookie-category">
                        <div class="attal-category-header">
                            <div class="attal-category-title">
                                <h3>○ Cookie Analitici</h3>
                            </div>
                            <label class="attal-toggle-switch">
                                <input type="checkbox" id="attal-analytics-toggle" onchange="AttalCookies.updatePreference('analytics', this.checked)">
                                <span class="attal-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="attal-category-description">
                            Utilizziamo Google Analytics per capire come i visitatori interagiscono con il sito. I dati sono anonimizzati e ci aiutano a migliorare l'esperienza di navigazione.
                        </p>
                        <p class="attal-category-provider">Fornitore: Google Ireland Limited</p>
                    </div>

                    <!-- Cookie Marketing -->
                    <div class="attal-cookie-category">
                        <div class="attal-category-header">
                            <div class="attal-category-title">
                                <h3>○ Cookie di Marketing</h3>
                            </div>
                            <label class="attal-toggle-switch">
                                <input type="checkbox" id="attal-marketing-toggle" onchange="AttalCookies.updatePreference('marketing', this.checked)">
                                <span class="attal-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="attal-category-description">
                            Questi cookie vengono utilizzati per mostrarti annunci pubblicitari pertinenti ai tuoi interessi, sia sul nostro sito che su altri siti web.
                        </p>
                        <p class="attal-category-provider">Fornitori: Meta (Facebook), LinkedIn</p>
                    </div>
                </div>
                <div class="attal-preferences-footer">
                    <div class="attal-preferences-actions">
                        <button class="attal-btn attal-btn-primary" style="flex: 1;" onclick="AttalCookies.savePreferences()">Salva preferenze</button>
                        <button class="attal-btn attal-btn-secondary" style="flex: 1;" onclick="AttalCookies.acceptAll(true)">Accetta tutti</button>
                    </div>
                    <p class="attal-preferences-info">
                        Le tue scelte verranno salvate per 12 mesi. Puoi modificarle in qualsiasi momento dal link "Gestisci Cookie" nel footer.
                    </p>
                </div>
            </div>
        `;

        // Toast notification
        const toast = document.createElement('div');
        toast.id = 'attal-cookie-toast';

        // Append to body
        document.body.appendChild(overlay);
        document.body.appendChild(banner);
        document.body.appendChild(preferences);
        document.body.appendChild(toast);
    }

    // Show banner
    function showBanner() {
        const overlay = document.getElementById('attal-cookie-overlay');
        const banner = document.getElementById('attal-cookie-banner');

        overlay.classList.add('show');
        banner.classList.add('show');

        // Trigger animation
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            banner.classList.add('visible');
        });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close banner
    function closeBanner() {
        const overlay = document.getElementById('attal-cookie-overlay');
        const banner = document.getElementById('attal-cookie-banner');

        overlay.classList.remove('visible');
        banner.classList.remove('visible');

        setTimeout(() => {
            overlay.classList.remove('show');
            banner.classList.remove('show');
            document.body.style.overflow = '';
        }, 300);
    }

    // Open preferences
    function openPreferences() {
        closeBanner();

        const preferences = document.getElementById('attal-cookie-preferences');

        // Load current state into toggles
        document.getElementById('attal-analytics-toggle').checked = consentState.analytics;
        document.getElementById('attal-marketing-toggle').checked = consentState.marketing;

        preferences.classList.add('show');

        requestAnimationFrame(() => {
            preferences.classList.add('visible');
        });

        document.body.style.overflow = 'hidden';
    }

    // Close preferences
    function closePreferences() {
        const preferences = document.getElementById('attal-cookie-preferences');

        preferences.classList.remove('visible');

        setTimeout(() => {
            preferences.classList.remove('show');
            document.body.style.overflow = '';
        }, 300);
    }

    // Update preference
    function updatePreference(category, value) {
        consentState[category] = value;
    }

    // Accept all cookies
    function acceptAll(fromPreferences = false) {
        consentState.analytics = true;
        consentState.marketing = true;
        consentState.timestamp = Date.now();

        saveConsent();
        applyConsent();

        if (fromPreferences) {
            closePreferences();
        } else {
            closeBanner();
        }

        showToast('✓ Preferenze salvate', 'Hai accettato tutti i cookie. Puoi modificare le tue scelte in qualsiasi momento.');
    }

    // Reject all cookies (except necessary)
    function rejectAll() {
        consentState.analytics = false;
        consentState.marketing = false;
        consentState.timestamp = Date.now();

        saveConsent();
        applyConsent();
        closeBanner();

        showToast('✓ Preferenze salvate', 'Sono attivi solo i cookie tecnici necessari.');
    }

    // Save preferences
    function savePreferences() {
        consentState.timestamp = Date.now();

        saveConsent();
        applyConsent();
        closePreferences();

        showToast('✓ Preferenze salvate', 'Le tue scelte sui cookie sono state memorizzate.');
    }

    // Save consent to localStorage
    function saveConsent() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(consentState));
        } catch (e) {
            console.error('Unable to save cookie consent:', e);
        }
    }

    // Load consent from localStorage
    function loadConsent() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);

                // Check if consent is expired (12 months)
                const expiryTime = parsed.timestamp + (CONFIG.EXPIRY_DAYS * 24 * 60 * 60 * 1000);
                if (Date.now() < expiryTime) {
                    consentState = parsed;
                    return true;
                } else {
                    // Expired, remove old consent
                    localStorage.removeItem(CONFIG.STORAGE_KEY);
                }
            }
        } catch (e) {
            console.error('Unable to load cookie consent:', e);
        }
        return false;
    }

    // Apply consent (load scripts based on consent)
    function applyConsent() {
        // Dispatch custom event for other scripts to listen
        const event = new CustomEvent('attalCookieConsent', {
            detail: {
                necessary: consentState.necessary,
                analytics: consentState.analytics,
                marketing: consentState.marketing
            }
        });
        window.dispatchEvent(event);

        // Example: Load Google Analytics if consented
        if (consentState.analytics && !window.ga) {
            // Add your GA4 initialization here
            console.log('Analytics enabled - Load GA4 here');
        }

        // Example: Load Facebook Pixel if consented
        if (consentState.marketing && !window.fbq) {
            // Add your Facebook Pixel initialization here
            console.log('Marketing enabled - Load Facebook Pixel here');
        }

        // Example: Load LinkedIn Insight if consented
        if (consentState.marketing && !window._linkedin_data_partner_ids) {
            // Add your LinkedIn Insight Tag here
            console.log('Marketing enabled - Load LinkedIn Insight here');
        }
    }

    // Show toast notification
    function showToast(title, message) {
        const toast = document.getElementById('attal-cookie-toast');
        toast.innerHTML = `
            <div class="attal-toast-content">
                <div class="attal-toast-icon">${title.charAt(0)}</div>
                <div class="attal-toast-text">
                    <p class="attal-toast-title">${title}</p>
                    <p class="attal-toast-message">${message}</p>
                </div>
            </div>
        `;

        toast.classList.add('show');
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 300);
        }, 3000);
    }

    // Initialize
    function init() {
        // Inject styles
        injectStyles();

        // Create banner elements
        createBanner();

        // Check for existing consent
        const hasConsent = loadConsent();

        if (hasConsent) {
            // Apply saved consent
            applyConsent();
        } else {
            // Show banner after a short delay
            setTimeout(() => {
                showBanner();
            }, 1000);
        }
    }

    // Public API
    window.AttalCookies = {
        acceptAll: acceptAll,
        rejectAll: rejectAll,
        openPreferences: openPreferences,
        closePreferences: closePreferences,
        savePreferences: savePreferences,
        updatePreference: updatePreference,
        getConsent: function() {
            return { ...consentState };
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
