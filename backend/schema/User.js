const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // don't return password in queries by default
    },
    mobile: {
      type: String,
      default: '',
    },
    photo: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    loginStats: {
      lastLoginDate: { type: Date },
      dailyCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = bcrypt.hashSync(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
