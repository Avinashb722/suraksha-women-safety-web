const express = require('express');
const router = express.Router();
const { getUnsafeAreasFromAllSources } = require('../utils/dataSourcesAPI');

// Get unsafe areas from all data sources
router.get('/unsafe-areas/:location', async (req, res) => {
    try {
        const { location } = req.params;
        console.log('Fetching unsafe areas for location:', location);
        
        const unsafeAreas = await getUnsafeAreasFromAllSources(location);
        
        res.json({
            success: true,
            location,
            totalAreas: unsafeAreas.length,
            data: unsafeAreas,
            sources: ['police_data', 'news_reports', 'government_data', 'user_reports'],
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching unsafe areas:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unsafe areas',
            error: error.message
        });
    }
});

// Get data source information
router.get('/sources', (req, res) => {
    res.json({
        success: true,
        dataSources: {
            police: {
                name: 'Police Crime Data',
                description: 'Official crime statistics and incident reports',
                sources: [
                    'National Crime Records Bureau (NCRB)',
                    'State Police Departments',
                    'Local Police Stations',
                    'Crime Mapping Systems'
                ],
                howToAccess: [
                    'RTI (Right to Information) requests',
                    'Public data portals',
                    'Police department APIs',
                    'Crime mapping websites'
                ]
            },
            news: {
                name: 'News Reports',
                description: 'Media coverage of safety incidents and concerns',
                sources: [
                    'News API (newsapi.org)',
                    'Google News RSS feeds',
                    'Local newspaper websites',
                    'Social media monitoring'
                ],
                howToAccess: [
                    'News API subscription',
                    'RSS feed parsing',
                    'Web scraping (with permission)',
                    'Social media APIs'
                ]
            },
            government: {
                name: 'Government Data',
                description: 'Official safety assessments and urban planning data',
                sources: [
                    'Open Government Data India (data.gov.in)',
                    'Census of India',
                    'Municipal Corporation data',
                    'Urban planning departments'
                ],
                howToAccess: [
                    'Open data portals',
                    'Government APIs',
                    'RTI requests',
                    'Municipal websites'
                ]
            }
        }
    });
});

module.exports = router;