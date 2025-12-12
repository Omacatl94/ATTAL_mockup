// Netlify serverless function - proxy per Google Places API
exports.handler = async (event, context) => {
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (!GOOGLE_API_KEY) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY non configurata' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { action, query, placeId } = body;

        let url;

        if (action === 'findPlace') {
            // Cerca place_id da query
            url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name&key=${GOOGLE_API_KEY}`;
        } else if (action === 'details') {
            // Ottieni dettagli da place_id
            url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,rating,user_ratings_total,opening_hours,geometry,website&key=${GOOGLE_API_KEY}&language=it`;
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Azione non valida. Usa "findPlace" o "details"' })
            };
        }

        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
