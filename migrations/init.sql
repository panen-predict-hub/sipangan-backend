-- Active: 1774841888489@@127.0.0.1@5432@sipangan
-- Drop existing tables if they exist
DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS commodities;
DROP TABLE IF EXISTS regions;

-- Create Regions table
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create Commodities table
CREATE TABLE commodities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    unit VARCHAR(20) DEFAULT 'kg'
);

-- Create Prices table (Time Series)
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    commodity_id INT REFERENCES commodities(id) ON DELETE CASCADE,
    region_id INT REFERENCES regions(id) ON DELETE CASCADE,
    price DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance
CREATE INDEX idx_prices_commodity ON prices(commodity_id);
CREATE INDEX idx_prices_region ON prices(region_id);
CREATE INDEX idx_prices_date ON prices(date);
