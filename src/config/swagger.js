import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIPANGAN API',
      version: '1.0.0',
      description: 'Sistem Informasi Harga Pangan (Khusus Komoditas Padi) - Backend API Documentation',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'SIPANGAN Team',
        url: 'https://github.com/panen-predict-hub/sipangan-backend',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/**/*.js', './src/server.js'], // paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
