require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const auctionRoutes = require('./routes/auctions');
const authRoutes = require('./routes/auth');
const { syncNextWeek } = require('./jobs/syncAuctions');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auctions', auctionRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Her Salı 08:00 KST (Asia/Seoul) otomatik sync
cron.schedule('0 8 * * 2', () => {
  syncNextWeek().catch(err => console.error('[cron] Sync error:', err.message));
}, { timezone: 'Asia/Seoul' });

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log('Cron active: every Tuesday 08:00 KST');
});
