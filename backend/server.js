const mongoose = require('mongoose');
const app = require('./app');
const { port, mongoUri } = require('./config/config');

mongoose
  .connect(mongoUri)
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
