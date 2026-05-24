const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true, // e.g., 'slider_images'
    },
    images: [
      {
        url: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
