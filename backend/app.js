const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const userProductRoutes = require('./routes/ProductRoutes'); 
const userCategoryRoutes = require('./routes/CategoryRoutes');
const { swaggerUi, swaggerSpec } = require('./swagger');
const userOrderRoutes = require('./routes/OrderRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const { clientUrl } = require('./config/config');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors');


const app = express();

// CORS setup: allow frontend origin and credentials (cookies)
app.use(cors({
  origin: clientUrl,
  credentials: true,
}));

app.use(express.json());        // Parse JSON bodies
app.use(cookieParser());        // Parse cookies

app.use('/api/auth', authRoutes);//auth Routes
app.use('/api/admin', adminRoutes);//Admin Routes

app.use('/api/user', userRoutes);//User Routes
app.use('/api/user/wishlist', wishlistRoutes);
app.use('/api/user/cart',cartRoutes)
app.use('/api/orders', userOrderRoutes); //Order routes


app.use('/api/products', userProductRoutes); //Product routes  
app.use('/api/categories', userCategoryRoutes);//Category routes



app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));// Swagger docs route 

app.use(errorHandler);// Global error handler middleware


module.exports = app;
