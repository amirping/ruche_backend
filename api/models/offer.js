const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  requirements: {
    type: [String]
  },
  salaire: {
    type: [String],
  },
  location: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  experience: {
    type: Number
  },
  type: {
    type: String
  },
  img: {
    type: String
  }
});

module.exports = mongoose.model('Offer', offerSchema);