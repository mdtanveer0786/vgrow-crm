const { emailQueue } = require('./emailQueue');
const { whatsappQueue } = require('./whatsappQueue');
const { redisClient } = require('../config/redis');

// Test dispatch function to simulate a background job
const testQueueDispatch = async () => {
  try {
    if (redisClient.status === 'ready') {
      await emailQueue.add('sendWelcomeEmail', {
        to: 'vaibhav@vgrow.com',
        subject: 'Welcome to vGrow AI',
        body: 'Your CRM is now powered by Redis queues!'
      });
      console.log('[Queue] Test email job dispatched to queue.');
    } else {
      console.log('[Queue] Redis not ready. Skipping test dispatch.');
    }
  } catch (err) {
    console.error('[Queue] Error dispatching test job:', err.message);
  }
};

module.exports = {
  emailQueue,
  whatsappQueue,
  testQueueDispatch
};
