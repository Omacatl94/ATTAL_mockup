/**
 * ALLY WIDGET UNIFIED - Chatbot ATTAL Group
 * Versione unificata parametrizzata per utenti loggati e non loggati
 *
 * Uso:
 * <script src="assets/js/ally-widget-unified.js"></script>
 * <script>
 *   // Per utente NON loggato:
 *   window.initializeAlly();
 *
 *   // Per utente loggato:
 *   window.initializeAlly({
 *     isLoggedIn: true,
 *     userProfile: {
 *       nome: "Mario",
 *       cognome: "Rossi",
 *       email: "mario.rossi@email.it",
 *       telefono: "333-1234567",
 *       eta: 32,
 *       citta: "Milano",
 *       zona: "Corvetto",
 *       competenze: ["Patentino muletto", "Transpallet elettrico", "WMS"],
 *       esperienza: [
 *         { ruolo: "Magazziniere", azienda: "Amazon Italia", anni: "2021-2024" },
 *         { ruolo: "Operaio di produzione", azienda: "Fiat Mirafiori", anni: "2018-2021" }
 *       ],
 *       preferenze: {
 *         settori: ["Logistica", "Produzione", "Magazzino"],
 *         zona: "Milano e hinterland",
 *         ralDesiderata: "1400-1700",
 *         disponibilita: "Immediata",
 *         turni: true
 *       },
 *       candidature: [
 *         { data: "15/11/2024", offerta: "Magazziniere Amazon", stato: "IN ATTESA" },
 *         { data: "10/11/2024", offerta: "Operaio Logistica DHL", stato: "COLLOQUIO FISSATO 20/11" }
 *       ],
 *       filiale: "Milano Corsica",
 *       scadenze: [
 *         { tipo: "patentino muletto", scadenza: "tra 2 mesi" }
 *       ]
 *     }
 *   });
 * </script>
 */

