const Redis = require('ioredis');
require('dotenv').config();

let redisClient;

if (process.env.NODE_ENV === 'test') {
  // Mock Redis Client for tests
  redisClient = {
    on: () => {},
    get: async () => null,
    set: async () => 'OK',
    quit: async () => 'OK'
  };
} else {
  // Create Real Redis Client
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  redisClient.on('connect', () => {
    console.log('[REDIS] Connected to Redis server.');
  });

  redisClient.on('error', (err) => {
    console.error('[REDIS] Connection error:', err.message);
  });
}

module.exports = {
  redisClient
};
