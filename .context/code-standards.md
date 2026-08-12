# Code Standards: VGROW CRM

## 1. Simplicity First
- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- If 200 lines could be 50, rewrite it.

## 2. Naming Conventions
- **Files/Folders:** PascalCase for React components (`Sidebar.jsx`). camelCase for logic/utils/backend files (`leadController.js`).
- **Variables/Functions:** camelCase (`calculateHealthScore`).
- **Constants:** UPPER_SNAKE_CASE (`MAX_LEAD_COUNT`).

## 3. CSS/Styling
- Use Vanilla CSS.
- Ensure unique IDs for interactive elements.
- Leverage modern CSS properties (flexbox, grid, custom properties for themes).
- Maintain visual excellence (vibrant colors, smooth micro-animations).

## 4. Surgical Changes
- Touch only what you must. Clean up only your own mess.
- Don't refactor things that aren't broken unless explicitly requested.
- Remove imports/variables/functions that your changes made unused.

## 5. Comments & Documentation
- Document complex business logic.
- Do not state the obvious (e.g., `// This returns the user`).
