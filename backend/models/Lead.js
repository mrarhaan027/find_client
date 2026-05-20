const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  contact: {
    type: String,
    required: [true, 'Please add a contact number'],
  },
  description: {
    type: String,
  },
  rating: {
    type: String,
    default: '0',
  },
  status: {
    type: String,
    enum: ['Pending', 'Interested', 'Done', 'Not Interested'],
    default: 'Pending',
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lead', leadSchema);
