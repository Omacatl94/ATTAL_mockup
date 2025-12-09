# ATTAL Mockup - Struttura Riorganizzata

## Struttura Cartelle

```
attal-mockup/
├── assets/
│   ├── css/
│   │   ├── variables.css      # Variabili CSS (colori, spacing, ecc.)
│   │   ├── base.css           # Reset e stili base
│   │   ├── components.css     # Header, footer, componenti comuni
│   │   ├── ally-widget.css    # Stili widget chatbot Ally
│   │   └── pages/
│   │       ├── homepage.css
│   │       ├── careers.css
│   │       ├── aziende.css
│   │       ├── chi-siamo.css
│   │       ├── filiali.css
│   │       ├── registrazione.css
│   │       ├── profilo.css
│   │       └── chatbot.css
│   │
│   ├── js/
│   │   ├── attal-components.js    # Header/Footer + loader widget
│   │   └── ally-widget-unified.js # Widget chatbot unificato
│   │
│   └── data/
│       ├── jobs.json          # Database offerte lavoro
│       └── filiali.json       # Database filiali
│
├── pages/                     # Pagine HTML snellite
│   ├── index.html             # Homepage
│   ├── careers.html           # Offerte di lavoro
│   ├── aziende.html           # Per le aziende (B2B)
│   ├── chi-siamo.html         # Chi siamo
│   ├── filiali.html           # Trova filiale
│   ├── registrazione.html     # Registrazione utente
│   ├── profilo.html           # Dashboard profilo
│   └── chatbot.html           # Chatbot standalone
│
├── components/                # Template componenti (riferimento)
│   ├── header.html
│   └── footer.html
│
├── test/
│   └── ally-widget-test.html  # Test page widget
│
└── [file originali]           # Backup dei file originali
```

## Come Usare

### Aprire le pagine
Le pagine snellite sono nella cartella `pages/`. Aprire direttamente da lì:
- `pages/index.html` - Homepage
- `pages/careers.html` - Offerte di lavoro
- etc.

### CSS
Ogni pagina carica automaticamente:
1. `variables.css` - Variabili comuni
2. `base.css` - Stili base
3. `components.css` - Header/footer
4. `pages/[nome].css` - CSS specifico della pagina

### JavaScript
Il file `attal-components.js` carica automaticamente:
- Header e footer nei placeholder
- Widget Ally chatbot
- CSS comuni

### Widget Ally
Il widget unificato supporta sia utenti loggati che non:

```javascript
// Utente non loggato
window.initializeAlly({ isLoggedIn: false });

// Utente loggato
window.initializeAlly({
    isLoggedIn: true,
    userProfile: {
        nome: 'Mario',
        cognome: 'Rossi',
        // ... altri dati
    }
});
```

## Confronto Dimensioni

### Prima (file originali)
- HTML totale: ~600 KB (CSS/JS inline)
- Widget JS: 108 KB (2 file duplicati)

### Dopo (riorganizzato)
- HTML totale: ~350 KB (solo markup)
- CSS separato: ~200 KB (cacheable)
- Widget JS: ~44 KB (unificato)

**Risparmio**: ~40% dimensioni + caching browser

## Note Tecniche

### API Key OpenAI
Il widget usa un placeholder `YOUR_API_KEY_HERE`. Per produzione:
1. Creare un backend proxy
2. Non esporre mai la chiave nel frontend

### Path relativi
Tutti i link usano path relativi per funzionare dalla cartella `pages/`:
- `../assets/css/...`
- `../assets/js/...`

### Login State
Lo stato login è gestito via `sessionStorage`:
- `attal_user_logged_in`: 'true' | 'false'
- `attal_user_profile`: JSON del profilo utente
