const { query } = require('../db');
const { scrapeWeek, getCurrentWeekNo } = require('../scraper');

async function syncAuctions(weekNo) {
  const cars = await scrapeWeek(weekNo);

  if (cars.length === 0) {
    return { inserted: 0, skipped: 0 };
  }

  let inserted = 0;
  let skipped = 0;

  for (const car of cars) {
    try {
      await query(
        `INSERT INTO auctions
          (week_no, stock_no, name, year, transmission, fuel, cc, km, grade, color, price_usd, link, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          name=VALUES(name), price_usd=VALUES(price_usd), km=VALUES(km), image=VALUES(image)`,
        [weekNo, car.stockNo, car.name, car.year, car.transmission, car.fuel, car.cc, car.km, car.grade, car.color, car.priceUSD, car.link, car.image]
      );
      inserted++;
    } catch (err) {
      console.error(`Failed to insert stockNo=${car.stockNo}:`, err.message);
      skipped++;
    }
  }

  return { inserted, skipped };
}

async function syncNextWeek() {
  const weekNo = await getCurrentWeekNo();
  console.log(`[cron] Auto sync starting for weekNo=${weekNo} (fetched from ssancar.com)`);
  const result = await syncAuctions(weekNo);
  console.log(`[cron] Done: ${result.inserted} inserted, ${result.skipped} skipped`);
  return { weekNo, ...result };
}

module.exports = { syncAuctions, syncNextWeek };
