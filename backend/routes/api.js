const express = require('express');
const router = express.Router();
const DataModel = require('../models/Data');

router.get('/data', async (req, res) => {
  try {
    const {
      endYear, topic, sector, region, pestle, source, swot, country, city,
      minIntensity, maxIntensity, minLikelihood, maxLikelihood,
      minRelevance, maxRelevance, year, startYear
    } = req.query;

    const filter = {};

    if (endYear && endYear !== 'all') filter.end_year = parseInt(endYear);
    if (topic && topic !== 'all') filter.topic = topic;
    if (sector && sector !== 'all') filter.sector = sector;
    if (region && region !== 'all') filter.region = region;
    if (pestle && pestle !== 'all') filter.pestle = pestle;
    if (source && source !== 'all') filter.source = source;
    if (swot && swot !== 'all') filter.swot = swot;
    if (country && country !== 'all') filter.country = country;
    if (city && city !== 'all') filter.city = city;
    if (year) filter.year = parseInt(year);
    if (startYear) filter.start_year = parseInt(startYear);
   
     // Range filters
    if (minIntensity || maxIntensity) {
      filter.intensity = {};
      if (minIntensity) filter.intensity.$gte = parseInt(minIntensity);
      if (maxIntensity) filter.intensity.$lte = parseInt(maxIntensity);
    }

    if (minLikelihood || maxLikelihood) {
      filter.likelihood = {};
      if (minLikelihood) filter.likelihood.$gte = parseInt(minLikelihood);
      if (maxLikelihood) filter.likelihood.$lte = parseInt(maxLikelihood);
    }

    if (minRelevance || maxRelevance) {
      filter.relevance = {};
      if (minRelevance) filter.relevance.$gte = parseInt(minRelevance);
      if (maxRelevance) filter.relevance.$lte = parseInt(maxRelevance);
    }

    const data = await DataModel.find(filter).sort({ year: -1 });
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

router.get('/filters', async (req, res) => {
  try {
    const filters = await Promise.all([
      DataModel.distinct('end_year'),
      DataModel.distinct('topic'),
      DataModel.distinct('sector'),
      DataModel.distinct('region'),
      DataModel.distinct('pestle'),
      DataModel.distinct('source'),
      DataModel.distinct('swot'),
      DataModel.distinct('country'),
      DataModel.distinct('city'),
      DataModel.distinct('year'),
      DataModel.distinct('start_year')
    ]);
 
    res.json({
      endYears: filters[0].filter(Boolean).sort(),
      topics: filters[1].filter(Boolean).sort(),
      sectors: filters[2].filter(Boolean).sort(),
      regions: filters[3].filter(Boolean).sort(),
      pestles: filters[4].filter(Boolean).sort(),
      sources: filters[5].filter(Boolean).sort(),
      swots: filters[6].filter(Boolean).sort(),
      countries: filters[7].filter(Boolean).sort(),
      cities: filters[8].filter(Boolean).sort(),
      years: filters[9].filter(Boolean).sort(),
      startYears: filters[10].filter(Boolean).sort()
    });

    } catch (error) {
    console.error('Error fetching filter values:', error);
    res.status(500).json({ message: 'Error fetching filters', error: error.message });
  }
});


module.exports = router;
