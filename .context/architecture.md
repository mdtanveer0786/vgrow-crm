# Architecture: VGROW CRM

## 1. Technology Stack
- **Frontend:** React + Vite, vanilla CSS (no Tailwind), React Router DOM for routing.
- **Backend:** Node.js, Express.js.
- **Database:** SQLite (for now, via Sequelize ORM).
- **Icons:** Lucide React.

## 2. Data Flow
- Frontend communicates with Backend via RESTful API endpoints (`/api/v1/...`).
- Backend routes hit Controllers which apply business logic and interact with SQLite database via Sequelize models.
- Controllers return JSON responses back to the Frontend components which update their local React state.

## 3. System Boundaries
- **`frontend/src/components/`**: Pure UI components, reusable across pages.
- **`frontend/src/pages/`**: Stateful views representing specific routes (e.g., Dashboard).
- **`backend/routes/`**: Route definitions mapping URLs to Controller actions.
- **`backend/controllers/`**: Business logic, data formatting, and error handling.
- **`backend/models/`**: Sequelize database schemas and relationships.

## 4. Storage & State
- Database handles persistent storage (Leads, Accounts, Activities).
- Frontend uses React Context / local state for session/UI state.
