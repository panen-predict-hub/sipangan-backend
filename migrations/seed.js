const { pool } = require('../src/config/database');

const seedData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

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
      await client.query(
        'INSERT INTO regions (name, latitude, longitude) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING',
        [region.name, region.lat, region.lng]
      );
    }

    // Seed Commodities
    const commodities = [
      { name: 'Beras Medium', unit: 'kg' },
      { name: 'Gula Pasir', unit: 'kg' },
      { name: 'Cabai Merah', unit: 'kg' },
      { name: 'Daging Sapi', unit: 'kg' },
      { name: 'Telur Ayam', unit: 'kg' }
    ];
    for (const comm of commodities) {
      await client.query('INSERT INTO commodities (name, unit) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING', [comm.name, comm.unit]);
    }

    // Seed Sample Prices (Last 7 days)
    const resRegions = await client.query('SELECT id FROM regions');
    const resComms = await client.query('SELECT id FROM commodities');

    for (const region of resRegions.rows) {
      for (const comm of resComms.rows) {
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const price = Math.floor(Math.random() * (50000 - 10000) + 10000);
          await client.query(
            'INSERT INTO prices (commodity_id, region_id, price, date) VALUES ($1, $2, $3, $4)',
            [comm.id, region.id, price, date]
          );
        }
      }
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', err);
  } finally {
    client.release();
    process.exit();
  }
};

seedData();
