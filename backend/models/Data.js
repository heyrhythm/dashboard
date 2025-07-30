const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  intensity: { type: Number, default: 0 },
  likelihood: { type: Number, default: 0 },
  relevance: { type: Number, default: 0 },
  year: { type: Number },
  country: { type: String, default: '' },
  topic: { type: String, default: '' },
  region: { type: String, default: '' },
  city: { type: String, default: '' },
  end_year: { type: Number },
  sector: { type: String, default: '' },
  pestle: { type: String, default: '' },
  source: { type: String, default: '' },
  swot: { type: String, default: '' },
  title: { type: String, default: '' },
  insight: { type: String, default: '' },
  url: { type: String, default: '' },
  published: { type: String, default: '' },
  added: { type: String, default: '' },
  impact: { type: String, default: '' },
  start_year: { type: Number }
}, { 
  timestamps: true,
  collection: 'data'
});

module.exports = mongoose.model('Data', DataSchema, 'data');