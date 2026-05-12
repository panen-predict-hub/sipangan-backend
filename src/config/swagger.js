import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIPANGAN API',
      version: '1.0.0',
      description: 'API Dokumentasi untuk Sistem Informasi Harga Pangan (SIPANGAN). Dokumentasi ini dirancang secara komprehensif untuk memudahkan integrasi frontend.',
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
      {
        url: 'https://sipangan-backend.vercel.app',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API Key untuk akses publik API (Wajib di semua request)',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Access Token (Wajib untuk fitur CRUD/Protected)',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Pesan kesalahan detail' },
          },
        },
      },
    },
    security: [
      {
        apiKeyAuth: [],
      },
    ],
  },
  apis: ['./src/api/**/*.js', './src/server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
