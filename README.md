# vGrow AI CRM 🚀

> A world-class, enterprise-grade SaaS CRM platform designed for clarity, usability, and extreme productivity.

vGrow AI is a comprehensive Customer Relationship Management suite featuring dynamic RBAC, real-time telephony, Indian GST invoicing, and an integrated AI Agent workspace.

## 🌟 Key Features

*   **Atomic UI/UX:** Built on a custom, unified design language inspired by Apple and Linear. Features an intuitive Command Palette (`⌘K`), glassmorphic panels, and meticulously crafted micro-interactions.
*   **Intelligent Sales Pipeline:** Drag-and-drop Kanban boards with predictive lead scoring and automated activity logging.
*   **Telephony & Communications:** Deep Twilio integration for calls and WhatsApp Cloud API for automated messaging.
*   **Billing & Invoicing:** Fully compliant Indian GST invoicing engine integrated directly with Razorpay Webhooks.
*   **Agentic AI Studio:** Talk to "Karan" (your AI assistant) to query live CRM data, generate emails, and analyze lead health.

## 🏗️ Tech Stack

### Frontend
*   **Framework:** React 19 + Vite (TypeScript)
*   **Styling:** Custom Vanilla CSS Design System (Zero Tailwind/Bootstrap)
*   **Testing:** Playwright (End-to-End browser simulation)

### Backend
*   **Server:** Node.js + Express
*   **Database:** MariaDB via Prisma ORM
*   **Caching & Queues:** Redis + BullMQ (for asynchronous tasks)
*   **Testing:** Jest & Supertest

---

## 🚀 Getting Started (Local Development)

### Prerequisites
*   Node.js v20+
*   Docker & Docker Compose (optional, but recommended)

### Method 1: The Easy Way (Docker)
We have fully containerized the application. To boot the frontend, backend, MariaDB, and Redis all at once:

```bash
docker-compose up --build -d
```
*   **Frontend:** `http://localhost:80`
*   **Backend API:** `http://localhost:5000`

### Method 2: Manual Start

**1. Start the Backend:**
```bash
cd backend
npm install
# Ensure MariaDB and Redis are running on your machine
# Configure your .env (see .env.example)
npx prisma generate
npx prisma db push
npm run dev
```

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

---

## 🧪 Testing

vGrow AI is mathematically verified to work through a rigorous automated CI/CD pipeline.

**Run Backend API Tests:**
```bash
cd backend
npm test
```

**Run Frontend E2E Tests:**
```bash
cd frontend
npx playwright test
```

---

## 📖 Documentation

Extensive design and architecture documentation can be found in the `docs/design/` directory:
*   [DESIGN_SYSTEM.md](./docs/design/DESIGN_SYSTEM.md)
*   [USER_FLOWS.md](./docs/design/USER_FLOWS.md)
*   [COMPONENT_INVENTORY.md](./docs/design/COMPONENT_INVENTORY.md)

---

## 🛡️ CI/CD & Deployment

This repository utilizes **GitHub Actions**. On every push to the `main` branch, the pipeline will automatically install dependencies, provision a Chromium browser, and run both the Jest and Playwright test suites to ensure 100% stability before deployment.
