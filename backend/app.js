const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const adminProductRoutes = require('./routes/adminProductRoutes'); 
const userProductRoutes = require('./routes/userProductRoutes'); 
const userCategoryRoutes = require('./routes/userCategoryRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const adminPaymentMethodRoutes = require('./routes/adminPaymentMethodRoutes');
const userPaymentMethodRoutes = require('./routes/userPaymentMethodRoutes'); // Add this line
const { swaggerUi, swaggerSpec } = require('./swagger');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const userOrderRoutes = require('./routes/userOrderRoutes');

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

// auth Routes
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/user', userRoutes);


// Admin Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/categories', adminCategoryRoutes); 
app.use('/api/admin/payment-methods', adminPaymentMethodRoutes);

// Product routes
app.use('/api/products', userProductRoutes);      

// Category routes
app.use('/api/categories', userCategoryRoutes);    

// Payment method routes for users
app.use('/api/payment-methods', userPaymentMethodRoutes);

app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/orders', userOrderRoutes); 

// Swagger docs route (add before error handler)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler middleware
app.use(errorHandler);

module.exports = app;
