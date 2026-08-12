# vGrow AI - Security Fixes Documentation

This document logs all the direct codebase modifications made to remediate vulnerabilities identified in the Security Audit.

## 1. Privilege Escalation (authMiddleware.js)
**Vulnerability**: A fallback condition allowed users with `userRoles.length === 0` to bypass the role authorization checks and hit Admin endpoints.
**Fix**: Removed the `return next()` fallback. Replaced it with an explicit `403 Forbidden` response for users lacking roles.
**Commit**: Fix privilege escalation where users with no roles could bypass RBAC.

## 2. Resource Exhaustion & Upload Security (uploadMiddleware.js)
**Vulnerability**: The Multer configuration lacked both a file size limit and MIME-type validation. An attacker could upload arbitrarily large files or malicious executables (e.g. `.html` payloads).
**Fix**: 
- Applied a strict 10MB `fileSize` limit.
- Applied a `fileFilter` to strictly allow only `image/jpeg`, `image/png`, `application/pdf`, `text/csv`, and Word documents.
**Commit**: Harden upload middleware to prevent large file exhaustion and arbitrary execution.

## 3. AI Prompt Injection (langchainService.js)
**Vulnerability**: The `systemPrompt` concatenated untrusted user queries and database content directly into the model's instructions without clear boundaries.
**Fix**: 
- Added an explicit `<untrusted_docs>` tag boundary.
- Added strict system instructions overriding any prompt injection attempts (e.g., "Ignore previous instructions").
- Enforced rules against exfiltrating raw passwords/tokens.
**Commit**: Mitigate AI prompt injection by enforcing strict boundaries in system prompt.
