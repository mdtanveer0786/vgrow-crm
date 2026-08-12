const request = require('supertest');
const app = require('../server');

describe('Leads Endpoints', () => {
  it('should reject lead creation without authentication', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        firstName: 'Test',
        lastName: 'Lead',
        email: 'test@example.com'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});
