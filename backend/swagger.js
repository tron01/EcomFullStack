const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcomFullStack API',
      version: '1.0.0',
      description: 'API documentation for EcomFullStack project',
    },
    servers: [
      { url: 'https://ecomfullstack-nj0g.onrender.com/api' }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      }
    },
    security: [{ cookieAuth: [] }]
  },
  apis: ['./routes/*.js', './models/*.js'], // Scan these files for Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };