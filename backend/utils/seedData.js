const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const DataModel = require('../models/Data');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => {
  console.error(' MongoDB connection error:', err);
  process.exit(1);
});

// Seed Function
const seedData = async () => {
  try {
    console.log('Starting data seeding...');
    await DataModel.deleteMany({});
    console.log('Cleared existing data');

    const jsonPath = path.join(__dirname, '../data/jsondata.json');

    let rawData;
    if (fs.existsSync(jsonPath)) {
      console.log('Reading from jsondata.json...');
      rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else {
      throw new Error('jsondata.json not found.');
    }

    const dataToInsert = rawData.map(item => ({
      intensity: item.intensity || 0,
      likelihood: item.likelihood || 0,
      relevance: item.relevance || 0,
      year: item.year || null,
      country: item.country || '',
      topic: item.topic || item.topics || '', // fallback
      region: item.region || '',
      city: item.city || '',
      end_year: item.end_year || null,
      sector: item.sector || '',
      pestle: item.pestle || item.pest || '', // fallback
      source: item.source || '',
      swot: item.swot || '',
      title: item.title || '',
      insight: item.insight || ''
    }));

    await DataModel.insertMany(dataToInsert);
    console.log(`Inserted ${dataToInsert.length} records`);
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  } finally {
    process.exit(0);
  }
 }
};
seedData();