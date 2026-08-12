const { Queue, Worker } = require('bullmq');
const { redisClient } = require('../config/redis');

// 1. Create Queue
const whatsappQueue = new Queue('WhatsappQueue', { connection: redisClient });

// 2. Create Worker
const whatsappWorker = new Worker(
  'WhatsappQueue',
  async (job) => {
    const { phone, template, variables } = job.data;
    console.log(`[WhatsappWorker] Dispatching template '${template}' to ${phone}...`);
    
    // Simulate API call to WhatsApp Cloud API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`[WhatsappWorker] Successfully dispatched to ${phone}`);
    return { success: true, wamid: `wamid.HBgL${Date.now()}` };
  },
  { connection: redisClient }
);

whatsappWorker.on('completed', (job) => {
  console.log(`[WhatsappWorker] Job ${job.id} has completed!`);
});

whatsappWorker.on('failed', (job, err) => {
  console.log(`[WhatsappWorker] Job ${job.id} has failed with ${err.message}`);
});

module.exports = {
  whatsappQueue,
};
