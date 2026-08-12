# vGrow AI - Security Test Suite

This document describes the automated security testing strategies implemented to prevent regressions.

## 1. Overview
The security tests are housed in `backend/tests/security.test.js`. They leverage Jest and Supertest to simulate malicious payloads and unauthorized requests against the live API endpoints.

## 2. Test Cases

### 2.1 RBAC Bypass (Privilege Escalation)
- **Objective**: Ensure that a user with stripped roles cannot access protected routes.
- **Method**: Registers a test user, deletes their roles directly via Prisma (`deleteMany`), and attempts to `GET /api/users`.
- **Expected Outcome**: `403 Forbidden` with a "No roles assigned" message.

### 2.2 Malicious File Uploads
- **Objective**: Ensure the server rejects non-allowed MIME types and potential XSS/RCE vectors.
- **Method**: Attempts to upload a `.js` script file containing a basic `console.log("xss")` payload disguised as a legitimate upload to `/api/upload`.
- **Expected Outcome**: Rejection by `multer` due to the `fileFilter`, preventing it from reaching Cloudinary or local storage.

### 2.3 File Size Exhaustion
- **Objective**: Prevent denial-of-service (DoS) and excessive storage costs.
- **Method**: Attempts to upload an 11MB buffer to the file upload endpoint.
- **Expected Outcome**: `400 Bad Request` or `500 Error` from the file size limit middleware.

## 3. Running the Tests
To execute the security test suite alongside unit tests:
```bash
npm run test
```
