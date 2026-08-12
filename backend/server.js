const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { seedDatabase } = require('./config/seeder');
const { errorHandler, requestLogger } = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);


// ── Security Headers ──
app.use(helmet());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const { redisClient } = require('./config/redis');
const { RedisStore } = require('rate-limit-redis');

// 🛡️ CORS – restrict to known origins 🛡️
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173'] : ['http://localhost:5173'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// 🔌 Socket.io Setup 🔌
const io = socketIo(server, { cors: corsOptions });
const socketService = require('./services/socketService');
socketService.init(io);

// ── Rate Limiting — protect auth routes from brute-force ──
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // max 10000 login/register attempts per window for testing
  message: { message: 'Too many requests. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ── Rate Limiting — global protection ──
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // max 10000 requests per window for testing
  message: { message: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', globalLimiter);

// ── Stripe Webhook (Must be before express.json) ──
const { stripeWebhook } = require('./controllers/stripeController');
app.post('/api/billing/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// ── Body Parser & XSS Prevention ──
app.use(express.json({ limit: '10mb' }));
app.use(xss()); // Sanitize req.body, req.query, req.params
app.use(requestLogger);

// ── Initialize Database & Seed ──
const initApp = async () => {
  await connectDB();
  await seedDatabase();
};

if (process.env.NODE_ENV !== 'test') {
  initApp();
}

// ── Apply rate limiter to auth routes ──
app.use('/api/auth', authLimiter);

// ── API Routes ──
app.use('/api', apiRoutes);
app.use('/api/billing/stripe', require('./routes/stripeRoutes'));

// ── Health Check ──
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ── Error handling middleware (must be last) ──
app.use(errorHandler);

// 🚀 Start Server 🚀
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  const activeServer = server.listen(PORT, () => {
    console.log(`[Server] vGrow running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
  });

  // Graceful Shutdown
  const shutdown = async (signal) => {
    console.log(`\n[${signal}] Shutting down gracefully...`);
    activeServer.close(async () => {
      console.log('HTTP server closed.');
      try {
        const { prisma } = require('./config/db');
        await prisma.$disconnect();
        console.log('Database connections closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = { app, server, io };
