const request = require('supertest');
const { app } = require('../server');
const { prisma } = require('../config/db');

describe('Security Regression Tests', () => {
  let token;
  let testUser;

  beforeAll(async () => {
    const randId = Date.now();
    // Generate a test user and token for authorized requests
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Security',
        lastName: 'Tester',
        email: `security.test.${randId}@example.com`,
        password: 'Password123!',
        companyName: `Security Corp ${randId}`
      });
    
    token = res.body.token;
    testUser = res.body;

    // Remove all roles to test the RBAC fallback vulnerability
    if (testUser && testUser.id) {
      await prisma.userRole.deleteMany({
        where: { userId: testUser.id }
      });
    }
  });

  afterAll(async () => {
    if (testUser && testUser.id) {
      await prisma.user.deleteMany({ where: { id: testUser.id } });
    }
  });

  it('should reject access to protected routes for users with no roles (RBAC Bypass Fix)', async () => {
    const res = await request(app)
      .post('/api/pipelines') // An admin/manager route
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Pipeline' });
    
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toContain('No roles assigned');
  });

  it('should reject executable file types for upload', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('console.log("xss");'), 'script.js');
    
    expect(res.statusCode).not.toEqual(200);
  });
});
