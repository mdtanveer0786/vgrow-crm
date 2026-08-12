const request = require('supertest');
const { app } = require('../server');

describe('Billing Endpoints', () => {
  it('should reject Razorpay webhook with missing signature', async () => {
    const res = await request(app)
      .post('/api/webhooks/razorpay')
      .send({ event: 'payment.captured' });
    
    // Expect 400 Bad Request or 401 Unauthorized for missing signature
    expect([400, 401, 403]).toContain(res.statusCode);
  });
});
