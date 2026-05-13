# SIPANGAN Backend API 🌾

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white)

**SIPANGAN** (Sistem Informasi Pangan) Backend is a robust RESTful API built to power the harvest prediction hub. It provides comprehensive services for user authentication, commodity management, price prediction, mapping, and historical data analysis.

## 🚀 Features

- **🔒 Secure Authentication**: Multi-layered security with JWT (Access & Refresh Tokens) and API Key validation.
- **🛡️ Rate Limiting**: Brute-force protection on sensitive routes.
- **⚡ Caching**: Integrated Redis caching for optimized performance.
- **📊 Commodity Management**: CRUD operations for various food commodities.
- **🔮 Prediction Engine**: Integration with FastAPI-based AI services for harvest and price prediction.
- **🗺️ Map Services**: GeoJSON data management for agricultural mapping.
- **📜 Swagger Documentation**: Interactive API documentation protected by basic authentication.
- **🧪 Unit & Integration Testing**: Comprehensive test suite using Jest and Supertest.
- **🆔 UUID v7**: Modern, time-ordered unique identifiers for all database records.

## 🛠️ Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js (v5)
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Security**: Bcrypt.js, Express Rate Limit
- **Validation**: Joi
- **Testing**: Jest, Supertest
- **Documentation**: Swagger UI, OpenAPI 3.0

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL Server](https://www.mysql.com/)
- [Redis Server](https://redis.io/) (Optional, but recommended for caching)
- [Postman](https://www.postman.com/) (For manual testing)

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/panen-predict-hub/sipangan-backend.git
   cd sipangan-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

## 🗄️ Database Setup

1. Create a MySQL database (e.g., `sipangan_db`).
2. Update the `DB_*` variables in your `.env` file.
3. (Optional) Run the seed script to populate initial data:
   ```bash
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode
Runs the server with `nodemon` for automatic restarts on file changes.
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will be available at `http://localhost:3000` (or your configured `PORT`).

## 📖 API Documentation

The project includes built-in Swagger documentation.

- **URL**: `http://localhost:3000/api-docs`
- **Security**: The documentation is protected by basic authentication. Use the `SWAGGER_USER` and `SWAGGER_PASSWORD` defined in your `.env` file.

## 🧪 Testing

We use Jest and Supertest for testing.

- **Run all tests**:
  ```bash
  npm test
  ```
- **Run tests in watch mode**:
  ```bash
  npm run test:dev
  ```

## 📂 Project Structure

```
├── 📁 migrations           # Database migrations & seed scripts
│   ├── 📄 init.sql        # Main SQL schema
│   └── 📄 seed.js         # Dummy data seeder
├── 📁 src                  # Core Application Source
│   ├── 📁 api              # API Layer (Controllers & Routes)
│   │   ├── 📁 alerts       # Alert management module
│   │   ├── 📁 auth         # Authentication (Login, Register, Token)
│   │   ├── 📁 commodities  # Commodity CRUD operations
│   │   ├── 📁 history      # Historical data analytics
│   │   ├── 📁 maps         # GeoJSON agricultural mapping
│   │   └── 📁 predict      # AI Prediction integration
│   │       ├── 📄 handler.js # Controller logic
│   │       ├── 📄 index.js   # Module entry point
│   │       └── 📄 routes.js  # Route definitions
│   ├── 📁 config           # Service configurations (DB, Redis, Swagger)
│   ├── 📁 middleware       # Express middlewares (Auth, Cache, Rate-limit)
│   ├── 📁 services         # Business Logic Layer (DB queries)
│   ├── 📁 utils            # Utilities & Custom Error Classes
│   ├── 📁 validator        # Joi request validation schemas
│   └── 📄 server.js        # Main server entry point
├── 📁 tests                # Automated testing suite
├── ⚙️ .env.example         # Environment variables template
├── 📄 LICENSE              # MIT License
├── 📝 README.md            # Project documentation
└── ⚙️ package.json         # Dependencies & scripts
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
Developed with ❤️ by the **SIPANGAN Team**.
