import sql from './src/config/supabase.js' // Sesuaikan path-nya

async function testConnection() {
    console.log("--- Memulai Test Koneksi Supabase ---");

    try {
        // Query sederhana untuk mengambil waktu sekarang dari server Postgres
        const result = await sql`SELECT NOW() as waktu_server, current_database() as nama_db`;

        console.log("✅ Berhasil Terhubung!");
        console.log("Waktu Server Supabase:", result[0].waktu_server);
        console.log("Database Terhubung:", result[0].nama_db);

    } catch (error) {
        console.error("❌ Gagal Terhubung ke Supabase");
        console.error("Pesan Error:", error.message);

        if (error.message.includes('ENOTFOUND')) {
            console.log("\n💡 Tips Diagnosa: Host tidak ditemukan. Periksa kembali URL di .env atau cek koneksi internet hosting.");
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log("\n💡 Tips Diagnosa: Koneksi ditolak. Biasanya karena Port 5432 atau 6543 diblokir oleh Firewall hosting.");
        }
    } finally {
        // Menutup koneksi agar proses node berhenti
        await sql.end();
        process.exit();
    }
}

testConnection();