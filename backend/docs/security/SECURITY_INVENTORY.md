# vGrow AI - Security Inventory

## 1. Scope
This document inventories all assets, boundaries, and dependencies for the vGrow AI CRM to establish the attack surface.

## 2. Infrastructure Components
- **Frontend App**: React, Vite, TailwindCSS (Hosted on Vercel/Netlify).
- **Backend API**: Node.js, Express.js.
- **Database**: MySQL (Accessed via Prisma ORM).
- **Cache/Queue**: Redis (Accessed via ioredis & BullMQ).
- **Storage**: Cloudinary (File/Image storage).

## 3. Data Assets
### Highly Sensitive
- User Credentials (Passwords, JWT secrets)
- Billing Information (Stripe webhooks/customer IDs)
- Integration Secrets (OpenAI, Twilio, WhatsApp tokens)

### Sensitive (Tenant Data)
- Leads (PII: Email, Phone, Name)
- Contacts (PII)
- Deals/Pipelines (Financial data)
- AI Transcripts / Inbox Messages

## 4. Attack Surfaces (Entry Points)
1. **Public API Endpoints** (`/api/auth/register`, `/api/auth/login`) - Vulnerable to brute force, credential stuffing, enumeration.
2. **Authenticated API Endpoints** (`/api/leads`, `/api/deals`, etc.) - Vulnerable to BOLA/IDOR, Privilege Escalation.
3. **Webhooks** (`/api/billing/stripe/webhook`, Razorpay) - Vulnerable to SSRF, Replay Attacks, Signature Forgery.
4. **File Uploads** - Vulnerable to malicious file execution (if stored locally) or excessive storage consumption.
5. **AI Interfaces** (`/api/ai/copilot`) - Vulnerable to Prompt Injection, Data Exfiltration, and unintended tool execution.

## 5. Security Controls Currently in Place
- **CORS**: Restricted to `CLIENT_URL`.
- **Helmet**: Adds security headers (HSTS, NoSniff, XSS filter).
- **Rate Limiting**: Global limit (10k/15m) and Auth limit (10k/15m) -> *Note: 10k for auth is too high, needs hardening.*
- **Authentication**: JWT based (Bearer tokens).
- **Passwords**: bcrypt hashing (Salt rounds = 10).
- **Validation**: Zod (applied to some routes).

## 6. Known Integrations
- OpenAI (Langchain)
- Twilio (Voice)
- WhatsApp (Meta Graph API)
- Stripe / Razorpay (Payments)
- Cloudinary (Media)
