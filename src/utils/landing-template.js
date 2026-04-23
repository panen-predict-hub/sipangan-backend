const landingTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIPANGAN API - Repository</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg: #f8fafc;
            --text: #1e293b;
            --card: #ffffff;
            --border: #e2e8f0;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            max-width: 850px;
            width: 100%;
            animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        header {
            text-align: center;
            margin-bottom: 3.5rem;
        }
        h1 {
            color: var(--primary);
            font-size: 2.75rem;
            margin-bottom: 0.5rem;
            letter-spacing: -0.025em;
        }
        .badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 0.2rem 0.75rem;
            border-radius: 99px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .card {
            background: var(--card);
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05);
            padding: 2.5rem;
            border: 1px solid var(--border);
        }
        h3 {
            margin-top: 0;
            margin-bottom: 1.5rem;
            font-size: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .endpoint-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .endpoint {
            display: flex;
            align-items: center;
            padding: 1rem;
            background: #f1f5f9;
            border-radius: 10px;
            transition: transform 0.2s, background 0.2s;
        }
        .endpoint:hover {
            transform: translateX(4px);
            background: #e2e8f0;
        }
        .method {
            font-weight: 800;
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            margin-right: 1.25rem;
            min-width: 65px;
            text-align: center;
            text-transform: uppercase;
        }
        .get { background: #10b981; color: white; }
        .post { background: #3b82f6; color: white; }
        .url { 
            font-family: 'JetBrains Mono', 'Fira Code', monospace; 
            font-size: 0.95rem; 
            color: #334155;
            font-weight: 500;
        }
        .desc { 
            margin-left: auto; 
            font-size: 0.875rem; 
            color: #64748b;
        }
        footer {
            text-align: center;
            font-size: 0.875rem;
            color: #94a3b8;
            margin-top: 4rem;
            padding-bottom: 2rem;
        }
        .docs-btn {
            display: inline-block;
            margin-top: 1.5rem;
            background: var(--primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        .docs-btn:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }
        .status-dot {
            height: 8px;
            width: 8px;
            background-color: #10b981;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
            box-shadow: 0 0 8px #10b981;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <span class="badge">v1.0.0 Stable</span>
            <h1>SIPANGAN API</h1>
            <p>Sistem Informasi Harga Pangan (Komoditas Padi) - Backend Core Service</p>
            <a href="/api-docs" class="docs-btn">View Full API Documentation (Swagger)</a>
        </header>
        
        <div class="card">
            <h3><span class="status-dot"></span> Available Endpoints</h3>
            <div class="endpoint-list">
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/prices</span>
                    <span class="desc">Data Riwayat Harga Padi</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/commodities</span>
                    <span class="desc">Daftar Komoditas (Padi/Beras)</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/predict</span>
                    <span class="desc">Prediksi Harga Padi (AI)</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/alerts</span>
                    <span class="desc">Peringatan Harga Padi Real-time</span>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/maps</span>
                    <span class="desc">Peta Sebaran Harga {status, lat, lng}</span>
                </div>
            </div>
        </div>

        <footer>
            &copy; 2026 SIPANGAN PROJECT &bull; Built with Node.js, Express & PostgreSQL
        </footer>
    </div>
</body>
</html>
`;

export default landingTemplate;
