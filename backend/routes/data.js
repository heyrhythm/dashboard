const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// GET all data with filters
router.get('/', async (req, res) => {
  try {
    const {
      endYear, topics, sector, region, pest, source, swot, country, city,
      minIntensity, maxIntensity, minLikelihood, maxLikelihood,
      minRelevance, maxRelevance, year, startYear, limit = 1000
    } = req.query;

    const filter = {};
    
    // Apply filters
    if (endYear && endYear !== 'all') filter.end_year = parseInt(endYear);
    if (topics && topics !== 'all') filter.topics = new RegExp(topics, 'i');
    if (sector && sector !== 'all') filter.sector = new RegExp(sector, 'i');
    if (region && region !== 'all') filter.region = new RegExp(region, 'i');
    if (pest && pest !== 'all') filter.pest = new RegExp(pest, 'i');
    if (source && source !== 'all') filter.source = new RegExp(source, 'i');
    if (swot && swot !== 'all') filter.swot = new RegExp(swot, 'i');
    if (country && country !== 'all') filter.country = new RegExp(country, 'i');
    if (city && city !== 'all') filter.city = new RegExp(city, 'i');
    if (year) filter.year = parseInt(year);
    if (startYear) filter.start_year = parseInt(startYear);
    
    // Range filters
    if (minIntensity || maxIntensity) {
      filter.intensity = {};
      if (minIntensity) filter.intensity.$gte = parseInt(minIntensity);
      if (maxIntensity) filter.intensity.$lte = parseInt(maxIntensity);
    }

    const data = await Data.find(filter)
      .limit(parseInt(limit))
      .sort({ year: -1 });
    
    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
});

// GET filter options
router.get('/filters', async (req, res) => {
  try {
    const [
      endYears, topics, sectors, regions, 
      pestTypes, sources, swotTypes, countries, cities
    ] = await Promise.all([
      Data.distinct('end_year'),
      Data.distinct('topics'),
      Data.distinct('sector'),
      Data.distinct('region'),
      Data.distinct('pest'),
      Data.distinct('source'),
      Data.distinct('swot'),
      Data.distinct('country'),
      Data.distinct('city')
    ]);

    res.json({
      success: true,
      filters: {
        endYears: endYears.filter(val => val != null).sort(),
        topics: topics.filter(val => val && val.trim()).sort(),
        sectors: sectors.filter(val => val && val.trim()).sort(),
        regions: regions.filter(val => val && val.trim()).sort(),
        pestTypes: pestTypes.filter(val => val && val.trim()).sort(),
        sources: sources.filter(val => val && val.trim()).sort(),
        swotTypes: swotTypes.filter(val => val && val.trim()).sort(),
        countries: countries.filter(val => val && val.trim()).sort(),
        cities: cities.filter(val => val && val.trim()).sort()
      }
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
});

// POST - Add new data
router.post('/', async (req, res) => {
  try {
    const newData = new Data(req.body);
    const savedData = await newData.save();
    res.status(201).json({
      success: true,
      message: 'Data added successfully',
      data: savedData
    });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding data',
      error: error.message
    });
  }
});

module.exports = router;