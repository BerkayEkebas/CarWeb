const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { syncAuctions } = require('../jobs/syncAuctions');
const { getCurrentWeekNo } = require('../scraper');
const { requireAuth } = require('../middleware/authMiddleware');

// GET /api/auctions
router.get('/', async (req, res) => {
  try {
    const {
      weekNo, fuel, transmission, color,
      yearFrom, yearTo, priceFrom, priceTo, kmFrom, kmTo,
      activeOnly = 'true',
      page = 1, limit = 20,
    } = req.query;

    const conditions = [];
    const params = [];

    if (activeOnly === 'true') { conditions.push('is_active = 1'); }
    if (weekNo) { conditions.push('week_no = ?'); params.push(weekNo); }
    if (fuel) { conditions.push('fuel = ?'); params.push(fuel); }
    if (transmission) { conditions.push('transmission = ?'); params.push(transmission); }
    if (color) { conditions.push('color = ?'); params.push(color); }
    if (yearFrom) { conditions.push('year >= ?'); params.push(yearFrom); }
    if (yearTo) { conditions.push('year <= ?'); params.push(yearTo); }
    if (priceFrom) { conditions.push('price_usd >= ?'); params.push(priceFrom); }
    if (priceTo) { conditions.push('price_usd <= ?'); params.push(priceTo); }
    if (kmFrom) { conditions.push('km >= ?'); params.push(kmFrom); }
    if (kmTo) { conditions.push('km <= ?'); params.push(kmTo); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitVal = parseInt(limit);
    const offsetVal = (parseInt(page) - 1) * limitVal;

    const rows = await query(
      `SELECT * FROM auctions ${where} ORDER BY week_no DESC, stock_no ASC LIMIT ${limitVal} OFFSET ${offsetVal}`,
      params
    );

    const countRows = await query(`SELECT COUNT(*) as total FROM auctions ${where}`, params);
    const total = countRows[0].total;

    res.json({ data: rows, total, page: parseInt(page), limit: limitVal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/auctions/weeks
router.get('/weeks', async (req, res) => {
  try {
    const rows = await query('SELECT DISTINCT week_no FROM auctions ORDER BY week_no DESC');
    res.json(rows.map(r => r.week_no));
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/auctions/next-week — ssancar.com'daki güncel hafta
router.get('/next-week', async (req, res) => {
  try {
    const weekNo = await getCurrentWeekNo();
    res.json({ nextWeek: weekNo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auctions/:id
router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM auctions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/auctions — manuel araç ekleme (admin)
router.post('/', requireAuth, async (req, res) => {
  const { week_no, stock_no, name, year, transmission, fuel, cc, km, grade, color, price_usd, link, image } = req.body;
  if (!name || !week_no) return res.status(400).json({ error: 'name and week_no are required' });

  try {
    const result = await query(
      `INSERT INTO auctions (week_no, stock_no, name, year, transmission, fuel, cc, km, grade, color, price_usd, link, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [week_no, stock_no || null, name, year || null, transmission || null, fuel || null, cc || null, km || null, grade || null, color || null, price_usd || null, link || null, image || null]
    );
    const rows = await query('SELECT * FROM auctions WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PATCH /api/auctions/:id/status — aktif/pasif toggle (admin)
router.patch('/:id/status', requireAuth, async (req, res) => {
  const { is_active } = req.body;
  if (typeof is_active !== 'boolean' && is_active !== 0 && is_active !== 1) {
    return res.status(400).json({ error: 'is_active (boolean) is required' });
  }

  try {
    await query('UPDATE auctions SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/auctions/:id (admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await query('DELETE FROM auctions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/auctions/sync (admin)
router.post('/sync', requireAuth, async (req, res) => {
  const { weekNo } = req.body;
  if (!weekNo) return res.status(400).json({ error: 'weekNo is required' });

  try {
    const result = await syncAuctions(parseInt(weekNo));
    res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
