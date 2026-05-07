
-- Drop existing tables if they exist
DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS commodities;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Regions table
CREATE TABLE regions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Create Commodities table
CREATE TABLE commodities (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    unit VARCHAR(20) DEFAULT 'kg'
);

-- Create Prices table (Time Series)
CREATE TABLE prices (
    id VARCHAR(36) PRIMARY KEY,
    commodity_id VARCHAR(36) REFERENCES commodities(id) ON DELETE CASCADE,
    region_id VARCHAR(36) REFERENCES regions(id) ON DELETE CASCADE,
    price DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance
CREATE INDEX idx_prices_commodity ON prices(commodity_id);
CREATE INDEX idx_prices_region ON prices(region_id);
CREATE INDEX idx_prices_date ON prices(date);

