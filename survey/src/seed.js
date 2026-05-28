// Idempotent seed: inserts the preselected driver set if (driver_id, version)
// is not present. NEVER deletes drivers and NEVER touches response tables.
const db = require('./db');
const { DRIVERS } = require('./drivers');

async function seedDrivers() {
  await db.init();
  let inserted = 0;
  for (const d of DRIVERS) {
    const existing = await db.query(
      'SELECT id FROM drivers WHERE driver_id = $1 AND version = $2',
      [d.driver_id, d.version],
    );
    if (existing.rows.length) continue;
    await db.query(
      `INSERT INTO drivers
       (driver_id, title, short_definition, category, geography_lens, version, status, order_index, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        d.driver_id, d.title, d.short_definition, d.category, d.geography_lens,
        d.version, d.status, d.order_index, d.active,
      ],
    );
    inserted += 1;
  }
  return inserted;
}

if (require.main === module) {
  seedDrivers()
    .then((n) => { console.log(`Seed complete. Inserted ${n} new driver rows.`); process.exit(0); })
    .catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { seedDrivers };
