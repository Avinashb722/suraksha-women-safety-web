// Real data sources for unsafe areas

// 1. POLICE DATA SOURCES
const policeDataSources = {
    // India Police APIs
    ncrb: {
        name: 'National Crime Records Bureau',
        url: 'https://ncrb.gov.in/en/crime-in-india-table-additional-table-and-chapter-contents',
        type: 'official',
        dataFormat: 'JSON/CSV',
        access: 'Public datasets, RTI requests'
    },
    
    delhiPolice: {
        name: 'Delhi Police Crime Mapping',
        url: 'https://delhipolice.gov.in/',
        type: 'regional',
        access: 'Contact: dcp-it@delhipolice.gov.in'
    },
    
    mumbaiPolice: {
        name: 'Mumbai Police',
        url: 'https://mumbaipolice.maharashtra.gov.in/',
        type: 'regional',
        contact: 'Contact local police stations for area-wise data'
    }
};

// 2. NEWS DATA SOURCES
const newsDataSources = {
    newsAPI: {
        name: 'News API',
        url: 'https://newsapi.org/',
        apiKey: 'YOUR_NEWS_API_KEY',
        endpoint: 'https://newsapi.org/v2/everything',
        usage: 'Search for crime/safety related news by location'
    },
    
    googleNews: {
        name: 'Google News RSS',
        url: 'https://news.google.com/rss',
        usage: 'RSS feeds for location-based crime news',
        example: 'https://news.google.com/rss/search?q=crime+bangalore&hl=en-IN'
    }
};

// 3. GOVERNMENT DATA SOURCES
const governmentDataSources = {
    dataGovIn: {
        name: 'Open Government Data India',
        url: 'https://data.gov.in/',
        datasets: [
            'Crime statistics by state/district',
            'Urban planning data',
            'Street lighting information',
            'Public safety infrastructure'
        ]
    },
    
    census: {
        name: 'Census of India',
        url: 'https://censusindia.gov.in/',
        data: 'Demographic and infrastructure data'
    }
};

// API Functions to fetch real data
const fetchPoliceData = async (location) => {
    try {
        // Example: Fetch from NCRB or local police APIs
        const response = await fetch(`https://api.example-police.gov.in/crimes?location=${location}`);
        const data = await response.json();
        
        return data.incidents.map(incident => ({
            lat: incident.latitude,
            lng: incident.longitude,
            type: incident.crime_type,
            severity: incident.severity,
            date: incident.date,
            source: 'police_data'
        }));
    } catch (error) {
        console.log('Police data not available, using mock data');
        return getMockPoliceData(location);
    }
};

const fetchNewsData = async (location) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        const query = `crime safety incident ${location}`;
        
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${apiKey}`
        );
        const data = await response.json();
        
        return data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: 'news_reports'
        }));
    } catch (error) {
        console.log('News API not available');
        return [];
    }
};

const fetchGovernmentData = async (location) => {
    try {
        // Example: Fetch from data.gov.in APIs
        const response = await fetch(`https://api.data.gov.in/resource/safety-infrastructure?location=${location}`);
        const data = await response.json();
        
        return data.records.map(record => ({
            lat: record.latitude,
            lng: record.longitude,
            infrastructure_type: record.type,
            safety_rating: record.rating,
            last_updated: record.updated_date,
            source: 'government_data'
        }));
    } catch (error) {
        console.log('Government data not available');
        return [];
    }
};

// Mock data for demonstration
const getMockPoliceData = (location) => [
    { lat: 12.9716, lng: 77.5946, type: 'theft', severity: 'medium', date: '2024-01-15', source: 'police_data' },
    { lat: 12.9700, lng: 77.5900, type: 'harassment', severity: 'high', date: '2024-01-10', source: 'police_data' }
];

// Main function to aggregate all data sources
const getUnsafeAreasFromAllSources = async (location) => {
    try {
        const [policeData, newsData, govData] = await Promise.all([
            fetchPoliceData(location),
            fetchNewsData(location),
            fetchGovernmentData(location)
        ]);
        
        // Combine and process all data sources
        const unsafeAreas = [];
        
        // Process police data
        policeData.forEach(incident => {
            if (incident.severity === 'high') {
                unsafeAreas.push({
                    name: `High Crime Area - ${incident.type}`,
                    lat: incident.lat,
                    lng: incident.lng,
                    radius: 200,
                    type: incident.type,
                    source: 'police_data',
                    reports: 1,
                    lastIncident: incident.date
                });
            }
        });
        
        // Process news data (extract locations from news articles)
        // This would require NLP/geocoding to extract locations from news text
        
        // Process government data
        govData.forEach(record => {
            if (record.safety_rating < 3) {
                unsafeAreas.push({
                    name: `Low Safety Rating Area`,
                    lat: record.lat,
                    lng: record.lng,
                    radius: 150,
                    type: 'poorly_lit',
                    source: 'government_data',
                    reports: 1,
                    safetyRating: record.safety_rating
                });
            }
        });
        
        return unsafeAreas;
    } catch (error) {
        console.error('Error fetching unsafe areas:', error);
        return [];
    }
};

module.exports = {
    policeDataSources,
    newsDataSources,
    governmentDataSources,
    fetchPoliceData,
    fetchNewsData,
    fetchGovernmentData,
    getUnsafeAreasFromAllSources
};