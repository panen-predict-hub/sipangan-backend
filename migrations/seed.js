const { pool } = require('../src/config/database');

const seedData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Seed Regions
    const regions = ['Surabaya', 'Malang', 'Kediri', 'Jember', 'Banyuwangi'];
    for (const region of regions) {
      await client.query('INSERT INTO regions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [region]);
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
