const { Queue, Worker } = require('bullmq');
const { redisClient } = require('../config/redis');
const nodemailer = require('nodemailer');

const emailQueue = new Queue('EmailQueue', { connection: redisClient });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || 'dummy_user',
    pass: process.env.SMTP_PASS || 'dummy_pass'
  }
});

const emailWorker = new Worker(
  'EmailQueue',
  async (job) => {
    const { to, subject, body, html } = job.data;
    console.log(`[EmailWorker] Sending email to ${to}...`);
    
    // Actually send email using nodemailer
    const info = await transporter.sendMail({
      from: '"vGrow CRM" <noreply@vgrow.com>',
      to,
      subject,
      text: body,
      html: html || body
    });
    
    console.log(`[EmailWorker] Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  },
  { connection: redisClient }
);

emailWorker.on('completed', (job) => console.log(`[EmailWorker] Job ${job.id} completed.`));
emailWorker.on('failed', (job, err) => console.log(`[EmailWorker] Job ${job.id} failed: ${err.message}`));

module.exports = { emailQueue };
