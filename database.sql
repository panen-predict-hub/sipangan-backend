-- 1. Tabel Wilayah (Mendukung Kebutuhan GIS / Peta Interaktif)
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- Contoh: 'Kota', 'Kabupaten'
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geojson_polygon JSONB, -- Fleksibilitas tinggi untuk mapping GIS (Leaflet/Mapbox)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Komoditas (Master Data)
CREATE TABLE commodities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    unit VARCHAR(20) NOT NULL, -- Contoh: 'Kg', 'Liter'
    category VARCHAR(50), -- Contoh: 'Biji-bijian', 'Sayuran', 'Bumbu'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Harga Historis (Fokus: Data Science & Analisis)
-- Ini adalah tabel inti dari hasil pembersihan Kaggle dataset (handling missing values & outliers).
CREATE TABLE historical_prices (
    id BIGSERIAL PRIMARY KEY,
    region_id INT REFERENCES regions(id) ON DELETE CASCADE,
    commodity_id INT REFERENCES commodities(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Mencegah duplikasi data pada tanggal, wilayah, dan komoditas yang sama
    UNIQUE (region_id, commodity_id, record_date) 
);

-- Indexing krusial untuk performa query time-series dan filter di dashboard
CREATE INDEX idx_hist_date ON historical_prices(record_date);
CREATE INDEX idx_hist_region_commodity ON historical_prices(region_id, commodity_id);

-- 4. Tabel Metadata Model AI (Fokus: AI Engineer)
-- Tabel ini sering dilupakan, padahal sangat penting untuk melacak versi model LSTM mana yang sedang aktif.
CREATE TABLE ai_models (
    id SERIAL PRIMARY KEY,
    version_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    mae DECIMAL(10, 4), -- Mean Absolute Error untuk akurasi
    mse DECIMAL(10, 4), -- Mean Squared Error
    is_active BOOLEAN DEFAULT FALSE,
    trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Harga Prediksi (Fokus: Frontend & Dashboard)
-- Backend FastAPI akan menulis (write) ke sini, Express.js akan membaca (read) dari sini.
CREATE TABLE predicted_prices (
    id BIGSERIAL PRIMARY KEY,
    region_id INT REFERENCES regions(id) ON DELETE CASCADE,
    commodity_id INT REFERENCES commodities(id) ON DELETE CASCADE,
    model_id INT REFERENCES ai_models(id) ON DELETE SET NULL,
    predicted_date DATE NOT NULL,
    predicted_price DECIMAL(12, 2) NOT NULL,
    confidence_lower DECIMAL(12, 2), -- Prediksi harga terendah (opsional untuk chart yang lebih interaktif)
    confidence_upper DECIMAL(12, 2), -- Prediksi harga tertinggi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (region_id, commodity_id, model_id, predicted_date)
);

CREATE INDEX idx_pred_date ON predicted_prices(predicted_date);

-- 6. Tabel Admin (Fokus: Keamanan Internal)
-- Walau pengguna publik tidak perlu login, tim atau sistem butuh akses untuk manajemen data.
CREATE TABLE system_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);