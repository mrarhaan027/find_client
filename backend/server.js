require('dns').setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); // Fix Atlas SRV lookup
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const settingRoutes = require('./routes/settingRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS — allow frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://find-client-i9eh.vercel.app',
  /\.vercel\.app$/,  // allow all vercel preview deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    return callback(new Error('CORS: origin not allowed — ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ LeadForge API running', status: 'ok' });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


