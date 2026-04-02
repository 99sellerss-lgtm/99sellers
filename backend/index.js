const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ==========================================
// 1. INSTANT HEALTH CHECK (Must be first)
// ==========================================
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', up: true }));
app.get('/', (req, res) => res.status(200).send('99Sellers API V8 - Online'));

// ==========================================
// 2. START LISTENING IMMEDIATELY
// ==========================================
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🚀 [V8_SERVER] BOOTED INSTANTLY ON PORT ${PORT}`);
  console.log(`🌍 [V8_SERVER] HEALTH CHECK URL: ${process.env.RAILWAY_STATIC_URL || 'http://localhost'}:${PORT}/health`);

  // Heartbeat to keep process alive and logs moving
  setInterval(() => {
    console.log(`[ALIVE] ${new Date().toISOString()} - Event Loop Active`);
  }, 20000);

  // ==========================================
  // 3. BACKGROUND HEAVY LOADING
  // ==========================================
  try {
    console.log('[DEBUG_LOG] --- 🟢 STARTING BACKGROUND INIT ---');

    // Basic Middleware
    console.log('[DEBUG_LOG] Step 1: Setting up middleware...');
    app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Serve uploaded files statically
    const path = require('path');
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Load Database & Models
    console.log('[DEBUG_LOG] Step 2: Loading Sequelize Models...');
    const db = require('./models');
    const { sequelize } = db;

    console.log('[DEBUG_LOG] Step 3: Authenticating with DB...');
    console.log(`[DB_INFO] Host: ${process.env.MYSQLHOST || 'NOT_SET'}`);
    console.log(`[DB_INFO] User: ${process.env.MYSQLUSER || 'NOT_SET'}`);
    console.log(`[DB_INFO] Database: ${process.env.MYSQLDATABASE || 'NOT_SET'}`);

    await sequelize.authenticate();
    console.log('[DEBUG_LOG] Step 4: DB Connection SUCCESS.');

    // Debug endpoint - raw SQL counts
    app.get('/api/debug-counts', async (req, res) => {
      try {
        const [props] = await sequelize.query('SELECT COUNT(*) as c FROM property');
        const [users] = await sequelize.query('SELECT COUNT(*) as c FROM user_login');
        res.json({ success: true, property: props[0].c, user_login: users[0].c });
      } catch (e) { res.json({ error: e.message }); }
    });

    // Load Consolidated Routes
    console.log('[DEBUG_LOG] Step 5: Mounting API routes...');
    app.use('/api/admin', require('./routes/AdminCore_Routes'));
    app.use('/api', require('./routes/UserCore_Routes'));

    app.get('/api/test', (req, res) => res.json({ success: true, status: 'READY', time: new Date() }));

    // Sync & Seed in background
    console.log('[DEBUG_LOG] Step 6: Syncing models (background)...');
    await sequelize.sync();
    
    const { seedData } = require('./services/AppServices_Module');
    console.log('[DEBUG_LOG] Step 7: Starting seeding (background)...');
    await seedData();
    console.log('[DEBUG_LOG] --- ✅ BACKGROUND INIT COMPLETE. SYSTEM READY ---');

  } catch (err) {
    console.error('\n❌ [CRITICAL_INIT_ERROR] ❌');
    console.error('Message:', err.message);
    if (err.parent) console.error('Parent Cause:', err.parent.message);
    console.error('Check your Railway Environment Variables for matching names!');
  }
});

// Global Error Prevents
process.on('uncaughtException', (err) => console.error('[UNCAUGHT]', err));
process.on('unhandledRejection', (reason) => console.error('[UNHANDLED]', reason));

module.exports = app;