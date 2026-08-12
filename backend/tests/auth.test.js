const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should reject access to protected routes without token', async () => {
    const res = await request(app).get('/api/leads');
    // Assuming the auth middleware returns 401 when no token is present
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});