(function() {
    'use strict';

    // ==========================================
    // CONFIGURAZIONE
    // ==========================================
    // IMPORTANTE: Questa API key deve essere spostata su backend per sicurezza!
    // Non esporre mai API keys nel codice frontend in produzione.
    const OPENAI_API_KEY = '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'; // ATTENZIONE: Spostare su backend per produzione!

    // ==========================================
    // LOAD EXTERNAL CSS
    // ==========================================
    // Determina il path base in base alla posizione della pagina
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const basePath = isInSubfolder ? '../assets/' : 'assets/';

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = basePath + 'css/ally-widget.css';
    document.head.appendChild(cssLink);

    // Load Google Font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // ==========================================
    // INJECT HTML
    // ==========================================
    const widgetHTML = `
        <div id="ally-widget-container">
            <!-- Proactive Bubble -->
            <div id="ally-proactive-bubble">
                <button class="ally-bubble-close" aria-label="Chiudi">×</button>
                <div class="ally-bubble-text"></div>
            </div>

            <!-- Toggle Button -->
            <button id="ally-toggle-btn" aria-label="Apri chat Ally">
                <div class="ally-btn-logo"></div>
                <span class="ally-close-icon">×</span>
            </button>

            <!-- Chat Window -->
            <div id="ally-chat-window">
                <!-- Header -->
                <div class="ally-header">
                    <div class="ally-header-logo"></div>
                    <div class="ally-header-info">
                        <div class="ally-header-title">Ally</div>
                        <div class="ally-header-status">
                            <span class="ally-status-dot"></span>
                            Assistente ATTAL
                        </div>
                    </div>
                </div>

                <!-- Language Bar -->
                <div class="ally-lang-bar">
                    <button class="ally-lang-btn ally-lang-active" data-lang="it" data-name="Italiano" title="Italiano">🇮🇹</button>
                    <button class="ally-lang-btn" data-lang="en" data-name="English" title="English">🇬🇧</button>
                    <button class="ally-lang-btn" data-lang="ro" data-name="Română" title="Română">🇷🇴</button>
                    <button class="ally-lang-btn" data-lang="uk" data-name="Українська" title="Українська">🇺🇦</button>
                    <button class="ally-lang-btn" data-lang="ar" data-name="العربية" title="العربية">🇲🇦</button>
                    <button class="ally-lang-btn" data-lang="bn" data-name="বাংলা" title="বাংলা">🇧🇩</button>
                    <button class="ally-lang-btn" data-lang="sq" data-name="Shqip" title="Shqip">🇦🇱</button>
                    <button class="ally-lang-btn" data-lang="zh" data-name="中文" title="中文">🇨🇳</button>
                </div>

                <!-- Messages -->
                <div class="ally-messages" id="ally-messages"></div>

                <!-- Input -->
                <div class="ally-input-area">
                    <input
                        type="text"
                        class="ally-input"
                        id="ally-input"
                        placeholder="Scrivi un messaggio..."
                        autocomplete="off"
                    >
                    <button class="ally-send-btn" id="ally-send-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // ==========================================
    // INITIALIZE WIDGET
    // ==========================================
    function initializeAlly(config = {}) {
        const isLoggedIn = config.isLoggedIn || false;
        const userProfile = config.userProfile || null;

        // Load external data - with embedded fallback
        let jobsData = [
            { id: 1, title: "Magazziniere Mulettista", city: "Milano", category: "logistica", contract: "somministrazione", time: "full-time", salary: "1.450", badge: "urgent", location: "Milano Nord - Sesto San Giovanni", description: "Cerchiamo magazziniere mulettista per importante azienda di logistica.", requirements: ["Patentino muletto valido", "Esperienza minima 1 anno", "Disponibilità immediata"], benefits: ["Mensa aziendale gratuita", "Possibilità di assunzione diretta"], branch: "Milano Corsica - Via Pergolesi 8", phone: "02/454320" },
            { id: 2, title: "Commesso/a Retail", city: "Milano", category: "retail", contract: "tempo-determinato", time: "full-time", salary: "1.350", badge: "top", location: "Milano Centro - Corso Buenos Aires", description: "Per nota catena di abbigliamento ricerchiamo commesso/a con esperienza.", requirements: ["Esperienza in retail moda", "Ottime capacità comunicative"], benefits: ["Sconti dipendenti 30%", "Bonus vendite mensili"], branch: "Milano Centro - Piazza Duomo 12", phone: "02/123456" },
            { id: 3, title: "Operaio di Produzione", city: "Torino", category: "produzione", contract: "tempo-indeterminato", time: "full-time", salary: "1.600", badge: "salary", location: "Torino Sud - Moncalieri", description: "Azienda metalmeccanica cerca operai per linea di produzione.", requirements: ["Esperienza settore metalmeccanico", "Disponibilità turni"], benefits: ["Contratto indeterminato", "14 mensilità"], branch: "Torino Centro - Corso Francia 10", phone: "011/123456" },
            { id: 4, title: "Addetto/a Vendite GDO", city: "Roma", category: "retail", contract: "somministrazione", time: "part-time", salary: "900", badge: "urgent", location: "Roma EUR", description: "Supermercato cerca addetti vendite per reparto ortofrutta.", requirements: ["Prima esperienza GDO", "Disponibilità weekend"], benefits: ["Orari compatibili studio", "Possibilità full-time"], branch: "Roma EUR - Viale Europa 100", phone: "06/789012" },
            { id: 5, title: "Cameriere di Sala", city: "Milano", category: "ristorazione", contract: "tempo-determinato", time: "full-time", salary: "1.400", badge: "urgent", location: "Milano Centro - Brera", description: "Ristorante rinomato cerca cameriere con esperienza.", requirements: ["Esperienza ristoranti", "Conoscenza inglese"], benefits: ["Mance consistenti", "Pasti inclusi"], branch: "Milano Centro - Piazza Duomo 12", phone: "02/123456" },
            { id: 6, title: "Impiegato/a Amministrativo", city: "Bologna", category: "amministrazione", contract: "tempo-indeterminato", time: "full-time", salary: "1.500", badge: "salary", location: "Bologna Centro", description: "Studio commercialista cerca impiegato amministrativo.", requirements: ["Laurea in Economia", "Conoscenza SAP"], benefits: ["Smart working 2gg/settimana", "Buoni pasto"], branch: "Bologna Centro - Via Indipendenza 30", phone: "051/123456" },
            { id: 7, title: "Autista Patente C+CQC", city: "Milano", category: "logistica", contract: "somministrazione", time: "full-time", salary: "1.700", badge: "top", location: "Milano - Hinterland Nord", description: "Azienda di trasporti cerca autista con patente C e CQC.", requirements: ["Patente C + CQC", "Esperienza minima 2 anni"], benefits: ["Mezzi aziendali nuovi", "Straordinari pagati"], branch: "Milano Corsica - Via Pergolesi 8", phone: "02/454320" },
            { id: 8, title: "Elettricista Industriale", city: "Torino", category: "produzione", contract: "tempo-indeterminato", time: "full-time", salary: "1.800", badge: "salary", location: "Torino - Zona Industriale", description: "Importante realtà industriale cerca elettricista per manutenzione impianti.", requirements: ["Qualifica elettricista", "Esperienza impianti industriali"], benefits: ["Contratto indeterminato", "Welfare completo"], branch: "Torino Centro - Corso Francia 10", phone: "011/123456" },
            { id: 9, title: "Receptionist Hotel 4*", city: "Roma", category: "turismo", contract: "tempo-determinato", time: "full-time", salary: "1.400", badge: "top", location: "Roma Centro Storico", description: "Hotel 4 stelle cerca receptionist con ottima conoscenza inglese.", requirements: ["Inglese fluente", "Esperienza reception"], benefits: ["Ambiente internazionale", "Formazione linguistica"], branch: "Roma EUR - Viale Europa 100", phone: "06/789012" },
            { id: 10, title: "Scaffalista Notturno", city: "Milano", category: "retail", contract: "somministrazione", time: "part-time", salary: "950", badge: "urgent", location: "Milano - Varie Sedi", description: "Catena GDO cerca scaffalisti per turno notturno.", requirements: ["Disponibilità turno notturno", "Buona forma fisica"], benefits: ["Maggiorazioni notturne +30%", "Trasporto aziendale"], branch: "Milano Centro - Piazza Duomo 12", phone: "02/123456" },
            { id: 11, title: "Saldatore Certificato", city: "Bologna", category: "produzione", contract: "tempo-indeterminato", time: "full-time", salary: "1.900", badge: "salary", location: "Bologna - Zona Industriale", description: "Carpenteria metallica cerca saldatore qualificato.", requirements: ["Certificazioni saldatura", "Lettura disegni tecnici"], benefits: ["Retribuzione competitiva", "Formazione continua"], branch: "Bologna Centro - Via Indipendenza 30", phone: "051/123456" },
            { id: 12, title: "Barista - Caffetteria", city: "Milano", category: "ristorazione", contract: "tempo-determinato", time: "full-time", salary: "1.300", badge: "urgent", location: "Milano Centro - Zona Duomo", description: "Caffetteria di prestigio cerca barista esperto.", requirements: ["Esperienza come barista", "Velocità e precisione"], benefits: ["Mance quotidiane", "Pasti inclusi"], branch: "Milano Centro - Piazza Duomo 12", phone: "02/123456" },
            { id: 13, title: "Magazziniere - Interporto", city: "Napoli", category: "logistica", contract: "somministrazione", time: "full-time", salary: "1.350", badge: "urgent", location: "Napoli - Interporto di Nola", description: "Grande azienda logistica cerca magazzinieri per centro di distribuzione.", requirements: ["Esperienza in magazzino", "Disponibilità immediata"], benefits: ["Mensa aziendale", "Possibilità assunzione diretta"], branch: "Napoli - Via Toledo 256", phone: "081/5521234" },
            { id: 14, title: "Addetto/a Vendite - Centro Commerciale", city: "Napoli", category: "retail", contract: "tempo-determinato", time: "full-time", salary: "1.250", badge: "top", location: "Napoli - Centro Commerciale Campania", description: "Nota catena di abbigliamento cerca addetti vendite.", requirements: ["Passione per la moda", "Ottime doti comunicative"], benefits: ["Sconti dipendenti 40%", "Bonus vendite"], branch: "Napoli - Via Toledo 256", phone: "081/5521234" },
            { id: 15, title: "Cameriere/a Ristorazione", city: "Napoli", category: "ristorazione", contract: "tempo-determinato", time: "full-time", salary: "1.300", badge: "urgent", location: "Napoli Centro - Lungomare", description: "Ristorante sul lungomare di Napoli cerca cameriere.", requirements: ["Esperienza ristorazione", "Conoscenza inglese base"], benefits: ["Mance elevate", "Pasti inclusi"], branch: "Napoli - Via Toledo 256", phone: "081/5521234" },
            { id: 16, title: "Operaio/a Settore Alimentare", city: "Salerno", category: "produzione", contract: "somministrazione", time: "full-time", salary: "1.400", badge: "urgent", location: "Salerno - Zona Industriale", description: "Azienda alimentare cerca operai per linea di confezionamento.", requirements: ["Disponibilità immediata", "Buona manualità"], benefits: ["Mensa aziendale", "Ambiente climatizzato"], branch: "Salerno - Via S. Leonardo 52", phone: "089/2851172" },
            { id: 17, title: "Receptionist Albergo", city: "Napoli", category: "turismo", contract: "tempo-determinato", time: "full-time", salary: "1.350", badge: "top", location: "Napoli Centro Storico", description: "Hotel boutique nel centro storico di Napoli cerca receptionist.", requirements: ["Inglese fluente", "Esperienza in hotel"], benefits: ["Ambiente di pregio", "Formazione continua"], branch: "Napoli - Via Toledo 256", phone: "081/5521234" },
            { id: 18, title: "Autista Consegne", city: "Napoli", category: "logistica", contract: "somministrazione", time: "full-time", salary: "1.500", badge: "salary", location: "Napoli - Area Metropolitana", description: "Azienda di e-commerce cerca autisti per consegne last mile.", requirements: ["Patente B da almeno 2 anni", "Conoscenza territorio napoletano"], benefits: ["Furgone aziendale", "Bonus consegne"], branch: "Napoli - Via Toledo 256", phone: "081/5521234" },
            { id: 19, title: "Addetto/a Call Center", city: "Napoli", category: "amministrazione", contract: "tempo-determinato", time: "part-time", salary: "850", badge: "urgent", location: "Napoli - Centro Direzionale", description: "Call center inbound cerca operatori per assistenza clienti.", requirements: ["Buona dialettica", "Conoscenza base PC"], benefits: ["Formazione retribuita", "Orari flessibili"], branch: "Napoli - Via Toledo 256", phone: "081/5521234" },
            { id: 20, title: "Pizzaiolo Esperto", city: "Napoli", category: "ristorazione", contract: "tempo-indeterminato", time: "full-time", salary: "1.600", badge: "top", location: "Napoli - Quartieri Spagnoli", description: "Storica pizzeria napoletana cerca pizzaiolo con esperienza.", requirements: ["Esperienza pizza napoletana", "Conoscenza forno a legna"], benefits: ["Contratto indeterminato", "Retribuzione elevata"], branch: "Napoli - Via Toledo 256", phone: "081/5521234" },
            { id: 21, title: "Operatore Turistico", city: "Napoli", category: "turismo", contract: "tempo-determinato", time: "full-time", salary: "1.400", badge: "top", location: "Napoli - Molo Beverello", description: "Tour operator cerca operatori per escursioni Capri, Pompei, Costiera.", requirements: ["Inglese fluente", "Conoscenza storia locale"], benefits: ["Lavoro all'aperto", "Escursioni gratuite"], branch: "Napoli - Via Toledo 256", phone: "081/5521234" },
            { id: 22, title: "Addetto/a Banco Gastronomia", city: "Battipaglia", category: "retail", contract: "somministrazione", time: "full-time", salary: "1.250", badge: "urgent", location: "Battipaglia - Centro Città", description: "Supermercato cerca addetto banco gastronomia.", requirements: ["Esperienza banco gastronomia", "Igiene alimentare (HACCP)"], benefits: ["Formazione prodotti DOP", "Orari regolari"], branch: "Battipaglia - Via Roma 45", phone: "0828/301234" },
            { id: 23, title: "Manutentore Elettrico", city: "Avellino", category: "produzione", contract: "tempo-indeterminato", time: "full-time", salary: "1.700", badge: "salary", location: "Avellino - Zona Industriale", description: "Azienda manifatturiera cerca manutentore elettrico.", requirements: ["Diploma tecnico elettrico", "Esperienza manutenzione"], benefits: ["Contratto indeterminato", "Welfare aziendale"], branch: "Avellino - C.so Vittorio Emanuele II 101", phone: "0825/36789" }
        ];

        let filialiData = [
            { citta: "Acqui Terme", brand: "Tempus", regione: "Piemonte", indirizzo: "Via Roma 45", tel: "0144/322456" },
            { citta: "Albenga", brand: "Tempus", regione: "Liguria", indirizzo: "Corso Italia 23", tel: "0182/543210" },
            { citta: "Alessandria", brand: "Tempus", regione: "Piemonte", indirizzo: "Via Milano 67", tel: "0131/234567" },
            { citta: "Bassano del Grappa", brand: "Tempus", regione: "Veneto", indirizzo: "Via Jacopo da Ponte 12", tel: "0424/523456" },
            { citta: "Cinisello Balsamo", brand: "Tempus", regione: "Lombardia", indirizzo: "Viale Fulvio Testi 128", tel: "02/66014523" },
            { citta: "Cornaredo", brand: "Tempus", regione: "Lombardia", indirizzo: "Via Magenta 18", tel: "02/93666789" },
            { citta: "Erba", brand: "Tempus", regione: "Lombardia", indirizzo: "Via Como 34", tel: "031/645678" },
            { citta: "Fabriano", brand: "Tempus", regione: "Marche", indirizzo: "Piazza del Comune 8", tel: "0732/625789" },
            { citta: "Firenze", brand: "Tempus", regione: "Toscana", indirizzo: "Via Cavour 52", tel: "055/2345678" },
            { citta: "Gallarate", brand: "Tempus", regione: "Lombardia", indirizzo: "Corso Italia 89", tel: "0331/776543" },
            { citta: "Lainate", brand: "Tempus", regione: "Lombardia", indirizzo: "Via Milano 156", tel: "02/93570123" },
            { citta: "Latina", brand: "Tempus", regione: "Lazio", indirizzo: "Corso della Repubblica 45", tel: "0773/662345" },
            { citta: "Lecco", brand: "Tempus", regione: "Lombardia", indirizzo: "Via Amendola 32", tel: "0341/363456" },
            { citta: "Merate", brand: "Tempus", regione: "Lombardia", indirizzo: "Piazza Prinetti 5", tel: "039/9902345" },
            { citta: "Pomezia", brand: "Tempus", regione: "Lazio", indirizzo: "Via Pontina Vecchia 78", tel: "06/91195678" },
            { citta: "Verona", brand: "Tempus", regione: "Veneto", indirizzo: "Via Leoncino 23", tel: "045/8001234" },
            { citta: "Vigevano", brand: "Tempus", regione: "Lombardia", indirizzo: "Corso Cavour 67", tel: "0381/74523" },
            { citta: "Bari", brand: "Temporary", regione: "Puglia", indirizzo: "Via Sparano 128", tel: "080/5211234" },
            { citta: "Battipaglia", brand: "Temporary", regione: "Campania", indirizzo: "Via Roma 45", tel: "0828/301234" },
            { citta: "Bergamo", brand: "Temporary", regione: "Lombardia", indirizzo: "Via XX Settembre 78", tel: "035/237890" },
            { citta: "Brescia", brand: "Temporary", regione: "Lombardia", indirizzo: "Corso Zanardelli 34", tel: "030/2929345" },
            { citta: "Cuneo", brand: "Temporary", regione: "Piemonte", indirizzo: "Via Roma 12", tel: "0171/693456" },
            { citta: "Frosinone", brand: "Temporary", regione: "Lazio", indirizzo: "Viale Roma 234", tel: "0775/270123" },
            { citta: "Lecce", brand: "Temporary", regione: "Puglia", indirizzo: "Via Palmieri 67", tel: "0832/241234" },
            { citta: "Lodi", brand: "Temporary", regione: "Lombardia", indirizzo: "Corso Umberto I 23", tel: "0371/421345" },
            { citta: "Mestre", brand: "Temporary", regione: "Veneto", indirizzo: "Via Piave 45", tel: "041/951234" },
            { citta: "Milano Corsica", brand: "Temporary", regione: "Lombardia", indirizzo: "Via Pergolesi 8", tel: "02/454320" },
            { citta: "Milano Navigli", brand: "Temporary", regione: "Lombardia", indirizzo: "Ripa di Porta Ticinese 55", tel: "02/89401234" },
            { citta: "Milano Lecco", brand: "Temporary", regione: "Lombardia", indirizzo: "Via Lecco 23", tel: "02/26826789" },
            { citta: "Milano Monza", brand: "Temporary", regione: "Lombardia", indirizzo: "Viale Monza 140", tel: "02/26410345" },
            { citta: "Novara", brand: "Temporary", regione: "Piemonte", indirizzo: "Corso Cavour 12", tel: "0321/623456" },
            { citta: "Palermo", brand: "Temporary", regione: "Sicilia", indirizzo: "Via Libertà 189", tel: "091/6251234" },
            { citta: "Pavia", brand: "Temporary", regione: "Lombardia", indirizzo: "Corso Cavour 34", tel: "0382/530123" },
            { citta: "Piacenza", brand: "Temporary", regione: "Emilia-Romagna", indirizzo: "Via Roma 67", tel: "0523/334567" },
            { citta: "Torino", brand: "Temporary", regione: "Piemonte", indirizzo: "Via Giolitti 24/B", tel: "011/7640242" },
            { citta: "Voghera", brand: "Temporary", regione: "Lombardia", indirizzo: "Via Emilia 89", tel: "0383/368901" },
            { citta: "Genova", brand: "Temporary", regione: "Liguria", indirizzo: "Via XX Settembre 41", tel: "010/5701234" },
            { citta: "Bergamo", brand: "Tempor", regione: "Lombardia", indirizzo: "Via Nazario Sauro 2/D", tel: "035/249752" },
            { citta: "Bologna", brand: "Tempor", regione: "Emilia-Romagna", indirizzo: "Via Leonetto Cipriani 13", tel: "051/6810640" },
            { citta: "Cagliari", brand: "Tempor", regione: "Sardegna", indirizzo: "Viale Bonaria 56", tel: "070/3328707" },
            { citta: "Codroipo", brand: "Tempor", regione: "Friuli-Venezia Giulia", indirizzo: "Via Candotti 4", tel: "0432/1903230" },
            { citta: "Cosenza", brand: "Tempor", regione: "Calabria", indirizzo: "Via Pasquale Rossi 49", tel: "0984/414774" },
            { citta: "Crema", brand: "Tempor", regione: "Lombardia", indirizzo: "Via Cadorna 22", tel: "0373/476074" },
            { citta: "Frosinone", brand: "Tempor", regione: "Lazio", indirizzo: "Via Licinio Refice 24", tel: "0775/271112" },
            { citta: "Ivrea", brand: "Tempor", regione: "Piemonte", indirizzo: "Via Natalia Ginzburg 3/A", tel: "0125/642832" },
            { citta: "Latina", brand: "Tempor", regione: "Lazio", indirizzo: "Via Piave 829", tel: "0773/474268" },
            { citta: "La Spezia", brand: "Tempor", regione: "Liguria", indirizzo: "Via Giacomo Doria 53", tel: "0187/1866645" },
            { citta: "Lecce", brand: "Tempor", regione: "Puglia", indirizzo: "Via Manzoni 32/d", tel: "0832/279967" },
            { citta: "Melfi", brand: "Tempor", regione: "Basilicata", indirizzo: "Viale Aldo Moro 22", tel: "0972/086323" },
            { citta: "Modena", brand: "Tempor", regione: "Emilia-Romagna", indirizzo: "Via Divisione Acqui 137/b", tel: "059/370766" },
            { citta: "Olbia", brand: "Tempor", regione: "Sardegna", indirizzo: "Via Capotesta 1/50", tel: "345/8857504" },
            { citta: "Parma", brand: "Tempor", regione: "Emilia-Romagna", indirizzo: "Via Giovanni Lanfranco 9", tel: "0521/982777" },
            { citta: "Potenza", brand: "Tempor", regione: "Basilicata", indirizzo: "Corso Garibaldi 82", tel: "0971/274736" },
            { citta: "Rieti", brand: "Tempor", regione: "Lazio", indirizzo: "Piazza Vittorio Bachelet 27", tel: "0746/1973227" },
            { citta: "Roma", brand: "Tempor", regione: "Lazio", indirizzo: "Via Livorno 41/B", tel: "06/77208232" },
            { citta: "Salerno", brand: "Tempor", regione: "Campania", indirizzo: "Via S. Leonardo 52", tel: "089/2851172" },
            { citta: "Thiene", brand: "Tempor", regione: "Veneto", indirizzo: "Viale Europa 95", tel: "0445/1650997" },
            { citta: "Torino", brand: "Tempor", regione: "Piemonte", indirizzo: "Via Susa 40", tel: "011/5069446" },
            { citta: "Vasto", brand: "Tempor", regione: "Abruzzo", indirizzo: "Via Maddalena 63/b", tel: "0873/471100" },
            { citta: "Ancona", brand: "Lavorint", regione: "Marche", indirizzo: "Via Marconi 45", tel: "071/2071234" },
            { citta: "Ascoli Piceno", brand: "Lavorint", regione: "Marche", indirizzo: "Corso Mazzini 78", tel: "0736/253456" },
            { citta: "Avellino", brand: "Lavorint", regione: "Campania", indirizzo: "Corso Vittorio Emanuele II 101", tel: "0825/36789" },
            { citta: "Bari", brand: "Lavorint", regione: "Puglia", indirizzo: "Via Dante 134", tel: "080/5242345" },
            { citta: "Bergamo", brand: "Lavorint", regione: "Lombardia", indirizzo: "Via Paleocapa 23", tel: "035/242567" },
            { citta: "Biella", brand: "Lavorint", regione: "Piemonte", indirizzo: "Via Italia 56", tel: "015/8492345" },
            { citta: "Bologna", brand: "Lavorint", regione: "Emilia-Romagna", indirizzo: "Via Rizzoli 12", tel: "051/236789" },
            { citta: "Bra", brand: "Lavorint", regione: "Piemonte", indirizzo: "Via Vittorio Emanuele 34", tel: "0172/413456" },
            { citta: "Campobasso", brand: "Lavorint", regione: "Molise", indirizzo: "Corso Vittorio Emanuele 89", tel: "0874/91234" },
            { citta: "Canosa di Puglia", brand: "Lavorint", regione: "Puglia", indirizzo: "Via Roma 23", tel: "0883/661234" },
            { citta: "Carrara", brand: "Lavorint", regione: "Toscana", indirizzo: "Viale XX Settembre 45", tel: "0585/71234" },
            { citta: "Fidenza", brand: "Lavorint", regione: "Emilia-Romagna", indirizzo: "Via Berenini 12", tel: "0524/523456" },
            { citta: "Foligno", brand: "Lavorint", regione: "Umbria", indirizzo: "Via Mazzini 67", tel: "0742/340123" },
            { citta: "Genova", brand: "Lavorint", regione: "Liguria", indirizzo: "Via Fiume 34", tel: "010/5461234" },
            { citta: "Mantova", brand: "Lavorint", regione: "Lombardia", indirizzo: "Corso Vittorio Emanuele 45", tel: "0376/323456" },
            { citta: "Modena", brand: "Lavorint", regione: "Emilia-Romagna", indirizzo: "Via Emilia Centro 78", tel: "059/222345" },
            { citta: "Monselice", brand: "Lavorint", regione: "Veneto", indirizzo: "Via San Marco 23", tel: "0429/73456" },
            { citta: "Montecassiano", brand: "Lavorint", regione: "Marche", indirizzo: "Via Roma 12", tel: "0733/598123" },
            { citta: "Monza", brand: "Lavorint", regione: "Lombardia", indirizzo: "Via Eva Segre 3", tel: "039/2303456" },
            { citta: "Napoli", brand: "Lavorint", regione: "Campania", indirizzo: "Via Toledo 256", tel: "081/5521234" },
            { citta: "Padova", brand: "Lavorint", regione: "Veneto", indirizzo: "Via Roma 89", tel: "049/8761234" },
            { citta: "Parma", brand: "Lavorint", regione: "Emilia-Romagna", indirizzo: "Via della Repubblica 56", tel: "0521/234567" },
            { citta: "Perugia", brand: "Lavorint", regione: "Umbria", indirizzo: "Corso Vannucci 34", tel: "075/5721234" },
            { citta: "Pescara", brand: "Lavorint", regione: "Abruzzo", indirizzo: "Corso Umberto 123", tel: "085/4211234" },
            { citta: "Piombino", brand: "Lavorint", regione: "Toscana", indirizzo: "Via Roma 45", tel: "0565/221234" },
            { citta: "Reggio Emilia", brand: "Lavorint", regione: "Emilia-Romagna", indirizzo: "Via Emilia San Pietro 67", tel: "0522/431234" },
            { citta: "Roma", brand: "Lavorint", regione: "Lazio", indirizzo: "Via Nazionale 243", tel: "06/47821234" },
            { citta: "Teramo", brand: "Lavorint", regione: "Abruzzo", indirizzo: "Corso San Giorgio 78", tel: "0861/241234" },
            { citta: "Torino", brand: "Lavorint", regione: "Piemonte", indirizzo: "Via Garibaldi 45", tel: "011/5621234" }
        ];

        // State
        let conversationHistory = [];
        let isProcessing = false;
        let currentLanguage = 'it';
        let currentLanguageName = 'Italiano';
        let lastViewedJob = null;
        let isOpen = false;

        // Translations
        const translations = {
            'it': { placeholder: 'Scrivi un messaggio...', languageChanged: 'Perfetto! Da ora parlerò in italiano.', quickReplies: ['🔍 Cerco lavoro', '📍 Filiali vicine', '❓ Aiuto'] },
            'en': { placeholder: 'Type a message...', languageChanged: 'Perfect! From now I will speak English.', quickReplies: ['🔍 Find a job', '📍 Nearby branches', '❓ Help'] },
            'ro': { placeholder: 'Scrie un mesaj...', languageChanged: 'Perfect! De acum voi vorbi în română.', quickReplies: ['🔍 Caut un loc de muncă', '📍 Filiale apropiate', '❓ Ajutor'] },
            'uk': { placeholder: 'Напишіть повідомлення...', languageChanged: 'Чудово! Тепер я буду говорити українською.', quickReplies: ['🔍 Шукаю роботу', '📍 Найближчі філії', '❓ Допомога'] },
            'ar': { placeholder: 'اكتب رسالة...', languageChanged: 'ممتاز! من الآن سأتحدث بالعربية.', quickReplies: ['🔍 أبحث عن عمل', '📍 الفروع القريبة', '❓ مساعدة'] },
            'bn': { placeholder: 'একটি বার্তা লিখুন...', languageChanged: 'চমৎকার! এখন থেকে আমি বাংলায় কথা বলব।', quickReplies: ['🔍 চাকরি খুঁজছি', '📍 কাছের শাখা', '❓ সাহায্য'] },
            'sq': { placeholder: 'Shkruaj një mesazh...', languageChanged: 'Shkëlqyeshëm! Tani do të flas shqip.', quickReplies: ['🔍 Kërkoj punë', '📍 Degët e afërta', '❓ Ndihmë'] },
            'zh': { placeholder: '输入消息...', languageChanged: '好的！从现在开始我将用中文交流。', quickReplies: ['🔍 找工作', '📍 附近分店', '❓ 帮助'] }
        };

        // ==========================================
        // LOAD EXTERNAL DATA (optional - keeps embedded data as fallback)
        // ==========================================
        async function loadExternalData() {
            try {
                const [jobsResponse, filialiResponse] = await Promise.all([
                    fetch(basePath + 'data/jobs.json'),
                    fetch(basePath + 'data/filiali.json')
                ]);

                if (jobsResponse.ok && filialiResponse.ok) {
                    const externalJobs = await jobsResponse.json();
                    const externalFiliali = await filialiResponse.json();
                    // Only use external data if it loaded successfully and has content
                    if (externalJobs && externalJobs.length > 0) {
                        jobsData = externalJobs;
                        console.log('Ally: Loaded ' + jobsData.length + ' jobs from external file');
                    }
                    if (externalFiliali && externalFiliali.length > 0) {
                        filialiData = externalFiliali;
                        console.log('Ally: Loaded ' + filialiData.length + ' filiali from external file');
                    }
                }
            } catch (error) {
                console.log('Ally: Using embedded data (external fetch failed)');
                // Keep the embedded data - don't overwrite with empty arrays
            }
            console.log('Ally: Ready with ' + jobsData.length + ' jobs and ' + filialiData.length + ' filiali');
        }

        // ==========================================
        // PROACTIVE SYSTEM
        // ==========================================
        const proactiveBubble = document.getElementById('ally-proactive-bubble');
        const bubbleText = proactiveBubble.querySelector('.ally-bubble-text');
        const bubbleClose = proactiveBubble.querySelector('.ally-bubble-close');

        let proactiveTimer = null;
        let proactiveIndex = 0;
        let proactiveEnabled = true;
        let bubbleTimeout = null;

        // Analyze current page
        function analyzeCurrentPage() {
            const url = window.location.href.toLowerCase();
            const path = window.location.pathname.toLowerCase();
            const title = document.title.toLowerCase();
            const h1 = document.querySelector('h1')?.textContent?.toLowerCase() || '';

            // Detect page type
            let pageType = 'generic';
            let pageContext = {};

            // Homepage detection
            if (path === '/' || path === '/index.html' || path.includes('home')) {
                pageType = 'homepage';
            }
            // Job listings / Careers
            else if (path.includes('offert') || path.includes('lavoro') || path.includes('career') ||
                     path.includes('job') || path.includes('posizioni') || title.includes('offert')) {
                pageType = 'jobs';
            }
            // Single job detail
            else if (path.includes('dettaglio') || path.includes('detail') ||
                     url.includes('job-id') || url.includes('offerta-')) {
                pageType = 'job-detail';
            }
            // Branches / Filiali
            else if (path.includes('filial') || path.includes('branch') || path.includes('sedi') ||
                     title.includes('filial')) {
                pageType = 'branches';
            }
            // About us
            else if (path.includes('chi-siamo') || path.includes('about') || path.includes('azienda')) {
                pageType = 'about';
            }
            // Contact
            else if (path.includes('contatt') || path.includes('contact')) {
                pageType = 'contact';
            }
            // Services for companies
            else if (path.includes('aziend') || path.includes('serviz') || path.includes('business')) {
                pageType = 'b2b';
            }

            // Detect city mentions
            const cities = ['milano', 'roma', 'torino', 'bologna', 'napoli', 'firenze', 'venezia', 'genova', 'palermo', 'bari'];
            const foundCity = cities.find(city => url.includes(city) || title.includes(city) || h1.includes(city));
            if (foundCity) {
                pageContext.city = foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
            }

            // Detect job categories
            const categories = {
                'magazzin': 'magazziniere',
                'logistic': 'logistica',
                'operai': 'operaio',
                'produzion': 'produzione',
                'commess': 'commesso',
                'vendita': 'vendite',
                'retail': 'retail',
                'ristora': 'ristorazione',
                'camerie': 'cameriere',
                'impiegat': 'impiegato',
                'amministra': 'amministrazione'
            };

            for (const [key, value] of Object.entries(categories)) {
                if (url.includes(key) || title.includes(key) || h1.includes(key)) {
                    pageContext.category = value;
                    break;
                }
            }

            // Count jobs on page (if any)
            const jobCards = document.querySelectorAll('[class*="job"], [class*="offert"], [class*="position"]');
            if (jobCards.length > 0) {
                pageContext.jobCount = jobCards.length;
            }

            return { pageType, pageContext };
        }

        // Generate proactive messages based on user status
        function getProactiveMessages() {
            const { pageType, pageContext } = analyzeCurrentPage();
            const messages = [];

            if (isLoggedIn && userProfile) {
                // LOGGED IN: Personalized messages
                const userName = userProfile.nome || 'utente';

                switch (pageType) {
                    case 'homepage':
                        messages.push(
                            `Bentornato ${userName}! Novità per te oggi 🆕`,
                            `${userName}, nuove offerte nella tua zona!`,
                            `Ehi ${userName}! Ti serve una mano?`
                        );
                        if (userProfile.candidature && userProfile.candidature.length > 0) {
                            const colloqui = userProfile.candidature.filter(c => c.stato.includes('COLLOQUIO'));
                            if (colloqui.length > 0) {
                                messages.push(`${userName}, ricorda il colloquio! 📅`);
                            }
                        }
                        break;

                    case 'jobs':
                        messages.push(
                            `${userName}, quella in alto è perfetta per te! 👆`,
                            `Vedo che cerchi... quella l'hai già vista?`,
                            `Filtro per te ${userName}... un attimo!`
                        );
                        break;

                    case 'job-detail':
                        messages.push(
                            `Questa è nella tua zona ${userName}! 📍`,
                            `${userName}, vuoi che ti aiuti con la candidatura?`,
                            `Interessante vero? Ti preparo info 😊`
                        );
                        break;

                    case 'branches':
                        if (userProfile.filiale) {
                            messages.push(
                                `${userName}, la tua filiale è ${userProfile.filiale} 📍`,
                                `Vuoi fissare un appuntamento?`
                            );
                        }
                        break;

                    default:
                        messages.push(
                            `Ehi ${userName}! Ti serve aiuto?`,
                            `${userName}, nuove offerte per te! 👀`
                        );
                }

            } else {
                // NOT LOGGED IN: Generic messages
                switch (pageType) {
                    case 'homepage':
                        messages.push(
                            "Ehi! 👋 Ti serve una mano?",
                            "Bentornato! Hai già visto le offerte di oggi?",
                            "500+ opportunità ti aspettano! 😊",
                            "Cerchi lavoro vicino casa? Dimmi la tua città!"
                        );
                        break;

                    case 'jobs':
                        messages.push(
                            "Vedo che stai cercando... posso filtrare per te! 🔍",
                            "Troppe offerte? Ti aiuto a trovare quella giusta!",
                            "Psst... alcune di queste sono URGENTI! 🔥",
                            "Hai bisogno di info su un'offerta specifica?"
                        );
                        break;

                    case 'job-detail':
                        messages.push(
                            "Interessante questa offerta, vero? 👀",
                            "Hai dubbi? Posso darti più dettagli!",
                            "Ti aiuto con la candidatura? 📄"
                        );
                        break;

                    case 'branches':
                        messages.push(
                            "Cerchi la filiale più vicina? Dimmi dove sei! 📍",
                            "88 filiali in Italia... qual è la tua città?",
                            "Vuoi fissare un appuntamento in filiale?"
                        );
                        break;

                    case 'about':
                        messages.push(
                            "Curiosi di noi? Chiedimi quello che vuoi! 😊",
                            "25+ anni di esperienza!",
                            "13.000 persone lavorano con noi ogni giorno!"
                        );
                        break;

                    case 'contact':
                        messages.push(
                            "Vuoi contattarci? Posso aiutarti subito qui! ⚡",
                            "Rispondo più velocemente di un'email... provami! 😉"
                        );
                        break;

                    default:
                        messages.push(
                            "Ehi! 👋 Ti serve una mano?",
                            "Psst... hai domande? Sono qui!",
                            "500+ offerte attive oggi 👀",
                            "Cerchi lavoro? Posso aiutarti! 😊"
                        );
                }
            }

            // Add city-specific messages
            if (pageContext.city && jobsData.length > 0) {
                const cityJobs = jobsData.filter(j => j.city && j.city.toLowerCase() === pageContext.city.toLowerCase());
                if (cityJobs.length > 0) {
                    messages.push(`${pageContext.city}! 📍 Ho ${cityJobs.length} offerte lì!`);
                }
            }

            // Add category-specific messages
            if (pageContext.category) {
                messages.push(`Interessato a ${pageContext.category}? Ho offerte fresche! 🆕`);
            }

            return messages;
        }

        // Show proactive bubble
        function showProactiveBubble(message) {
            if (!proactiveEnabled || isOpen) return;

            bubbleText.textContent = message;
            proactiveBubble.classList.add('ally-bubble-visible');
            toggleBtn.classList.add('ally-attention', 'ally-has-message');

            setTimeout(() => {
                toggleBtn.classList.remove('ally-attention');
            }, 600);

            clearTimeout(bubbleTimeout);
            bubbleTimeout = setTimeout(() => {
                hideProactiveBubble();
            }, 6000);
        }

        // Generate smart proactive message with GPT
        async function generateSmartProactiveMessage() {
            if (OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
                return null; // Skip GPT if no API key
            }

            const { pageType, pageContext } = analyzeCurrentPage();
            const pageTitle = document.title;
            const h1Text = document.querySelector('h1')?.textContent || '';

            let userContext = '';
            if (isLoggedIn && userProfile) {
                userContext = `\nUtente loggato: ${userProfile.nome || 'utente'}, cerca lavoro in ${userProfile.citta || 'Italia'}`;
            }

            const contextInfo = `
Pagina: ${pageType}
Titolo: ${pageTitle}
H1: ${h1Text}
${pageContext.city ? `Città rilevata: ${pageContext.city}` : ''}
${pageContext.category ? `Categoria lavoro: ${pageContext.category}` : ''}
${pageContext.jobCount ? `Numero offerte visibili: ${pageContext.jobCount}` : ''}
${userContext}`.trim();

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: `Sei Ally, assistente chatbot di ATTAL Group (agenzia lavoro).
Devi scrivere UN SOLO messaggio breve (max 60 caratteri) per una bubble proattiva.
Obiettivo: incuriosire l'utente e farlo cliccare.
Tono: amichevole, diretto, un po' spiritoso. Usa 1 emoji max.
${isLoggedIn ? 'Personalizza il messaggio per l\'utente loggato.' : 'Messaggio generico per utente non loggato.'}
Esempi: "Ehi, quella offerta è urgente 👀", "Posso aiutarti a cercare?", "88 filiali... una è vicina a te"`
                            },
                            {
                                role: 'user',
                                content: `Genera un messaggio proattivo per questa situazione:\n${contextInfo}`
                            }
                        ],
                        temperature: 0.9,
                        max_tokens: 50
                    })
                });

                const data = await response.json();
                return data.choices[0].message.content.replace(/"/g, '').trim();
            } catch (error) {
                console.error('Ally proactive GPT error:', error);
                return null;
            }
        }

        // Hide proactive bubble
        function hideProactiveBubble() {
            proactiveBubble.classList.remove('ally-bubble-visible');
            toggleBtn.classList.remove('ally-has-message');
            clearTimeout(bubbleTimeout);
        }

        // Close bubble on X click
        bubbleClose.addEventListener('click', (e) => {
            e.stopPropagation();
            hideProactiveBubble();
            proactiveEnabled = false;
            setTimeout(() => { proactiveEnabled = true; }, 60000);
        });

        // Click on bubble opens chat
        proactiveBubble.addEventListener('click', (e) => {
            if (e.target !== bubbleClose) {
                hideProactiveBubble();
                toggleBtn.click();
            }
        });

        // Start proactive system
        function startProactiveSystem() {
            const messages = getProactiveMessages();

            setTimeout(() => {
                if (!isOpen && proactiveEnabled && messages[0]) {
                    showProactiveBubble(messages[0]);
                    proactiveIndex = 1;
                }
            }, 5000);

            setTimeout(async () => {
                if (!isOpen && proactiveEnabled) {
                    const smartMessage = await generateSmartProactiveMessage();
                    if (smartMessage) {
                        showProactiveBubble(smartMessage);
                    } else if (messages[1]) {
                        showProactiveBubble(messages[1]);
                    }
                    proactiveIndex = 2;
                }
            }, 20000);

            proactiveTimer = setInterval(async () => {
                if (!isOpen && proactiveEnabled) {
                    const refreshedMessages = getProactiveMessages();
                    if (proactiveIndex % 2 === 0) {
                        const smartMessage = await generateSmartProactiveMessage();
                        if (smartMessage) {
                            showProactiveBubble(smartMessage);
                        } else if (refreshedMessages[proactiveIndex % refreshedMessages.length]) {
                            showProactiveBubble(refreshedMessages[proactiveIndex % refreshedMessages.length]);
                        }
                    } else {
                        if (refreshedMessages[proactiveIndex % refreshedMessages.length]) {
                            showProactiveBubble(refreshedMessages[proactiveIndex % refreshedMessages.length]);
                        }
                    }
                    proactiveIndex++;
                }
            }, 30000 + Math.random() * 10000);
        }

        // Stop proactive when chat opens
        function stopProactiveSystem() {
            hideProactiveBubble();
            clearInterval(proactiveTimer);
        }

        // ==========================================
        // DOM Elements
        // ==========================================
        const toggleBtn = document.getElementById('ally-toggle-btn');
        const chatWindow = document.getElementById('ally-chat-window');
        const messagesContainer = document.getElementById('ally-messages');
        const input = document.getElementById('ally-input');
        const sendBtn = document.getElementById('ally-send-btn');
        const langBtns = document.querySelectorAll('.ally-lang-btn');

        // Toggle chat
        toggleBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            chatWindow.classList.toggle('ally-visible', isOpen);
            toggleBtn.classList.toggle('ally-open', isOpen);

            if (isOpen) {
                stopProactiveSystem();
            }

            if (isOpen && messagesContainer.children.length === 0) {
                setTimeout(() => {
                    const welcomeMessage = getWelcomeMessage();
                    const quickReplies = getWelcomeQuickReplies();
                    addMessage(welcomeMessage, true, quickReplies);
                }, 300);
            }
        });

        // Get welcome message based on user status
        function getWelcomeMessage() {
            if (isLoggedIn && userProfile) {
                const nome = userProfile.nome || 'utente';
                let message = `Ciao ${nome}! 👋\n\n`;

                // Check for upcoming appointments
                if (userProfile.candidature && userProfile.candidature.length > 0) {
                    const colloqui = userProfile.candidature.filter(c => c.stato && c.stato.includes('COLLOQUIO'));
                    if (colloqui.length > 0) {
                        message += `Pronto per il colloquio ${colloqui[0].offerta}?\n\n`;
                    }
                }

                message += `Ho **nuove offerte** perfette per te!`;

                // Check for expiring documents
                if (userProfile.scadenze && userProfile.scadenze.length > 0) {
                    message += `\n\nPS: Il tuo ${userProfile.scadenze[0].tipo} scade ${userProfile.scadenze[0].scadenza}!`;
                }

                return message;
            } else {
                return `Ehi! 👋 Sono Ally, la tua alleata per trovare lavoro.\n\nHo **500+ offerte** pronte per te. Dimmi, cosa stai cercando?`;
            }
        }

        // Get welcome quick replies based on user status
        function getWelcomeQuickReplies() {
            if (isLoggedIn && userProfile) {
                return ['🆕 Nuove offerte', '📅 Miei colloqui', '📍 Filiali'];
            } else {
                return translations[currentLanguage].quickReplies;
            }
        }

        // Language selection
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                langBtns.forEach(b => b.classList.remove('ally-lang-active'));
                btn.classList.add('ally-lang-active');
                currentLanguage = btn.dataset.lang;
                currentLanguageName = btn.dataset.name;
                input.placeholder = translations[currentLanguage]?.placeholder || 'Scrivi un messaggio...';
                addMessage(translations[currentLanguage]?.languageChanged || 'Language changed.', true, translations[currentLanguage]?.quickReplies);
            });
        });

        // Send message
        function sendMessage() {
            if (isProcessing) return;
            const message = input.value.trim();
            if (!message) return;

            isProcessing = true;
            sendBtn.disabled = true;
            addMessage(message, false);
            input.value = '';

            showTyping();
            handleBotResponse(message);
        }

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Add message to chat
        function addMessage(content, isBot, quickReplies = null) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `ally-message ${isBot ? 'ally-bot' : 'ally-user'}`;

            let formattedContent = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            messageDiv.innerHTML = `<div class="ally-message-content">${formattedContent}</div>`;
            messagesContainer.appendChild(messageDiv);

            if (quickReplies && quickReplies.length > 0) {
                const qrDiv = document.createElement('div');
                qrDiv.className = 'ally-quick-replies';
                quickReplies.forEach(reply => {
                    const btn = document.createElement('button');
                    btn.className = 'ally-quick-reply';
                    btn.textContent = reply;
                    btn.onclick = () => {
                        addMessage(reply, false);
                        showTyping();
                        handleBotResponse(reply);
                    };
                    qrDiv.appendChild(btn);
                });
                messagesContainer.appendChild(qrDiv);
            }

            scrollToBottom();
        }

        // Add job card
        function addJobCard(job) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'ally-job-card';
            cardDiv.innerHTML = `
                <div class="ally-job-card-header">
                    <div class="ally-job-card-title">${job.title}</div>
                    <div class="ally-job-card-badge">${job.badge === 'urgent' ? '🔥 URGENTE' : job.badge === 'top' ? '⭐ TOP' : '💰 RAL'}</div>
                </div>
                <div class="ally-job-card-meta">
                    <span>📍 ${job.city}</span>
                    <span>⏰ ${job.time}</span>
                    <span>📄 ${job.contract}</span>
                </div>
                <div class="ally-job-card-salary">€${job.salary}/mese</div>
                <a href="#" class="ally-job-card-cta" onclick="return false;">Vedi dettagli →</a>
            `;
            cardDiv.querySelector('.ally-job-card-cta').onclick = (e) => {
                e.preventDefault();
                showJobDetails(job);
            };
            messagesContainer.appendChild(cardDiv);
            scrollToBottom();
        }

        // Add filiale card
        function addFilialeCard(filiale) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'ally-filiale-card';
            cardDiv.innerHTML = `
                <div class="ally-filiale-card-header">📍 ${filiale.citta} (${filiale.brand})</div>
                <div class="ally-filiale-card-info">
                    <div>📌 ${filiale.indirizzo}</div>
                    <div>📞 <a href="tel:${filiale.tel.replace(/\//g, '')}">${filiale.tel}</a></div>
                    <div>🕐 Lun-Ven 9:00-18:00</div>
                </div>
            `;
            messagesContainer.appendChild(cardDiv);
            scrollToBottom();
        }

        // Show job details
        function showJobDetails(job) {
            lastViewedJob = job;
            const detailsHtml = `**${job.title}** - ${job.city}

📍 ${job.location}
💰 €${job.salary}/mese
📄 ${job.contract}

**Descrizione:**
${job.description}

**Requisiti:**
${job.requirements.map(r => '• ' + r).join('\n')}

**Cosa offriamo:**
${job.benefits.map(b => '• ' + b).join('\n')}

📞 **Filiale:** ${job.branch}
Tel: ${job.phone}`;

            addMessage(detailsHtml, true, ['📄 Candidati ora', '🔍 Altre offerte']);
        }

        // Show typing indicator
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'ally-typing';
            typingDiv.id = 'ally-typing';
            typingDiv.innerHTML = `
                <div class="ally-typing-bubble">
                    <div class="ally-typing-dot"></div>
                    <div class="ally-typing-dot"></div>
                    <div class="ally-typing-dot"></div>
                </div>
            `;
            messagesContainer.appendChild(typingDiv);
            scrollToBottom();
        }

        function hideTyping() {
            const typing = document.getElementById('ally-typing');
            if (typing) typing.remove();
        }

        function scrollToBottom() {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // System prompt generation
        function getSystemPrompt() {
            const langInstruction = currentLanguage !== 'it'
                ? `\n\n🌍 LINGUA: ${currentLanguageName}. Rispondi SOLO in ${currentLanguageName}.`
                : '';

            let systemPrompt = `# CHI È ALLY\n`;

            if (isLoggedIn && userProfile) {
                // LOGGED IN: Personalized prompt with user profile
                systemPrompt += `Sei Ally, assistente PERSONALE di ${userProfile.nome || 'questo utente'} su ATTAL Group. Lo conosci, sai cosa cerca, e lo aiuti in modo proattivo.
${langInstruction}

## COME PARLI
- Frasi CORTE. Max 15 parole per frase.
- Chiama l'utente per nome (${userProfile.nome || 'utente'})
- Sei proattiva: suggerisci, non aspetti
- Emoji con gusto (2-3 max)
- Tono amichevole ma professionale

## PROFILO UTENTE
Nome: ${userProfile.nome || 'N/D'} ${userProfile.cognome || ''}
Email: ${userProfile.email || 'N/D'}
Città: ${userProfile.citta || 'N/D'}${userProfile.zona ? ` (${userProfile.zona})` : ''}
Età: ${userProfile.eta || 'N/D'}

### COMPETENZE
${userProfile.competenze ? userProfile.competenze.map(c => `- ${c}`).join('\n') : '- Nessuna competenza registrata'}

### ESPERIENZA
${userProfile.esperienza ? userProfile.esperienza.map(e => `- ${e.ruolo} presso ${e.azienda} (${e.anni})`).join('\n') : '- Nessuna esperienza registrata'}

### PREFERENZE
${userProfile.preferenze ? `
- Settori preferiti: ${userProfile.preferenze.settori?.join(', ') || 'N/D'}
- Zona: ${userProfile.preferenze.zona || 'N/D'}
- RAL desiderata: €${userProfile.preferenze.ralDesiderata || 'N/D'}/mese
- Disponibilità: ${userProfile.preferenze.disponibilita || 'N/D'}
- Turni: ${userProfile.preferenze.turni ? 'Sì' : 'No'}
` : '- Nessuna preferenza registrata'}

### CANDIDATURE ATTIVE
${userProfile.candidature ? userProfile.candidature.map(c => `- ${c.data}: ${c.offerta} - ${c.stato}`).join('\n') : '- Nessuna candidatura attiva'}

### FILIALE DI RIFERIMENTO
${userProfile.filiale || 'Non assegnata'}

### SCADENZE IMPORTANTI
${userProfile.scadenze ? userProfile.scadenze.map(s => `- ${s.tipo}: scade ${s.scadenza}`).join('\n') : '- Nessuna scadenza'}

## COME COMPORTARTI
1. **Sii proattiva**: suggerisci offerte e azioni
2. **Ricorda gli obiettivi**: aiutalo a trovare lavoro adatto
3. **Avvisa scadenze**: documenti, colloqui, corsi
4. **Personalizza**: usa il profilo per consigliare meglio`;

            } else {
                // NOT LOGGED IN: Generic prompt
                systemPrompt += `Sei Ally, assistente di ATTAL Group. Sei diretta, curiosa, incoraggiante e un po' ironica.
${langInstruction}

## COME PARLI
- Frasi CORTE. Max 15 parole per frase.
- Fai DOMANDE. Vuoi capire cosa cerca l'utente.
- Emoji con gusto (2-3 max)
- Mai formale, mai burocratico`;
            }

            // Common data for both logged and not logged
            systemPrompt += `

## DATI ATTAL
- 88 filiali in Italia
- 13.000+ persone al lavoro
- 500+ offerte attive
- Ti richiamano entro 48 ore

## DATABASE OFFERTE
${JSON.stringify(jobsData, null, 2)}

## DATABASE FILIALI
${JSON.stringify(filialiData, null, 2)}

## FORMATO RISPOSTA
Quando mostri offerte: {"showJobs": [1, 2]}
Quando mostri filiali: {"showFiliali": ["Milano", "Roma"]}
Quick replies: {"quickReplies": ["Opzione 1", "Opzione 2"]}`;

            return systemPrompt;
        }

        // Call GPT
        async function callGPT(userMessage) {
            if (OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
                return "Mi dispiace, la chat GPT non è configurata. Per favore contatta il 02/454320.";
            }

            conversationHistory.push({ role: 'user', content: userMessage });

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: getSystemPrompt() },
                            ...conversationHistory.slice(-10)
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    })
                });

                const data = await response.json();
                const assistantMessage = data.choices[0].message.content;
                conversationHistory.push({ role: 'assistant', content: assistantMessage });
                return assistantMessage;

            } catch (error) {
                console.error('Ally API Error:', error);
                return "Mi dispiace, c'è stato un problema. Prova a riscrivere o chiama il 02/454320.";
            }
        }

        // Parse GPT response
        function parseGPTResponse(response) {
            let textContent = response;
            let showJobs = [];
            let showFiliali = [];
            let quickReplies = [];

            const jsonMatch = response.match(/\{[^{}]*\}/g);
            if (jsonMatch) {
                jsonMatch.forEach(jsonStr => {
                    try {
                        const parsed = JSON.parse(jsonStr);
                        if (parsed.showJobs) showJobs = parsed.showJobs;
                        if (parsed.showFiliali) showFiliali = parsed.showFiliali;
                        if (parsed.quickReplies) quickReplies = parsed.quickReplies;
                        textContent = textContent.replace(jsonStr, '').trim();
                    } catch (e) {
                        // Ignore parse errors
                    }
                });
            }

            return { textContent, showJobs, showFiliali, quickReplies };
        }

        // Handle bot response
        async function handleBotResponse(userMessage) {
            const gptResponse = await callGPT(userMessage);
            const { textContent, showJobs, showFiliali, quickReplies } = parseGPTResponse(gptResponse);

            hideTyping();
            addMessage(textContent, true, quickReplies.length > 0 ? quickReplies : null);

            showJobs.forEach(jobId => {
                const job = jobsData.find(j => j.id === jobId);
                if (job) addJobCard(job);
            });

            showFiliali.forEach(citta => {
                const filiale = filialiData.find(f => f.citta && f.citta.toLowerCase().includes(citta.toLowerCase()));
                if (filiale) addFilialeCard(filiale);
            });

            isProcessing = false;
            sendBtn.disabled = false;
        }

        // ==========================================
        // INITIALIZATION
        // ==========================================
        loadExternalData().then(() => {
            startProactiveSystem();
        });
    }

    // ==========================================
    // INJECT WIDGET ON DOM READY
    // ==========================================
    function injectWidget() {
        // Check if widget already exists
        const existingWidget = document.getElementById('ally-widget-container');
        if (existingWidget) {
            existingWidget.remove();
        }

        const container = document.createElement('div');
        container.innerHTML = widgetHTML;
        document.body.appendChild(container.firstElementChild);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWidget);
    } else {
        injectWidget();
    }

    // ==========================================
    // EXPOSE GLOBALLY
    // ==========================================
    // Funzione wrapper che re-inietta il widget prima di inizializzare
    window.initializeAlly = function(config) {
        injectWidget();
        initializeAlly(config);
    };

})();
