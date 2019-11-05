const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: {
    type: String,
    required: true
  },
  offer_id: {
    type: String,
    required: true
  },
  steps: {
    type: [{
      subject: {
        type: String
      },
      content: {
        type: String
      }
    }]
  },
  stat: {
    type: String
  }
});

module.exports = mongoose.model('Request', requestSchema);