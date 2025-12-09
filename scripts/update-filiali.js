/**
 * Script per aggiornare filiali.json con dati da Google Places API
 *
 * Esegui con: node scripts/update-filiali.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyBt-NDwrCfTmB18n7fbX3Vz-fqtEvTZP7w';

// Dati corretti delle filiali (nome società + località per la ricerca)
const filialiInput = [
    // LAVORINT
    { searchName: "Lavorint Spa - Filiale di Ancona", searchLocation: "Ancona", brand: "Lavorint" },
    { searchName: "Lavorint S.p.a", searchLocation: "Ascoli Piceno", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Avellino", searchLocation: "Avellino", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Bari", searchLocation: "Bari", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Bergamo", searchLocation: "Bergamo", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Biella", searchLocation: "Biella", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Bologna", searchLocation: "Bologna", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Bra", searchLocation: "Bra", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Campobasso", searchLocation: "Campobasso", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Canosa", searchLocation: "Canosa di Puglia", brand: "Lavorint" },
    { searchName: "Lavorint Spa", searchLocation: "Carrara", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Fidenza", searchLocation: "Fidenza", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Foligno", searchLocation: "Foligno", brand: "Lavorint" },
    { searchName: "Lavorint SpA - Filiale di Genova", searchLocation: "Genova", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Mantova", searchLocation: "Mantova", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Modena", searchLocation: "Modena", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Monselice", searchLocation: "Monselice", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Montecassiano", searchLocation: "Montecassiano", brand: "Lavorint" },
    { searchName: "Lavorint SpA - Filiale di Monza", searchLocation: "Via Eva Segre', 3, 20900 Monza MB", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Napoli", searchLocation: "Napoli", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Padova", searchLocation: "Padova", brand: "Lavorint" },
    { searchName: "Lavorint", searchLocation: "Parma", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Perugia", searchLocation: "Perugia", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Pescara", searchLocation: "Pescara", brand: "Lavorint" },
    { searchName: "Lavorint S.p.a", searchLocation: "Piombino", brand: "Lavorint" },
    { searchName: "Lavorint spa", searchLocation: "Reggio Emilia", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Roma", searchLocation: "Roma", brand: "Lavorint" },
    { searchName: "Lavorint S.p.a", searchLocation: "Teramo", brand: "Lavorint" },
    { searchName: "Lavorint Spa - Filiale di Torino", searchLocation: "Torino", brand: "Lavorint" },

    // TEMPOR
    { searchName: "Tempor S.P.A. Agenzia Per Il Lavoro", searchLocation: "Bergamo", brand: "Tempor" },
    { searchName: "Tempor", searchLocation: "Via Leonetto Cipriani, 13, 40131 Bologna BO", brand: "Tempor" },
    { searchName: "Tempor S.p.a.", searchLocation: "Cagliari", brand: "Tempor" },
    { searchName: "Tempor SpA", searchLocation: "Via Giovanni Battista Candotti, 4, 33033 Codroipo UD", brand: "Tempor" },
    { searchName: "Tempor S.P.A. Cosenza", searchLocation: "Cosenza", brand: "Tempor" },
    { searchName: "Tempor", searchLocation: "Crema Via Luigi Cadorna", brand: "Tempor" },
    { searchName: "Tempor S.p.a. Agenzia Per Il Lavoro", searchLocation: "Frosinone", brand: "Tempor" },
    { searchName: "Tempor", searchLocation: "Ivrea", brand: "Tempor" },
    { searchName: "Tempor S.P.A. Agenzia Per Il Lavoro Filiale Latina", searchLocation: "Latina", brand: "Tempor" },
    { searchName: "Tempor S.P.A. Agenzia per il Lavoro Filiale di La Spezia", searchLocation: "La Spezia", brand: "Tempor" },
    { searchName: "Tempor Spa Agenzia Per Il Lavoro", searchLocation: "Lecce", brand: "Tempor" },
    { searchName: "Tempor S.p.a. Agenzia Per Il Lavoro", searchLocation: "Melfi", brand: "Tempor" },
    { searchName: "Tempor S.p.a. Agenzia Per Il Lavoro", searchLocation: "Modena", brand: "Tempor" },
    { searchName: "Tempor S.P.A - Filiale di Olbia", searchLocation: "Via Capotesta, 1, 07026 Olbia SS", brand: "Tempor" },
    { searchName: "Tempor", searchLocation: "Parma", brand: "Tempor" },
    { searchName: "Tempor S.p.a. Agenzia Per Il Lavoro", searchLocation: "Corso G. Garibaldi, 82, 85100 Potenza PZ", brand: "Tempor" },
    { searchName: "Tempor", searchLocation: "Rieti", brand: "Tempor" },
    { searchName: "Tempor - Agenzia per il Lavoro", searchLocation: "Roma", brand: "Tempor" },
    { searchName: "Tempor S.P.A. Agenzia Per Il Lavoro", searchLocation: "Salerno", brand: "Tempor" },
    { searchName: "Tempor SpA", searchLocation: "Thiene", brand: "Tempor" },
    { searchName: "Tempor", searchLocation: "Torino", brand: "Tempor" },
    { searchName: "Tempor S.P.A. Agenzia per il Lavoro", searchLocation: "b, Via Maddalena, 63, 66054 Vasto CH", brand: "Tempor" },

    // TEMPORARY
    { searchName: "Temporary Spa", searchLocation: "Bari", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Battipaglia", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Bergamo", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Brescia", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Cuneo", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Frosinone", brand: "Temporary" },
    { searchName: "Temporary Agenzia per il lavoro", searchLocation: "Lecce", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Lodi", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Mestre", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Milano Corsica", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Milano Navigli", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Via Lecco Milano", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Viale Monza Milano", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Cameri", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Palermo", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Pavia", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Piacenza", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Torino", brand: "Temporary" },
    { searchName: "Temporary Spa", searchLocation: "Voghera", brand: "Temporary" },

    // TEMPUS
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Acqui Terme", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Albenga", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Alessandria", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Bassano del Grappa", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Cinisello Balsamo", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Cornaredo", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Erba", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Fabriano", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Firenze", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Gallarate", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Lainate", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Latina", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Lecco", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Merate", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Pomezia", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Verona", brand: "Tempus" },
    { searchName: "TeMPus Agenzia per il Lavoro", searchLocation: "Vigevano", brand: "Tempus" },
];

// Funzione per delay (evitare rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Trova place_id
async function getPlaceId(name, location) {
    const input = encodeURIComponent(`${name} ${location}`);
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&fields=place_id&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
        return data.candidates[0].place_id;
    }
    return null;
}

// Ottieni dettagli dal place_id
async function getPlaceDetails(placeId) {
    const fields = 'name,formatted_address,formatted_phone_number,rating,user_ratings_total,opening_hours,geometry,website';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}&language=it`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.result) {
        return data.result;
    }
    return null;
}

// Estrai città dall'indirizzo
function extractCity(address, searchLocation) {
    // Prova a estrarre la città dall'indirizzo formattato
    // Formato tipico: "Via XYZ, 00000 Città Province, Italy"
    const parts = address.split(',');
    if (parts.length >= 2) {
        const cityPart = parts[parts.length - 2].trim();
        // Rimuovi il CAP se presente
        const cityMatch = cityPart.match(/\d{5}\s+(.+)/);
        if (cityMatch) {
            return cityMatch[1].replace(/\s+[A-Z]{2}$/, '').trim();
        }
        return cityPart.replace(/\s+[A-Z]{2}$/, '').trim();
    }
    // Fallback: usa la località di ricerca
    return searchLocation.split(',')[0].trim();
}

// Estrai regione dalla provincia
function getRegione(address) {
    const regioniMap = {
        'AL': 'Piemonte', 'AT': 'Piemonte', 'BI': 'Piemonte', 'CN': 'Piemonte', 'NO': 'Piemonte', 'TO': 'Piemonte', 'VB': 'Piemonte', 'VC': 'Piemonte',
        'AO': "Valle d'Aosta",
        'BG': 'Lombardia', 'BS': 'Lombardia', 'CO': 'Lombardia', 'CR': 'Lombardia', 'LC': 'Lombardia', 'LO': 'Lombardia', 'MB': 'Lombardia', 'MI': 'Lombardia', 'MN': 'Lombardia', 'PV': 'Lombardia', 'SO': 'Lombardia', 'VA': 'Lombardia',
        'BZ': 'Trentino-Alto Adige', 'TN': 'Trentino-Alto Adige',
        'BL': 'Veneto', 'PD': 'Veneto', 'RO': 'Veneto', 'TV': 'Veneto', 'VE': 'Veneto', 'VI': 'Veneto', 'VR': 'Veneto',
        'GO': 'Friuli-Venezia Giulia', 'PN': 'Friuli-Venezia Giulia', 'TS': 'Friuli-Venezia Giulia', 'UD': 'Friuli-Venezia Giulia',
        'GE': 'Liguria', 'IM': 'Liguria', 'SP': 'Liguria', 'SV': 'Liguria',
        'BO': 'Emilia-Romagna', 'FC': 'Emilia-Romagna', 'FE': 'Emilia-Romagna', 'MO': 'Emilia-Romagna', 'PC': 'Emilia-Romagna', 'PR': 'Emilia-Romagna', 'RA': 'Emilia-Romagna', 'RE': 'Emilia-Romagna', 'RN': 'Emilia-Romagna',
        'AR': 'Toscana', 'FI': 'Toscana', 'GR': 'Toscana', 'LI': 'Toscana', 'LU': 'Toscana', 'MS': 'Toscana', 'PI': 'Toscana', 'PO': 'Toscana', 'PT': 'Toscana', 'SI': 'Toscana',
        'PG': 'Umbria', 'TR': 'Umbria',
        'AN': 'Marche', 'AP': 'Marche', 'FM': 'Marche', 'MC': 'Marche', 'PU': 'Marche',
        'FR': 'Lazio', 'LT': 'Lazio', 'RI': 'Lazio', 'RM': 'Lazio', 'VT': 'Lazio',
        'AQ': 'Abruzzo', 'CH': 'Abruzzo', 'PE': 'Abruzzo', 'TE': 'Abruzzo',
        'CB': 'Molise', 'IS': 'Molise',
        'AV': 'Campania', 'BN': 'Campania', 'CE': 'Campania', 'NA': 'Campania', 'SA': 'Campania',
        'BA': 'Puglia', 'BT': 'Puglia', 'BR': 'Puglia', 'FG': 'Puglia', 'LE': 'Puglia', 'TA': 'Puglia',
        'MT': 'Basilicata', 'PZ': 'Basilicata',
        'CS': 'Calabria', 'CZ': 'Calabria', 'KR': 'Calabria', 'RC': 'Calabria', 'VV': 'Calabria',
        'AG': 'Sicilia', 'CL': 'Sicilia', 'CT': 'Sicilia', 'EN': 'Sicilia', 'ME': 'Sicilia', 'PA': 'Sicilia', 'RG': 'Sicilia', 'SR': 'Sicilia', 'TP': 'Sicilia',
        'CA': 'Sardegna', 'NU': 'Sardegna', 'OR': 'Sardegna', 'SS': 'Sardegna', 'SU': 'Sardegna'
    };

    // Cerca la sigla provincia nell'indirizzo
    const match = address.match(/\b([A-Z]{2})\b(?=,|\s|$)/g);
    if (match) {
        for (const prov of match) {
            if (regioniMap[prov]) {
                return regioniMap[prov];
            }
        }
    }
    return '';
}

// Main
async function main() {
    console.log('🚀 Inizio aggiornamento filiali...\n');

    const filiali = [];
    let success = 0;
    let failed = 0;

    for (let i = 0; i < filialiInput.length; i++) {
        const filiale = filialiInput[i];
        console.log(`[${i + 1}/${filialiInput.length}] Cercando: ${filiale.searchName} - ${filiale.searchLocation}`);

        try {
            // Trova place_id
            const placeId = await getPlaceId(filiale.searchName, filiale.searchLocation);

            if (!placeId) {
                console.log(`   ❌ Place ID non trovato`);
                failed++;
                continue;
            }

            // Ottieni dettagli
            await delay(200); // Evita rate limiting
            const details = await getPlaceDetails(placeId);

            if (!details) {
                console.log(`   ❌ Dettagli non trovati`);
                failed++;
                continue;
            }

            // Costruisci oggetto filiale
            const nuovaFiliale = {
                citta: extractCity(details.formatted_address || '', filiale.searchLocation),
                brand: filiale.brand,
                regione: getRegione(details.formatted_address || ''),
                indirizzo: details.formatted_address ? details.formatted_address.replace(/, Italy$/, '').replace(/, Italia$/, '') : '',
                tel: details.formatted_phone_number || '',
                rating: details.rating || null,
                reviews: details.user_ratings_total || 0,
                orari: details.opening_hours?.weekday_text || [],
                lat: details.geometry?.location?.lat || null,
                lng: details.geometry?.location?.lng || null,
                place_id: placeId,
                website: details.website || ''
            };

            filiali.push(nuovaFiliale);
            console.log(`   ✅ ${nuovaFiliale.citta} - Rating: ${nuovaFiliale.rating || 'N/A'} (${nuovaFiliale.reviews} recensioni)`);
            success++;

        } catch (error) {
            console.log(`   ❌ Errore: ${error.message}`);
            failed++;
        }

        await delay(300); // Delay tra le richieste
    }

    // Ordina per brand e città
    filiali.sort((a, b) => {
        if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
        return a.citta.localeCompare(b.citta);
    });

    // Salva il file
    const outputPath = path.join(__dirname, '..', 'assets', 'data', 'filiali.json');
    fs.writeFileSync(outputPath, JSON.stringify(filiali, null, 2), 'utf8');

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Completato! ${success} filiali aggiornate`);
    console.log(`❌ ${failed} filiali non trovate`);
    console.log(`📁 File salvato: ${outputPath}`);
}

main().catch(console.error);
