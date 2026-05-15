import { pool } from '../src/config/database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  const client = await pool.getConnection();
  try {
    // Seed Admin User
    const adminId = uuidv4();
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    await client.execute(
      'INSERT IGNORE INTO users (id, username, password, fullname, role) VALUES (?, ?, ?, ?, ?)',
      [adminId, 'admin', hashedAdminPassword, 'Administrator Utama', 'super_admin']
    );

    // Seed Regions
    const regions = [
      { name: 'Kabupaten Bangkalan', lat: -7.0258, lng: 112.7425 },
      { name: 'Kabupaten Banyuwangi', lat: -8.2192, lng: 114.3692 },
      { name: 'Kabupaten Blitar', lat: -8.1333, lng: 112.2167 },
      { name: 'Kabupaten Bojonegoro', lat: -7.1500, lng: 111.8833 },
      { name: 'Kabupaten Bondowoso', lat: -7.9167, lng: 113.8167 },
      { name: 'Kabupaten Gresik', lat: -7.1667, lng: 112.6500 },
      { name: 'Kabupaten Jember', lat: -8.1667, lng: 113.7000 },
      { name: 'Kabupaten Jombang', lat: -7.5500, lng: 112.2333 },
      { name: 'Kabupaten Kediri', lat: -7.8167, lng: 112.0167 },
      { name: 'Kabupaten Lamongan', lat: -7.1167, lng: 112.3167 },
      { name: 'Kabupaten Lumajang', lat: -8.1333, lng: 113.2167 },
      { name: 'Kabupaten Madiun', lat: -7.6167, lng: 111.6500 },
      { name: 'Kabupaten Magetan', lat: -7.6500, lng: 111.3667 },
      { name: 'Kabupaten Malang', lat: -8.1667, lng: 112.6667 },
      { name: 'Kabupaten Mojokerto', lat: -7.5500, lng: 112.4667 },
      { name: 'Kabupaten Nganjuk', lat: -7.6000, lng: 111.9000 },
      { name: 'Kabupaten Ngawi', lat: -7.4000, lng: 111.4500 },
      { name: 'Kabupaten Pacitan', lat: -8.2000, lng: 111.1167 },
      { name: 'Kabupaten Pamekasan', lat: -7.1667, lng: 113.4833 },
      { name: 'Kabupaten Pasuruan', lat: -7.7333, lng: 112.8333 },
      { name: 'Kabupaten Ponorogo', lat: -7.8667, lng: 111.4667 },
      { name: 'Kabupaten Probolinggo', lat: -7.8000, lng: 113.3167 },
      { name: 'Kabupaten Sampang', lat: -7.0500, lng: 113.2500 },
      { name: 'Kabupaten Sidoarjo', lat: -7.4500, lng: 112.7000 },
      { name: 'Kabupaten Situbondo', lat: -7.7167, lng: 114.0000 },
      { name: 'Kabupaten Sumenep', lat: -7.0167, lng: 113.8667 },
      { name: 'Kabupaten Trenggalek', lat: -8.1000, lng: 111.7167 },
      { name: 'Kabupaten Tuban', lat: -6.9000, lng: 111.9000 },
      { name: 'Kabupaten Tulungagung', lat: -8.0667, lng: 111.9000 },
      { name: 'Kota Batu', lat: -7.8667, lng: 112.5167 },
      { name: 'Kota Blitar', lat: -8.0983, lng: 112.1681 },
      { name: 'Kota Kediri', lat: -7.8228, lng: 112.0118 },
      { name: 'Kota Madiun', lat: -7.6298, lng: 111.5239 },
      { name: 'Kota Malang', lat: -7.9797, lng: 112.6304 },
      { name: 'Kota Mojokerto', lat: -7.4725, lng: 112.4336 },
      { name: 'Kota Pasuruan', lat: -7.6453, lng: 112.9075 },
      { name: 'Kota Probolinggo', lat: -7.7470, lng: 113.2155 },
      { name: 'Kota Surabaya', lat: -7.2504, lng: 112.7688 }
    ];
    for (const region of regions) {
      const id = uuidv4();
      await client.execute(
        'INSERT IGNORE INTO regions (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',
        [id, region.name, region.lat, region.lng]
      );
    }

    // Seed Commodities
    const commodities = [
      { name: 'Beras Medium', unit: 'kg' },
    ];
    for (const comm of commodities) {
      const id = uuidv4();
      await client.execute('INSERT IGNORE INTO commodities (id, name, unit) VALUES (?, ?, ?)', [id, comm.name, comm.unit]);
    }

    // Seed Sample Prices (Last 120 days)
    const [resRegions] = await client.execute('SELECT id FROM regions');
    const [resComms] = await client.execute('SELECT id, name FROM commodities');

    for (const region of resRegions) {
      for (const comm of resComms) {
        const targetBasePrice = comm.name.includes('Beras') ? 13500 : 25000;

        // Harga awal dihitung 120 hari yang lalu (ditambah sedikit variasi antar daerah)
        let currentPrice = targetBasePrice + (Math.floor(Math.random() * 1401) - 700);

        // Setiap wilayah akan mendapatkan pola tren yang unik agar grafiknya tidak seragam
        // 0 = Tren naik lalu turun, 1 = Tren turun lalu naik, 2 = Bergelombang (Siklus)
        const regionTrendPattern = Math.floor(Math.random() * 3);

        // Loop berjalan MAJU dari 120 hari yang lalu menuju ke HARI INI
        for (let i = 120; i >= 0; i--) {
          const id = uuidv4();
          const date = new Date();
          date.setDate(date.getDate() - i); // i = 120 (masa lalu) s/d i = 0 (hari ini)

          // Volatilitas harian alami
          const volatility = comm.name.includes('Beras') ? 100 : 300;
          const randomNoise = (Math.random() * volatility * 2) - volatility;

          // Membuat "Trend Driver" artifisial berdasarkan pola wilayah dan waktu (i)
          let trendDriver = 0;

          if (regionTrendPattern === 0) {
            // Pola: Naik di awal (stok menipis), turun di akhir (panen raya)
            trendDriver = i > 50 ? 80 : -90;
          } else if (regionTrendPattern === 1) {
            // Pola: Turun di awal, melonjak naik di akhir (efek musiman/hari besar)
            trendDriver = i > 40 ? -70 : 110;
          } else {
            // Pola: Bergelombang (Siklus menggunakan rumus Sinus)
            // Menggunakan math sinus berdasarkan sisa hari untuk membuat gelombang naik-turun yang halus
            trendDriver = Math.sin((120 - i) * 0.1) * 120;
          }

          // Mean Reversion tetap dipasang agar harga tidak menjadi tidak masuk akal (out of bounds)
          const pullFactor = 0.03;
          const pull = (targetBasePrice - currentPrice) * pullFactor;

          // Gabungkan pergerakan harga
          currentPrice += randomNoise + trendDriver + pull;

          // Pembulatan khas Indonesia (Ratusan rupiah)
          const roundedPrice = Math.round(currentPrice / 100) * 100;

          // Batasan logis harga pasar
          const finalPrice = Math.max(10500, Math.min(18500, roundedPrice));

          await client.execute(
            'INSERT INTO prices (id, commodity_id, region_id, price, date) VALUES (?, ?, ?, ?, ?)',
            [id, comm.id, region.id, finalPrice, date]
          );
        }
      }
    }
    console.log('Seeding completed successfully with dynamic trends');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    if (client) client.release();
    process.exit();
  }
};

seedData();
