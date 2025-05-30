const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  clientUrl: process.env.CLIENT_URL,
};
