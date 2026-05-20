require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/db');
const authRoutes = require('./Routes/authRoutes');
const leadRoutes = require('./Routes/leadRoutes');

const port = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://client-leeds.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to LeadFlow CRM API' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
