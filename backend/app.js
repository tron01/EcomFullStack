const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const { errorHandler } = require('./middlewares/errorHandler');
const { clientUrl } = require('./config/config');
const cors = require('cors');


const app = express();

// CORS setup: allow frontend origin and credentials (cookies)
app.use(cors({
  origin: clientUrl,
  credentials: true,
}));

app.use(express.json());        // Parse JSON bodies
app.use(cookieParser());        // Parse cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler middleware
app.use(errorHandler);

module.exports = app;
